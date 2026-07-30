"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type AuthUser = { name: string; email: string; role: string };

function getAuthUser(): AuthUser | null {
    if (typeof document === "undefined") return null;
    const row = document.cookie.split("; ").find((r) => r.startsWith("authUser="));
    if (!row) return null;
    try {
        return JSON.parse(decodeURIComponent(row.split("=")[1]));
    } catch {
        return null;
    }
}

export default function RentButton({ gearId, inStock }: { gearId: string; inStock: boolean }) {
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        setUser(getAuthUser());
        const handler = () => setUser(getAuthUser());
        window.addEventListener("auth-changed", handler);
        return () => window.removeEventListener("auth-changed", handler);
    }, []);

    if (!inStock) {
        return (
            <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
            >
                Out of Stock
            </button>
        );
    }

    if (!user) {
        return (
            <Link
                href="/auth/login"
                className="block w-full text-center bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
                Login to Rent
            </Link>
        );
    }

    return (
        <Link
            href={`/checkout?gear=${gearId}`}
            className="block w-full text-center bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
        >
            Rent Now
        </Link>
    );
}
