"use client";

import { placeRentalOrder } from "@/app/_actions/rentals";
import type { GearDetail } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
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
    return colors[name] ?? "bg-indigo-100 text-indigo-700";
}

function getCatName(cat: { name: string } | string | undefined): string {
    if (!cat) return "";
    return typeof cat === "string" ? cat : cat.name;
}

export default function FeaturedGear({ gear }: { gear: GearDetail[] }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [showLogin, setShowLogin] = useState(false);
    const [rentTarget, setRentTarget] = useState<{
        gearId: string;
        gearName: string;
        providerName: string;
        stockQuantity?: number;
    } | null>(null);
    const [rentError, setRentError] = useState("");
    const [isPending, startRentTransition] = useTransition();
    const [showOrderSuccess, setShowOrderSuccess] = useState(false);

    useEffect(() => {
        startRentTransition(() => {
            setUser(getAuthUser());
        });

        const handler = () => setUser(getAuthUser());
        window.addEventListener("auth-changed", handler);
        return () => window.removeEventListener("auth-changed", handler);
    }, []);

    const openRent = useCallback(
        (item: GearDetail) => {
            const target = {
                gearId: item.id!,
                gearName: item.name,
                providerName: item.provider?.name ?? "",
                stockQuantity: item.stockQuantity,
            };
            if (!user) {
                setRentTarget(target);
                setShowLogin(true);
                return;
            }
            setRentTarget(target);
            setRentError("");
        },
        [user],
    );

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

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {gear.length === 0 &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-sm border overflow-hidden animate-pulse"
                        >
                            <div className="h-44 bg-gray-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 w-16 bg-gray-200 rounded" />
                                <div className="h-5 w-40 bg-gray-200 rounded" />
                                <div className="h-3 w-24 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                {gear.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition group"
                    >
                        <Link href={`/gear/${item.id}`} className="block">
                            <div className="h-44 bg-gray-200 flex items-center justify-center text-gray-400 text-sm relative">
                                {item.imageUrl ? (
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                ) : (
                                    "Gear Image"
                                )}
                            </div>
                            <div className="p-4">
                                <span
                                    className={`text-xs px-2 py-1 rounded ${categoryColor(getCatName(item.category))}`}
                                >
                                    {getCatName(item.category)}
                                </span>
                                <h3 className="mt-2 font-semibold text-lg group-hover:text-indigo-600 transition-colors">
                                    {item.name}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {item.brand ?? ""}
                                </p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-indigo-700 font-bold">
                                        ${item.dailyRentalPrice}
                                        <span className="text-sm font-normal text-gray-500">
                                            /day
                                        </span>
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
                                className="w-full text-sm border border-indigo-600 text-indigo-600 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-50 transition cursor-pointer"
                            >
                                Rent Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

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
                                Rent {rentTarget.gearName}
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
                                    defaultValue={1}
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
