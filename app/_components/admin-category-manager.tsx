"use client";

import { createCategory } from "@/app/_actions/admin";
import type { Category } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function AdminCategoryManager({
    categories,
}: {
    categories: Category[];
}) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const trimmed = name.trim();
        if (!trimmed) {
            setError("Category name is required.");
            return;
        }

        setError("");
        startTransition(async () => {
            const result = await createCategory({
                name: trimmed,
                description: description.trim() || undefined,
            });

            if (!result?.success) {
                setError(result?.message ?? "Failed to create category.");
                toast.error(result?.message ?? "Failed to create category.");
                return;
            }

            toast.success(result?.message ?? "Category created");
            setName("");
            setDescription("");
            router.refresh();
        });
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-lg">Add New Category</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Create a category to organize gear listings.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Cycling"
                            className="w-full rounded-lg border px-3 py-2 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Description (Optional)
                        </label>
                        <textarea
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            maxLength={250}
                            placeholder="e.g. Bicycles and cycling accessories"
                            className="w-full resize-none rounded-lg border px-3 py-2 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                    >
                        {isPending ? "Creating..." : "Create Category"}
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-lg">
                    Existing Categories ({categories.length})
                </h3>

                {categories.length === 0 ? (
                    <p className="text-sm text-gray-500 mt-4">
                        No categories yet. Create the first one.
                    </p>
                ) : (
                    <ul className="mt-4 space-y-2">
                        {categories.map((category) => (
                            <li
                                key={category.id}
                                className="flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm"
                            >
                                <span className="font-medium">
                                    {category.name}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                    {category.id.slice(0, 8)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
