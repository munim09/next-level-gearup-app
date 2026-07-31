import { fetchRentalOrder } from "@/app/_actions/dashboard";
import { verifySession } from "@/app/_actions/session-verify";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import { statusBadgeClass } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PayButton from "../../../../../_components/pay-button";

function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default async function PayPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

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

    const order = await fetchRentalOrder(id);
    if (!order) notFound();

    const payable = order.status === "PLACED" || order.status === "CONFIRMED";

    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <nav className="text-sm text-gray-500 mb-6">
                    <Link
                        href="/dashboard/customer"
                        className="hover:text-indigo-600"
                    >
                        Dashboard
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-800 font-medium">
                        Pay for Order #{order.id.slice(0, 8)}
                    </span>
                </nav>

                <h1 className="text-2xl md:text-3xl font-bold">
                    Complete Your Payment
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    You will be redirected to the secure payment gateway.
                </p>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden mt-6">
                    <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/50">
                        <div>
                            <p className="text-sm text-gray-500">
                                Order #{order.id.slice(0, 8)}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadgeClass(
                                order.status,
                            )}`}
                        >
                            {order.status}
                        </span>
                    </div>

                    <div className="px-6 py-5 space-y-3">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4"
                            >
                                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                                    {item.gear.imageUrl ? (
                                        <Image
                                            src={item.gear.imageUrl}
                                            alt={item.gear.name}
                                            fill
                                            className="object-cover"
                                            sizes="56px"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-400 text-xs">
                                            img
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                        {item.gear.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {item.quantity} × $
                                        {item.dailyRentalPrice}/day
                                    </p>
                                </div>
                                <span className="text-sm font-semibold">
                                    $
                                    {Number(item.dailyRentalPrice) *
                                        item.quantity}
                                </span>
                            </div>
                        ))}

                        <div className="flex justify-between text-sm text-gray-500 pt-2">
                            <span>
                                {formatDate(order.rentalStartDate)} →{" "}
                                {formatDate(order.rentalEndDate)}
                            </span>
                            <span>Provider: {order.provider.name}</span>
                        </div>

                        <div className="flex items-center justify-between border-t pt-4">
                            <span className="font-semibold">Total Amount</span>
                            <span className="text-2xl font-bold text-indigo-700">
                                ${order.totalAmount}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    {payable ? (
                        <PayButton orderId={order.id} />
                    ) : (
                        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
                            This order is not eligible for payment (status:{" "}
                            {order.status}).{" "}
                            <Link
                                href="/dashboard/customer"
                                className="underline font-medium"
                            >
                                Back to dashboard
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
