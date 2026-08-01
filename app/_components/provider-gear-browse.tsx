"use client";

import {
    placeMultiItemRentalOrder,
    type RentalItemInput,
} from "@/app/_actions/rentals";
import { verifySession } from "@/app/_actions/session-verify";
import type { ProviderGear } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import LoginModal from "./login-modal";

type CartItem = {
    gearId: string;
    name: string;
    price: number;
    imageUrl: string | null;
    category: string;
    stockQuantity: number;
    quantity: number;
};

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

export default function ProviderGearBrowse({
    gear,
}: {
    gear: ProviderGear[];
}) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pendingItem, setPendingItem] = useState<ProviderGear | null>(null);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    useEffect(() => {
        try {
            const saved = sessionStorage.getItem(
                `cart:${window.location.pathname}`,
            );
            if (saved) {
                startTransition(() => {
                    setCart(JSON.parse(saved));
                });
            }
        } catch {
            // ignore corrupted cart
        }
    }, []);

    useEffect(() => {
        try {
            if (cart.length > 0) {
                sessionStorage.setItem(
                    `cart:${window.location.pathname}`,
                    JSON.stringify(cart),
                );
            } else {
                sessionStorage.removeItem(
                    `cart:${window.location.pathname}`,
                );
            }
        } catch {
            // ignore storage errors
        }
    }, [cart]);

    const addToCart = useCallback((item: ProviderGear) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.gearId === item.id);
            if (existing) {
                return prev.map((c) =>
                    c.gearId === item.id
                        ? { ...c, quantity: Math.min(c.quantity + 1, c.stockQuantity) }
                        : c,
                );
            }
            return [
                ...prev,
                {
                    gearId: item.id,
                    name: item.name,
                    price: Number(item.dailyRentalPrice) || 0,
                    imageUrl: item.imageUrl,
                    category: getCatName(item.category),
                    stockQuantity: item.stockQuantity,
                    quantity: 1,
                },
            ];
        });
    }, []);

    async function handleAddToCart(item: ProviderGear) {
        if (item.stockQuantity <= 0) return;
        const session = await verifySession();
        if (!session.authenticated) {
            setPendingItem(item);
            setShowLogin(true);
            return;
        }
        addToCart(item);
    }

    function onLoginSuccess() {
        setShowLogin(false);
        if (pendingItem) {
            addToCart(pendingItem);
            toast.success(`${pendingItem.name} added to rental selection.`);
            setPendingItem(null);
        } else {
            setCheckoutOpen(true);
        }
    }

    const updateQuantity = useCallback((gearId: string, quantity: number) => {
        setCart((prev) =>
            prev.map((c) =>
                c.gearId === gearId
                    ? { ...c, quantity: Math.max(1, Math.min(quantity, c.stockQuantity)) }
                    : c,
            ),
        );
    }, []);

    const removeFromCart = useCallback((gearId: string) => {
        setCart((prev) => prev.filter((c) => c.gearId !== gearId));
    }, []);

    const totalPerDay = useMemo(
        () => cart.reduce((sum, c) => sum + c.price * c.quantity, 0),
        [cart],
    );

    const totalItems = useMemo(
        () => cart.reduce((sum, c) => sum + c.quantity, 0),
        [cart],
    );

    async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const form = e.currentTarget;
        const startDate = String(
            new FormData(form).get("rentalStartDate") || "",
        );
        const endDate = String(new FormData(form).get("rentalEndDate") || "");
        const note = String(new FormData(form).get("note") || "");

        if (!startDate || !endDate) {
            setError("Please select rental dates.");
            return;
        }
        if (new Date(endDate) < new Date(startDate)) {
            setError("End date cannot be before start date.");
            return;
        }
        if (cart.some((c) => c.quantity > c.stockQuantity)) {
            setError("Quantity exceeds available stock for some items.");
            return;
        }

        const session = await verifySession();
        if (!session.authenticated) {
            router.push("/auth/login");
            return;
        }

        const items: RentalItemInput[] = cart.map((c) => ({
            gearId: c.gearId,
            quantity: c.quantity,
        }));

        startTransition(async () => {
            const result = await placeMultiItemRentalOrder(
                items,
                startDate,
                endDate,
                note || undefined,
            );
            if (!result?.success) {
                setError(
                    result?.message ?? "Failed to place rental order.",
                );
                toast.error(result?.message ?? "Failed to place rental order.");
                return;
            }
            toast.success(result?.message ?? "Order placed");
            setCart([]);
            setCheckoutOpen(false);
        });
    }

    return (
        <>
            <p className="text-sm text-gray-500 mb-4">
                {gear.length} gear listed · Add multiple items then rent them all
                in one order.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gear.map((item) => {
                    const inCart = cart.find((c) => c.gearId === item.id);
                    const outOfStock = item.stockQuantity <= 0;

                    return (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition group flex flex-col"
                        >
                            <Link href={`/gear/${item.id}`} className="block">
                                <div className="relative h-44 bg-gray-200">
                                    {item.imageUrl ? (
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                                            inCart?.category ??
                                                getCatName(item.category),
                                        )}`}
                                    >
                                        {getCatName(item.category) || "General"}
                                    </span>

                                    <h3 className="mt-2 font-semibold text-lg truncate">
                                        {item.name}
                                    </h3>

                                    <p className="text-gray-500 text-sm truncate">
                                        {[item.brand, item.model]
                                            .filter(Boolean)
                                            .join(" · ") || "—"}
                                    </p>

                                    <div className="mt-3 flex justify-between items-center">
                                        <span className="font-bold text-indigo-700">
                                            ${item.dailyRentalPrice}/day
                                        </span>
                                        {outOfStock ? (
                                            <span className="text-xs text-red-500">
                                                Out of stock
                                            </span>
                                        ) : (
                                            <span className="text-xs text-green-600">
                                                {item.stockQuantity} in stock
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>

                            <div className="px-4 pb-4 mt-auto">
                                {inCart ? (
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        inCart.quantity - 1,
                                                    )
                                                }
                                                className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 cursor-pointer"
                                                aria-label="Decrease quantity"
                                            >
                                                −
                                            </button>
                                            <span className="px-2 text-sm font-medium min-w-8 text-center">
                                                {inCart.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        inCart.quantity + 1,
                                                    )
                                                }
                                                disabled={
                                                    inCart.quantity >=
                                                    item.stockQuantity
                                                }
                                                className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() =>
                                                removeFromCart(item.id)
                                            }
                                            className="text-sm text-red-600 hover:underline cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        disabled={outOfStock}
                                        className="w-full border border-indigo-600 text-indigo-600 rounded-lg px-3 py-1.5 font-medium hover:bg-indigo-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {outOfStock ? "Unavailable" : "Add to Rent"}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {cart.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
                        <div className="text-sm min-w-0">
                            <span className="font-semibold">
                                {totalItems} item{totalItems > 1 ? "s" : ""}
                            </span>
                            <span className="text-gray-500">
                                {" "}
                                · ${totalPerDay}/day
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setCart([]);
                                    setCheckoutOpen(false);
                                }}
                                className="text-sm text-gray-500 hover:text-gray-700 hover:underline cursor-pointer"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => {
                                    setError("");
                                    setCheckoutOpen(true);
                                }}
                                className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 cursor-pointer"
                            >
                                Review & Rent
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showLogin && (
                <LoginModal
                    onClose={() => {
                        setShowLogin(false);
                        setPendingItem(null);
                    }}
                    onSuccess={onLoginSuccess}
                />
            )}

            {checkoutOpen && cart.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white shadow-xl max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h2 className="text-lg font-semibold">
                                Review Your Rental
                            </h2>
                            <button
                                type="button"
                                onClick={() => setCheckoutOpen(false)}
                                className="text-2xl text-gray-400 hover:text-gray-600"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-3">
                                Items ({totalItems})
                            </h3>
                            <div className="space-y-3 mb-6">
                                {cart.map((c) => (
                                    <div
                                        key={c.gearId}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                                            {c.imageUrl ? (
                                                <Image
                                                    src={c.imageUrl}
                                                    alt={c.name}
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
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                {c.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                ${c.price}/day each
                                            </p>
                                        </div>
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(
                                                        c.gearId,
                                                        c.quantity - 1,
                                                    )
                                                }
                                                className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 cursor-pointer"
                                                aria-label="Decrease quantity"
                                            >
                                                −
                                            </button>
                                            <span className="px-1.5 text-sm font-medium min-w-7 text-center">
                                                {c.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(
                                                        c.gearId,
                                                        c.quantity + 1,
                                                    )
                                                }
                                                disabled={
                                                    c.quantity >= c.stockQuantity
                                                }
                                                className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFromCart(c.gearId)
                                            }
                                            className="text-gray-400 hover:text-red-600"
                                            aria-label={`Remove ${c.name}`}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between border-t border-dashed pt-4 mb-6">
                                <span className="text-sm text-gray-500">
                                    Estimated total / day
                                </span>
                                <span className="font-bold text-indigo-700 text-lg">
                                    ${totalPerDay}
                                </span>
                            </div>

                            <form onSubmit={handleCheckout} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            name="rentalStartDate"
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
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
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            required
                                            className="w-full rounded-lg border px-3 py-2 focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>
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

                                {error && (
                                    <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setCheckoutOpen(false)}
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
                                            ? "Placing Order..."
                                            : "Place Rental Order"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
