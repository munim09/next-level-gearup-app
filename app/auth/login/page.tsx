"use client";

import { login } from "@/app/_actions/auth";
import type { LoginState } from "@/lib/types";
import Link from "next/link";
import { useActionState } from "react";

const initialState: LoginState = { success: false, message: "" };

export default function LoginPage() {
    const [state, formAction, pending] = useActionState(
        login.bind(null, "login"),
        initialState,
    );

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
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 text-sm text-center mt-1">
                        Sign in to your GearUp account
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
                                defaultValue={state.inputs?.email ?? ""}
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
                                id="password"
                                name="password"
                                type="password"
                                placeholder="At least 6 characters"
                                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                            />
                            {state.errors?.password && (
                                <p className="text-xs text-red-500 mt-1">
                                    {state.errors.password[0]}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={pending}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {pending ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/auth/register"
                            className="text-indigo-600 font-medium hover:underline"
                        >
                            Sign Up
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
