import { fetchAdminRentals } from "@/app/_actions/admin";
import { verifySession } from "@/app/_actions/session-verify";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import Pagination from "@/app/_components/pagination";
import { statusBadgeClass } from "@/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

const LIMIT = 10;

function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function shortId(id: string) {
    return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

export default async function AdminRentalOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await verifySession();

    if (!session.authenticated) {
        redirect("/auth/login");
    }

    const role =
        typeof session.user?.role === "string" ? session.user.role : "";
    if (role && role !== "ADMIN") {
        redirect(
            role === "CUSTOMER"
                ? "/dashboard/customer"
                : "/dashboard/provider",
        );
    }

    const sp = await searchParams;
    const currentPage = Math.max(Number(sp.page) || 1, 1);

    const { data: orders, pagination } = await fetchAdminRentals({
        page: String(currentPage),
        limit: String(LIMIT),
    });

    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            Rental Orders
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Inspect every rental order on the platform
                        </p>
                    </div>
                    <Link
                        href="/dashboard/admin"
                        className="text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border text-center py-16 text-gray-500 mt-6">
                        <p className="text-lg font-medium">
                            No rental orders found
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border overflow-x-auto mt-6">
                        <table className="w-full text-sm min-w-[900px]">
                            <thead>
                                <tr className="text-left text-gray-500 border-b bg-gray-50/50">
                                    <th className="px-5 py-3 font-medium">
                                        Order
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Customer
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Provider
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Rental Period
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Items
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Total
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Placed
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b last:border-0 hover:bg-gray-50/50"
                                    >
                                        <td className="px-5 py-4 font-mono text-xs text-gray-500">
                                            {shortId(order.id)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-medium truncate">
                                                {order.customer?.name ?? "—"}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {order.customer?.email ?? ""}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {order.provider?.name ?? "—"}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {formatDate(
                                                order.rentalStartDate,
                                            )}{" "}
                                            → {formatDate(order.rentalEndDate)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
                                                {order.items?.length ?? 0} items
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 font-semibold">
                                            ${order.totalAmount}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadgeClass(
                                                    order.status,
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {formatDate(order.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination
                    basePath="/dashboard/admin/rentalorder"
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                />
            </div>

            <Footer />
        </div>
    );
}
