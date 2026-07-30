"use client";

import { login } from "@/app/_actions/auth";
import type { LoginState } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

const initialState: LoginState = { success: false, message: "" };

export default function LoginModal() {
    const router = useRouter();
    const [state, formAction, pending] = useActionState(
        login.bind(null, "modal"),
        initialState,
    );

    useEffect(() => {
        if (state.success) {
            window.dispatchEvent(new CustomEvent("auth-changed"));
            const timer = setTimeout(() => router.back(), 150);
            return () => clearTimeout(timer);
        }
    }, [state.success, router]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={(e) => {
                if (e.target === e.currentTarget) router.back();
            }}
        >
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl border p-8 mx-4">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <button
                        onClick={() => router.back()}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>
                <p className="text-gray-500 text-sm">
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

                <form action={formAction} className="mt-6 space-y-5" noValidate>
                    <div>
                        <label
                            htmlFor="modal-email"
                            className="block text-sm font-medium mb-1"
                        >
                            Email
                        </label>
                        <input
                            id="modal-email"
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
                            htmlFor="modal-password"
                            className="block text-sm font-medium mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="modal-password"
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
                        onClick={() => router.back()}
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
