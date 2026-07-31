"use client";

import { updateGearStock } from "@/app/_actions/provider";
import type { ProviderGear } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function ProviderStockModal({
    gear,
    onClose,
}: {
    gear: ProviderGear;
    onClose: () => void;
}) {
    const router = useRouter();
    const [value, setValue] = useState(String(gear.stockQuantity));
    const [pending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const stock = Number(value);
        if (!Number.isInteger(stock) || stock < 0) {
            toast.error("Stock must be a non-negative integer.");
            return;
        }

        startTransition(async () => {
            const result = await updateGearStock(gear.id, stock);
            if (result?.success) {
                toast.success(result.message);
                onClose();
                router.refresh();
            } else {
                toast.error(result?.message ?? "Failed to update stock.");
            }
        });
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border mx-4">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-bold">Update Stock</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="px-6 py-5 space-y-4"
                    noValidate
                >
                    <div>
                        <p className="text-sm text-gray-700 font-medium truncate">
                            {gear.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Current stock: {gear.stockQuantity}
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="stock-quantity"
                            className="block text-sm font-medium mb-1"
                        >
                            New Stock Quantity
                        </label>
                        <input
                            id="stock-quantity"
                            type="number"
                            min="0"
                            step="1"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                        />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="submit"
                            disabled={pending}
                            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {pending ? "Updating..." : "Update Stock"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
