"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import ProfileDropdown from "./profile-dropdown";

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

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(() => {
            setUser(getAuthUser());
        });

        const interval = setInterval(() => setUser(getAuthUser()), 3000);
        const handleAuthChange = () => setUser(getAuthUser());
        window.addEventListener("auth-changed", handleAuthChange);
        return () => {
            clearInterval(interval);
            window.removeEventListener("auth-changed", handleAuthChange);
        };
    }, []);

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                <Link
                    href="/"
                    className="text-2xl font-bold text-indigo-700 tracking-tight"
                >
                    GearUp
                </Link>
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                    {user?.role !== "PROVIDER" && user?.role !== "ADMIN" && (
                        <>
                            <Link
                                href="/gear"
                                className="hover:text-indigo-600"
                            >
                                Browse Gear
                            </Link>

                            <Link
                                href="/providers"
                                className="hover:text-indigo-600"
                            >
                                Providers
                            </Link>
                        </>
                    )}
                    {/* <Link href="/gear" className="hover:text-indigo-600">
                        Browse Gear
                    </Link>
                    <Link href="/providers" className="hover:text-indigo-600">
                        Providers
                    </Link> */}
                    {user ? (
                        <ProfileDropdown user={user} />
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                className="hover:text-indigo-600"
                            >
                                Login
                            </Link>
                            <Link
                                href="/auth/register"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
            {open && (
                <div className="md:hidden bg-white border-t px-4 py-4 space-y-3 text-sm font-medium">
                    <Link
                        href="/gear"
                        className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                        Browse Gear
                    </Link>
                    <Link
                        href="/providers"
                        className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                        Providers
                    </Link>
                    {user ? (
                        <ProfileDropdown user={user} />
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                            >
                                Login
                            </Link>
                            <Link
                                href="/auth/register"
                                className="block px-3 py-2 rounded-lg bg-indigo-600 text-white text-center"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
