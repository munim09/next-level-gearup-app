"use client";

import { createGear, updateGear } from "@/app/_actions/provider";
import type { Category, ProviderGear } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const inputClass =
    "w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white";

export default function ProviderGearForm({
    gear,
    categories,
    pageMode = false,
    onClose,
}: {
    gear: ProviderGear | null;
    categories: Category[];
    pageMode?: boolean;
    onClose?: () => void;
}) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [form, setForm] = useState(() => ({
        name: gear?.name ?? "",
        categoryId: gear?.categoryId ?? categories[0]?.id ?? "",
        brand: gear?.brand ?? "",
        model: gear?.model ?? "",
        description: gear?.description ?? "",
        imageUrl: gear?.imageUrl ?? "",
        dailyRentalPrice: gear?.dailyRentalPrice ?? "",
        stockQuantity: gear ? String(gear.stockQuantity) : "",
    }));

    function update(field: keyof typeof form, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const price = Number(form.dailyRentalPrice);
        const stock = Number(form.stockQuantity);

        if (!form.name.trim()) {
            toast.error("Gear name is required.");
            return;
        }
        if (!form.categoryId) {
            toast.error("Please select a category.");
            return;
        }
        if (!Number.isFinite(price) || price <= 0) {
            toast.error("Enter a valid daily rental price.");
            return;
        }
        if (!Number.isInteger(stock) || stock < 0) {
            toast.error("Enter a valid stock quantity.");
            return;
        }

        const payload = {
            categoryId: form.categoryId,
            name: form.name.trim(),
            brand: form.brand.trim() || undefined,
            model: form.model.trim() || undefined,
            description: form.description.trim() || undefined,
            imageUrl: form.imageUrl.trim() || undefined,
            dailyRentalPrice: price,
            stockQuantity: stock,
        };

        startTransition(async () => {
            const result = gear
                ? await updateGear(gear.id, payload)
                : await createGear(payload);
            if (result?.success) {
                toast.success(result.message);
                if (pageMode) {
                    router.push("/dashboard/provider");
                } else {
                    onClose?.();
                    router.refresh();
                }
            } else {
                toast.error(result?.message ?? "Something went wrong.");
            }
        });
    }

    const formBody = (
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4" noValidate>
            <div>
                <label
                    htmlFor="gear-name"
                    className="block text-sm font-medium mb-1"
                >
                    Name
                </label>
                <input
                    id="gear-name"
                    type="text"
                    placeholder="Eagle Racing Bike"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inputClass}
                />
            </div>

            <div>
                <label
                    htmlFor="gear-category"
                    className="block text-sm font-medium mb-1"
                >
                    Category
                </label>
                <select
                    id="gear-category"
                    value={form.categoryId}
                    onChange={(e) => update("categoryId", e.target.value)}
                    className={inputClass}
                >
                    {categories.length === 0 && (
                        <option value="">No categories</option>
                    )}
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="gear-brand"
                        className="block text-sm font-medium mb-1"
                    >
                        Brand
                    </label>
                    <input
                        id="gear-brand"
                        type="text"
                        placeholder="Trek"
                        value={form.brand}
                        onChange={(e) => update("brand", e.target.value)}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label
                        htmlFor="gear-model"
                        className="block text-sm font-medium mb-1"
                    >
                        Model
                    </label>
                    <input
                        id="gear-model"
                        type="text"
                        placeholder="X-Caliber 8"
                        value={form.model}
                        onChange={(e) => update("model", e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>

            <div>
                <label
                    htmlFor="gear-description"
                    className="block text-sm font-medium mb-1"
                >
                    Description
                </label>
                <textarea
                    id="gear-description"
                    rows={3}
                    placeholder="26 inch aluminum frame"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    className={inputClass}
                />
            </div>

            <div>
                <label
                    htmlFor="gear-image"
                    className="block text-sm font-medium mb-1"
                >
                    Image URL
                </label>
                <input
                    id="gear-image"
                    type="url"
                    placeholder="https://example.com/bike.jpg"
                    value={form.imageUrl}
                    onChange={(e) => update("imageUrl", e.target.value)}
                    className={inputClass}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="gear-price"
                        className="block text-sm font-medium mb-1"
                    >
                        Daily Rental Price ($)
                    </label>
                    <input
                        id="gear-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="450"
                        value={form.dailyRentalPrice}
                        onChange={(e) =>
                            update("dailyRentalPrice", e.target.value)
                        }
                        className={inputClass}
                    />
                </div>
                <div>
                    <label
                        htmlFor="gear-stock"
                        className="block text-sm font-medium mb-1"
                    >
                        Stock Quantity
                    </label>
                    <input
                        id="gear-stock"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="5"
                        value={form.stockQuantity}
                        onChange={(e) =>
                            update("stockQuantity", e.target.value)
                        }
                        className={inputClass}
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={pending}
                    className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {pending ? "Saving..." : gear ? "Save Changes" : "Add Gear"}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        if (pageMode) {
                            router.push("/dashboard/provider");
                        } else {
                            onClose?.();
                        }
                    }}
                    className="px-5 py-2.5 rounded-lg font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );

    if (pageMode) {
        return (
            <div className="bg-white rounded-xl shadow-sm border">
                <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-bold">Add New Gear</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Fill in the details below to list a new item.
                    </p>
                </div>
                {formBody}
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose?.();
            }}
        >
            <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
                    <h2 className="text-xl font-bold">
                        {gear ? "Update Gear" : "Add New Gear"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>
                {formBody}
            </div>
        </div>
    );
}
