"use client";

import { cancelRentalOrder } from "@/app/_actions/dashboard";
import type { RentalOrder } from "@/lib/types";
import { statusBadgeClass } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function CustomerOrders({
    rentals,
}: {
    rentals: RentalOrder[];
}) {
    const router = useRouter();
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [, startTransition] = useTransition();

    function handleCancel(orderId: string) {
        setCancellingId(orderId);
        startTransition(async () => {
            const result = await cancelRentalOrder(orderId);
            setCancellingId(null);
            if (result?.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result?.message ?? "Failed to cancel the order.");
            }
        });
    }

    if (rentals.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500">
                <p className="text-lg font-medium">No rental orders yet</p>
                <p className="text-sm mt-1">
                    Browse gear and place your first rental order.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {rentals.map((order) => (
                <div
                    key={order.id}
                    className="bg-white rounded-xl shadow-sm border overflow-hidden"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b bg-gray-50/50">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-semibold text-gray-700">
                                #{order.id.slice(0, 8)}
                            </span>
                            <span
                                className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadgeClass(
                                    order.status,
                                )}`}
                            >
                                {order.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">
                                {formatDate(order.rentalStartDate)}
                                <span className="mx-1">→</span>
                                {formatDate(order.rentalEndDate)}
                            </span>
                            <span className="font-bold text-indigo-700">
                                ${order.totalAmount}
                            </span>
                        </div>
                    </div>

                    <div className="px-5 py-4">
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                                        {item.gear.imageUrl ? (
                                            <Image
                                                src={item.gear.imageUrl}
                                                alt={item.gear.name}
                                                fill
                                                className="object-cover"
                                                sizes="48px"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-gray-400 text-xs">
                                                img
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">
                                            {item.gear.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.quantity} × $
                                            {item.dailyRentalPrice}/day
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="mt-3 text-xs text-gray-500">
                            Provider:{" "}
                            <span className="font-medium text-gray-700">
                                {order.provider.name}
                            </span>
                            {order.note && (
                                <>
                                    {" "}
                                    · Note:{" "}
                                    <span className="italic">{order.note}</span>
                                </>
                            )}
                        </p>

                        <div className="mt-4 flex flex-wrap justify-end gap-2">
                            {order.status === "CONFIRMED" && (
                                <Link
                                    href={`/dashboard/customer/orders/${order.id}/pay`}
                                    className="flex-1 sm:flex-none bg-indigo-600 text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 text-center"
                                >
                                    Pay Now
                                </Link>
                            )}
                            {order.status === "PLACED" && (
                                <button
                                    onClick={() => handleCancel(order.id)}
                                    disabled={cancellingId === order.id}
                                    className="flex-1 sm:flex-none border border-red-300 text-red-600 text-sm px-5 py-2 rounded-lg font-medium hover:bg-red-50 disabled:opacity-60"
                                >
                                    {cancellingId === order.id
                                        ? "Cancelling..."
                                        : "Cancel Order"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
