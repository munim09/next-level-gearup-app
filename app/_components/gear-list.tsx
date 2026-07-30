"use client";

import { fetchAllGear } from "@/app/_actions/gear";
import type { GearItem, PaginationInfo } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

function categoryColor(name: string) {
    const colors: Record<string, string> = {
        Cycling: "bg-indigo-100 text-indigo-700",
        Camping: "bg-green-100 text-green-700",
        "Water Sports": "bg-orange-100 text-orange-700",
        Fitness: "bg-purple-100 text-purple-700",
        "Winter Sports": "bg-red-100 text-red-700",
        "Team Sports": "bg-yellow-100 text-yellow-700",
    };
    return colors[name] ?? "bg-gray-100 text-gray-700";
}

function getCatName(cat: { name: string } | string | undefined): string {
    if (!cat) return "";
    return typeof cat === "string" ? cat : cat.name;
}

function GearGridSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl shadow-sm border overflow-hidden"
                    >
                        <div className="h-44 bg-gray-200" />
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-16" />
                            <div className="h-5 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                            <div className="h-5 bg-gray-200 rounded w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function GearList({
    params,
}: {
    params: Record<string, string>;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const [gear, setGear] = useState<GearItem[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
    });

    const [loading, setLoading] = useState(true);
    const [, startTransition] = useTransition();

    useEffect(() => {
        let cancelled = false;

        // startTransition(() => {
        //     setLoading(true);
        // });

        (async () => {
            try {
                const res = await fetchAllGear(params);

                if (cancelled) return;

                setGear(res.data);
                setPagination(res.pagination);
            } finally {
                if (!cancelled) {
                    startTransition(() => {
                        setLoading(false);
                    });
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [params]);

    function goToPage(page: number) {
        setLoading(true);
        const search = new URLSearchParams(params);

        if (page <= 1) {
            search.delete("page");
        } else {
            search.set("page", String(page));
        }

        const query = search.toString();

        router.push(query ? `${pathname}?${query}` : pathname);
    }

    if (loading) {
        return <GearGridSkeleton />;
    }

    if (!gear.length) {
        return (
            <div className="text-center py-20 text-gray-500">
                <p className="text-lg font-medium">No gear found</p>
                <p className="text-sm mt-1">
                    Try adjusting your search or filters.
                </p>
            </div>
        );
    }

    const currentPage = pagination.page;

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {gear.map((item) => (
                    <Link
                        key={item.id}
                        href={`/gear/${item.id}`}
                        className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition group"
                    >
                        <div className="relative h-44 bg-gray-200">
                            {item.imageUrl ? (
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-400">
                                    Gear Image
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <span
                                className={`text-xs px-2 py-1 rounded ${categoryColor(
                                    getCatName(item.category),
                                )}`}
                            >
                                {getCatName(item.category) || "General"}
                            </span>

                            <h3 className="mt-2 font-semibold text-lg">
                                {item.name}
                            </h3>

                            <p className="text-gray-500 text-sm">
                                {item.brand}
                            </p>

                            <div className="mt-3 flex justify-between items-center">
                                <span className="font-bold text-indigo-700">
                                    ${item.dailyRentalPrice}/day
                                </span>

                                <span className="border border-indigo-600 text-indigo-600 rounded-lg px-3 py-1.5">
                                    Rent Now
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {pagination.totalPages > 1 && (
                <div className="flex flex-col items-center gap-4 mt-12">
                    <div className="flex items-center gap-2">
                        {currentPage > 1 && (
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                className="px-3 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer"
                            >
                                Prev
                            </button>
                        )}
                        {Array.from(
                            { length: pagination.totalPages },
                            (_, i) => i + 1,
                        )
                            .filter(
                                (p) =>
                                    Math.abs(p - currentPage) <= 2 ||
                                    p === 1 ||
                                    p === pagination.totalPages,
                            )
                            .map((p, idx, arr) => (
                                <span key={p} className="flex items-center">
                                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                                        <span className="px-1 text-gray-400">
                                            ...
                                        </span>
                                    )}
                                    {p === currentPage ? (
                                        <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-semibold">
                                            {p}
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => goToPage(p)}
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium hover:bg-gray-50 cursor-pointer"
                                        >
                                            {p}
                                        </button>
                                    )}
                                </span>
                            ))}
                        {currentPage < pagination.totalPages && (
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                className="px-3 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer"
                            >
                                Next
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">
                        Showing page {currentPage} of {pagination.totalPages}
                    </p>
                </div>
            )}
            {/* {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                    {currentPage > 1 && (
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            className="px-3 py-2 border rounded"
                        >
                            Prev
                        </button>
                    )}

                    {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1,
                    ).map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-3 py-2 rounded ${
                                page === currentPage
                                    ? "bg-indigo-600 text-white"
                                    : "border"
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    {currentPage < pagination.totalPages && (
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            className="px-3 py-2 border rounded"
                        >
                            Next
                        </button>
                    )}
                </div>
            )} */}
        </>
    );
}
