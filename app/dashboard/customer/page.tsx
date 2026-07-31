import {
    fetchCustomerPayments,
    fetchCustomerRentals,
} from "@/app/_actions/dashboard";
import { verifySession } from "@/app/_actions/session-verify";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import type { RentalOrder } from "@/lib/types";
import { redirect } from "next/navigation";
import CustomerOrders from "../../_components/customer-orders";

const ACTIVE_STATUSES = ["PLACED", "CONFIRMED", "PAID", "PICKED_UP"];

export function statusBadgeClass(status: string) {
    switch (status) {
        case "PLACED":
            return "bg-amber-100 text-amber-700";
        case "CONFIRMED":
            return "bg-blue-100 text-blue-700";
        case "PAID":
            return "bg-purple-100 text-purple-700";
        case "PICKED_UP":
            return "bg-green-100 text-green-700";
        case "RETURNED":
            return "bg-gray-100 text-gray-700";
        case "CANCELLED":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatDateTime(value: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function paymentMethod(payment: {
    meta: Record<string, unknown> | null;
    stripePaymentIntentId: string | null;
}) {
    if (payment.meta && typeof payment.meta === "object") {
        const cardType = payment.meta.card_type;
        if (typeof cardType === "string" && cardType) return cardType;
    }
    if (payment.stripePaymentIntentId) return "Stripe";
    return "—";
}

export default async function CustomerDashboardPage() {
    const session = await verifySession();

    if (!session.authenticated) {
        redirect("/auth/login");
    }

    const role =
        typeof session.user?.role === "string" ? session.user.role : "";
    if (role && role !== "CUSTOMER") {
        redirect(
            role === "PROVIDER" ? "/dashboard/provider" : "/dashboard/admin",
        );
    }

    const [rentals, payments] = await Promise.all([
        fetchCustomerRentals(),
        fetchCustomerPayments(),
    ]);

    const activeRentals = rentals.filter((r) =>
        ACTIVE_STATUSES.includes(r.status),
    ).length;
    const totalSpent = payments.reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0,
    );
    const pendingPayments = rentals.filter(
        (r) => r.status === "PLACED" || r.status === "CONFIRMED",
    ).length;

    const sortedRentals = [...rentals].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const sortedPayments = [...payments].sort((a, b) =>
        (b.paidAt || b.createdAt) > (a.paidAt || a.createdAt) ? 1 : -1,
    );

    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            Customer Dashboard
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Track your rentals and payments
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-3xl font-bold mt-1">
                            {rentals.length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Active Rentals</p>
                        <p className="text-3xl font-bold mt-1 text-green-600">
                            {activeRentals}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Total Spent</p>
                        <p className="text-3xl font-bold mt-1 text-indigo-700">
                            ${totalSpent}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">
                            Awaiting Payment
                        </p>
                        <p className="text-3xl font-bold mt-1 text-amber-600">
                            {pendingPayments}
                        </p>
                    </div>
                </div>

                <section className="mt-10">
                    <h2 className="text-xl font-bold mb-4">My Rentals</h2>
                    <CustomerOrders rentals={sortedRentals as RentalOrder[]} />
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold mb-4">Payment History</h2>
                    {sortedPayments.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border text-center py-16 text-gray-500">
                            <p className="text-lg font-medium">
                                No payments yet
                            </p>
                            <p className="text-sm mt-1">
                                Your payment history will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
                            <table className="w-full text-sm min-w-[640px]">
                                <thead>
                                    <tr className="text-left text-gray-500 border-b bg-gray-50/50">
                                        <th className="px-5 py-3 font-medium">
                                            Transaction
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Amount
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Method
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Order
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Paid At
                                        </th>
                                        <th className="px-5 py-3 font-medium">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedPayments.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="border-b last:border-0 hover:bg-gray-50/50"
                                        >
                                            <td className="px-5 py-4 font-mono text-xs text-gray-700">
                                                {payment.tranId}
                                            </td>
                                            <td className="px-5 py-4 font-semibold">
                                                {payment.currency}{" "}
                                                {payment.amount}
                                            </td>
                                            <td className="px-5 py-4 text-gray-600">
                                                {paymentMethod(payment)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="text-xs">
                                                    <span className="font-medium text-gray-700">
                                                        #
                                                        {payment.rentalOrder.id.slice(
                                                            0,
                                                            8,
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`inline-block ml-2 px-2 py-0.5 rounded-full text-xs ${statusBadgeClass(
                                                            payment.rentalOrder
                                                                .status,
                                                        )}`}
                                                    >
                                                        {
                                                            payment.rentalOrder
                                                                .status
                                                        }
                                                    </span>
                                                    <p className="text-gray-400 mt-0.5">
                                                        {formatDate(
                                                            payment.rentalOrder
                                                                .rentalStartDate,
                                                        )}{" "}
                                                        →{" "}
                                                        {formatDate(
                                                            payment.rentalOrder
                                                                .rentalEndDate,
                                                        )}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-gray-600">
                                                {formatDateTime(payment.paidAt)}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                                        payment.status ===
                                                        "COMPLETED"
                                                            ? "bg-green-100 text-green-700"
                                                            : payment.status ===
                                                                "FAILED"
                                                              ? "bg-red-100 text-red-700"
                                                              : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                                >
                                                    {payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>

            <Footer />
        </div>
    );
}
