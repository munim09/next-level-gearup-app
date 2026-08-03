"use client";

import { register } from "@/app/_actions/auth";
import type { RegisterState } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

const initialState: RegisterState = { success: false, message: "" };

export default function RegisterPage() {
    const [state, formAction, pending] = useActionState(register, initialState);
    const [redirected, setRedirected] = useState(false);
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            startTransition(() => {
                setRedirected(true);
            });
            toast.success(
                "Registration successful. Please click sign-in to sign-in to the account",
            );
            // router.replace("/auth/login");
        }
    }, [state]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                    <Link
                        href="/"
                        className="text-2xl font-bold text-indigo-700 tracking-tight"
                    >
                        GearUp
                    </Link>
                </div>
            </nav>

            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-white rounded-xl shadow-sm border p-8">
                    <h1 className="text-2xl font-bold text-center">
                        Create Account
                    </h1>
                    <p className="text-gray-500 text-sm text-center mt-1">
                        Join GearUp to start renting gear
                    </p>

                    {state.message && !state.success && (
                        <p
                            className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2"
                            role="alert"
                        >
                            {state.message}
                        </p>
                    )}

                    <form
                        action={formAction}
                        className="mt-6 space-y-5"
                        noValidate
                    >
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium mb-1"
                            >
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                            />
                            {state.errors?.name && (
                                <p className="text-xs text-red-500 mt-1">
                                    {state.errors.name[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium mb-1"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                            />
                            {state.errors?.email && (
                                <p className="text-xs text-red-500 mt-1">
                                    {state.errors.email[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium mb-1"
                            >
                                Password
                            </label>
                            <input
                                key={`pw-${Number(state.clearPasswords)}`}
                                id="password"
                                name="password"
                                type="password"
                                placeholder="At least 6 characters"
                                defaultValue=""
                                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                            />
                            {state.errors?.password && (
                                <p className="text-xs text-red-500 mt-1">
                                    {state.errors.password[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium mb-1"
                            >
                                Confirm Password
                            </label>
                            <input
                                key={`cpw-${Number(state.clearPasswords)}`}
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Repeat your password"
                                defaultValue=""
                                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                            />
                            {state.errors?.confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">
                                    {state.errors.confirmPassword[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <span className="block text-sm font-medium mb-2">
                                I want to join as
                            </span>
                            <div className="flex gap-3">
                                <label className="flex-1 border rounded-lg p-3 text-center cursor-pointer has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="CUSTOMER"
                                        defaultChecked
                                        className="hidden"
                                    />
                                    <span className="block font-medium text-sm">
                                        Customer
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Rent gear
                                    </span>
                                </label>
                                <label className="flex-1 border rounded-lg p-3 text-center cursor-pointer has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="PROVIDER"
                                        className="hidden"
                                    />
                                    <span className="block font-medium text-sm">
                                        Provider
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        List gear
                                    </span>
                                </label>
                            </div>
                            {state.errors?.role && (
                                <p className="text-xs text-red-500 mt-1">
                                    {state.errors.role[0]}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={pending}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {pending ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="text-indigo-600 font-medium hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
                &copy; 2026 GearUp. All rights reserved.
            </footer>
        </div>
    );
}
