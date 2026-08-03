"use client";

import { fetchAllGear } from "@/app/_actions/gear";
import { placeRentalOrder } from "@/app/_actions/rentals";
import { verifySession } from "@/app/_actions/session-verify";
import type { GearDetail, PaginationInfo } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import LoginModal from "./login-modal";
import OrderSuccessModal from "./order-success-modal";

type AuthUser = { name: string; email: string; role: string };

function getAuthUser(): AuthUser | null {
    if (typeof document === "undefined") return null;
    const row = document.cookie
        .split("; ")
        .find((r) => r.startsWith("authUser="));
    if (!row) return null;
    try {
        return JSON.parse(decodeURIComponent(row.split("=")[1]));
    } catch {
        return null;
    }
}

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

    const [gear, setGear] = useState<GearDetail[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 0,
    });

    const [loading, setLoading] = useState(true);
    const [, startTransition] = useTransition();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [showLogin, setShowLogin] = useState(false);
    const [rentTarget, setRentTarget] = useState<{
        gearId: string;
        gearName?: string;
        providerName?: string;
        price: number;
        stockQuantity?: number;
    } | null>(null);
    const [rentError, setRentError] = useState("");
    const [isPending, startRentTransition] = useTransition();
    const [showOrderSuccess, setShowOrderSuccess] = useState(false);
    const [rentalStartDate, setRentalStartDate] = useState("");
    const [rentalEndDate, setRentalEndDate] = useState("");
    const [rentQuantity, setRentQuantity] = useState(1);

    useEffect(() => {
        startTransition(() => {
            setUser(getAuthUser());
        });
        const handler = () => setUser(getAuthUser());
        window.addEventListener("auth-changed", handler);
        return () => window.removeEventListener("auth-changed", handler);
    }, []);

    useEffect(() => {
        let cancelled = false;

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

    const openRent = useCallback(
        async (item: GearDetail) => {
            const session = await verifySession();
            console.log("session", session);
            setRentalStartDate("");
            setRentalEndDate("");
            setRentQuantity(1);
            if (!session.authenticated) {
                router.refresh(); // refreshes server components and cookies

                setUser(null);

                setRentTarget({
                    gearId: item.id!,
                    gearName: item.name,
                    providerName: item.provider?.name ?? "",
                    price: item.dailyRentalPrice,
                    stockQuantity: item.stockQuantity,
                });

                setShowLogin(true);
                return;
            }

            setUser({
                name: session?.user.name ?? "",
                email: session?.user.email ?? "",
                role: session?.user.role ?? "",
            });

            setRentTarget({
                gearId: item.id!,
                gearName: item.name,
                providerName: item.provider?.name ?? "",
                price: item.dailyRentalPrice,
                stockQuantity: item.stockQuantity,
            });

            setRentError("");
        },
        [router],
    );

    // const openRent = useCallback(
    //     (item: GearDetail) => {
    //         if (!user) {
    //             setRentTarget({
    //                 gearId: item.id!,
    //                 gearName: item.name,
    //                 providerName: item.provider?.name ?? "",
    //                 stockQuantity: item.stockQuantity,
    //             });
    //             setShowLogin(true);
    //             return;
    //         }
    //         setRentTarget({
    //             gearId: item.id!,
    //             gearName: item.name,
    //             providerName: item.provider?.name ?? "",
    //             stockQuantity: item.stockQuantity,
    //         });
    //         setRentError("");
    //     },
    //     [user],
    // );

    function onLoginSuccess() {
        setShowLogin(false);
        setUser(getAuthUser());
    }

    function validateRentForm(formData: FormData): string | null {
        const startDate = String(formData.get("rentalStartDate") || "");
        const endDate = String(formData.get("rentalEndDate") || "");
        const quantity = Number(formData.get("quantity"));

        if (!startDate || !endDate) return "Please select rental dates.";
        if (new Date(endDate) < new Date(startDate))
            return "End date cannot be before start date.";
        if (quantity < 1) return "Quantity must be at least 1.";
        if (rentTarget?.stockQuantity && quantity > rentTarget.stockQuantity)
            return `Only ${rentTarget.stockQuantity} item(s) available.`;

        return null;
    }

    function handleRentSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const error = validateRentForm(formData);
        if (error) {
            setRentError(error);
            return;
        }
        setRentError("");

        startRentTransition(async () => {
            const result = await placeRentalOrder(formData);
            if (!result?.success) {
                setRentError(
                    result?.message ?? "Failed to place rental order.",
                );
                toast.error(result?.message ?? "Failed to place rental order.");
                return;
            }
            toast.success(result?.message ?? "Order placed");
            setRentTarget(null);
            setShowOrderSuccess(true);
        });
    }

    const rentalDays = useMemo(() => {
        if (!rentalStartDate || !rentalEndDate) return 0;
        const [sy, sm, sd] = rentalStartDate.split("-").map(Number);
        const [ey, em, ed] = rentalEndDate.split("-").map(Number);
        const start = new Date(sy, sm - 1, sd);
        const end = new Date(ey, em - 1, ed);
        if (end < start) return 0;
        return Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
    }, [rentalStartDate, rentalEndDate]);

    const totalPerDay = (rentTarget?.price ?? 0) * rentQuantity;
    const totalAmount = totalPerDay * rentalDays;

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
                    <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition group"
                    >
                        <Link href={`/gear/${item.id}`} className="block">
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

                                <p className="text-green-500 text-sm">
                                    {item.stockQuantity} available
                                </p>
                                <div className="mt-3 flex justify-between items-center">
                                    <span className="font-bold text-indigo-700">
                                        ${item.dailyRentalPrice}/day
                                    </span>
                                </div>
                            </div>
                        </Link>

                        <div className="px-4 pb-4">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    openRent(item);
                                }}
                                className="w-full border border-indigo-600 text-indigo-600 rounded-lg px-3 py-1.5 font-medium hover:bg-indigo-50 transition cursor-pointer"
                            >
                                Rent Now
                            </button>
                        </div>
                    </div>
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

            {showLogin && (
                <LoginModal
                    onClose={() => {
                        setShowLogin(false);
                        setRentTarget(null);
                    }}
                    onSuccess={onLoginSuccess}
                />
            )}

            {showOrderSuccess && (
                <OrderSuccessModal
                    onClose={() => setShowOrderSuccess(false)}
                />
            )}

            {rentTarget && user && !showLogin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h2 className="text-lg font-semibold">
                                Rent: {rentTarget.gearName}
                            </h2>
                            <button
                                type="button"
                                onClick={() => {
                                    setRentTarget(null);
                                    setRentError("");
                                }}
                                className="text-2xl text-gray-400 hover:text-gray-600"
                            >
                                &times;
                            </button>
                        </div>

                        <form
                            onSubmit={handleRentSubmit}
                            className="space-y-5 p-6"
                        >
                            <input
                                type="hidden"
                                name="gearId"
                                value={rentTarget.gearId}
                            />

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    name="rentalStartDate"
                                    value={rentalStartDate}
                                    onChange={(e) =>
                                        setRentalStartDate(e.target.value)
                                    }
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                    className="w-full rounded-lg border px-3 py-2 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    name="rentalEndDate"
                                    value={rentalEndDate}
                                    onChange={(e) =>
                                        setRentalEndDate(e.target.value)
                                    }
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                    className="w-full rounded-lg border px-3 py-2 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={rentQuantity}
                                    onChange={(e) =>
                                        setRentQuantity(Number(e.target.value))
                                    }
                                    min={1}
                                    max={rentTarget.stockQuantity ?? 999}
                                    className="w-full rounded-lg border px-3 py-2 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Note (Optional)
                                </label>
                                <textarea
                                    name="note"
                                    rows={3}
                                    maxLength={250}
                                    placeholder="Need delivery before noon..."
                                    className="w-full resize-none rounded-lg border px-3 py-2 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm">
                                <div className="flex items-center justify-between text-gray-500">
                                    <span>Per day</span>
                                    <span>${totalPerDay.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-500">
                                    <span>Rental days</span>
                                    <span>
                                        {rentalDays
                                            ? `${rentalDays} day${
                                                  rentalDays > 1 ? "s" : ""
                                              }`
                                            : "—"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-gray-700">
                                        Total amount
                                    </span>
                                    <span className="font-bold text-indigo-700">
                                        {rentalDays
                                            ? `$${totalAmount.toFixed(2)}`
                                            : "—"}
                                    </span>
                                </div>
                            </div>

                            {rentError && (
                                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                                    {rentError}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRentTarget(null);
                                        setRentError("");
                                    }}
                                    disabled={isPending}
                                    className="flex-1 rounded-lg border py-2 font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isPending
                                        ? "Placing Order..."
                                        : "Confirm Rental"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
