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
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    function openModal() {
        setError("");
        setName("");
        setDescription("");
        setOpen(true);
    }

    function closeModal() {
        if (isPending) return;
        setOpen(false);
        setError("");
    }

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
            setOpen(false);
            setName("");
            setDescription("");
            router.refresh();
        });
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                    {categories.length} categories
                </p>
                <button
                    onClick={openModal}
                    className="bg-indigo-600 text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 cursor-pointer"
                >
                    + Add Category
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
                {categories.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No categories yet. Create the first one.
                    </p>
                ) : (
                    <ul className="space-y-2">
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

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h2 className="text-lg font-semibold">
                                Add New Category
                            </h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-2xl text-gray-400 hover:text-gray-600"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 p-6">
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
                                    autoFocus
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
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
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

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isPending}
                                    className="flex-1 rounded-lg border py-2 font-medium hover:bg-gray-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                                >
                                    {isPending
                                        ? "Creating..."
                                        : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
