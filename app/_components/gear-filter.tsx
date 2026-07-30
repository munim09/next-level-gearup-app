"use client";

import type { Category } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function GearFilter({ categories }: { categories: Category[] }) {
    const pathname = usePathname();
    const router = useRouter();
    const sp = useSearchParams();

    const currentCategory = sp.get("category") || "";
    const [minPrice, setMinPrice] = useState(sp.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(sp.get("maxPrice") || "");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    function handleCategoryChange(catId: string) {
        const params = new URLSearchParams(sp.toString());
        if (catId && catId !== currentCategory) {
            params.set("category", catId);
        } else {
            params.delete("category");
        }
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    }

    function applyPriceFilters() {
        const params = new URLSearchParams(sp.toString());
        if (minPrice) params.set("minPrice", minPrice);
        else params.delete("minPrice");
        if (maxPrice) params.set("maxPrice", maxPrice);
        else params.delete("maxPrice");
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
        setSidebarOpen(false);
    }

    function clearFilters() {
        setMinPrice("");
        setMaxPrice("");
        router.push(pathname);
    }

    const hasFilters = currentCategory || minPrice || maxPrice;

    return (
        <>
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-indigo-600 bg-white border rounded-lg px-4 py-2.5 hover:bg-indigo-50 w-full justify-center mb-4"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm4 6a1 1 0 011-1h8a1 1 0 010 2H8a1 1 0 01-1-1zm2 6a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z"
                    />
                </svg>
                Filters
            </button>

            <aside
                className={`lg:w-64 shrink-0 ${sidebarOpen ? "block" : "hidden"} lg:block`}
            >
                <div className="bg-white rounded-xl shadow-sm border p-5 space-y-6">
                    <div>
                        <h3 className="font-semibold mb-3">Category</h3>
                        <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                            {categories.map((cat) => (
                                <label
                                    key={cat.id}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={currentCategory === cat.id}
                                        onChange={() => handleCategoryChange(cat.id)}
                                        className="accent-indigo-600"
                                    />
                                    {cat.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Price Range</h3>
                        <div className="flex gap-2 items-center text-sm">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <button
                            onClick={applyPriceFilters}
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 cursor-pointer"
                        >
                            Apply Price
                        </button>
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
