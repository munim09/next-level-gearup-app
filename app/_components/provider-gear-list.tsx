"use client";

import { deleteGear } from "@/app/_actions/provider";
import type { Category, ProviderGear } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import ProviderGearForm from "./provider-gear-form";
import ProviderStockModal from "./provider-stock-modal";

export default function ProviderGearList({
    gear,
    categories,
}: {
    gear: ProviderGear[];
    categories: Category[];
}) {
    const router = useRouter();
    const [, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editing, setEditing] = useState<ProviderGear | null>(null);
    const [stockGear, setStockGear] = useState<ProviderGear | null>(null);

    function openEdit(item: ProviderGear) {
        setEditing(item);
    }

    function handleDelete(item: ProviderGear) {
        if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) {
            return;
        }
        setDeletingId(item.id);
        startTransition(async () => {
            const result = await deleteGear(item.id);
            setDeletingId(null);
            if (result?.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result?.message ?? "Failed to delete gear.");
            }
        });
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                    {gear.length} gear listed
                </p>
                <Link
                    href="/dashboard/provider/gear/new"
                    className="bg-indigo-600 text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-indigo-700"
                >
                    + Add New Gear
                </Link>
            </div>

            {gear.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border text-center py-16 text-gray-500">
                    <p className="text-lg font-medium">No gear listed yet</p>
                    <p className="text-sm mt-1">
                        Add your first gear to start renting it out.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
                    <table className="w-full text-sm min-w-[760px]">
                        <thead>
                            <tr className="text-left text-gray-500 border-b bg-gray-50/50">
                                <th className="px-5 py-3 font-medium">Gear</th>
                                <th className="px-5 py-3 font-medium">
                                    Category
                                </th>
                                <th className="px-5 py-3 font-medium">
                                    Price / Day
                                </th>
                                <th className="px-5 py-3 font-medium">Stock</th>
                                <th className="px-5 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-5 py-3 font-medium text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {gear.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b last:border-0 hover:bg-gray-50/50"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                                                {item.imageUrl ? (
                                                    <Image
                                                        src={item.imageUrl}
                                                        alt={item.name}
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
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {[item.brand, item.model]
                                                        .filter(Boolean)
                                                        .join(" · ") ||
                                                        "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-gray-600">
                                        {item.category?.name ?? "—"}
                                    </td>
                                    <td className="px-5 py-4 font-semibold">
                                        ${item.dailyRentalPrice}
                                    </td>
                                    <td className="px-5 py-4">
                                        <button
                                            onClick={() => setStockGear(item)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        >
                                            {item.stockQuantity}
                                            <span className="text-gray-400">
                                                ✎
                                            </span>
                                        </button>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                                item.status === "ACTIVE"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(item)}
                                                className="text-xs px-3 py-1.5 rounded-lg font-medium border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setStockGear(item)}
                                                className="text-xs px-3 py-1.5 rounded-lg font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
                                            >
                                                Stock
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(item)
                                                }
                                                disabled={
                                                    deletingId === item.id
                                                }
                                                className="text-xs px-3 py-1.5 rounded-lg font-medium border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                                            >
                                                {deletingId === item.id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editing && (
                <ProviderGearForm
                    key={editing.id}
                    gear={editing}
                    categories={categories}
                    onClose={() => setEditing(null)}
                />
            )}

            {stockGear && (
                <ProviderStockModal
                    key={stockGear.id}
                    gear={stockGear}
                    onClose={() => setStockGear(null)}
                />
            )}
        </>
    );
}
