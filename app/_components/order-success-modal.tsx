"use client";

import Link from "next/link";

export default function OrderSuccessModal({
    onClose,
}: {
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <svg
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h2 className="mt-4 text-xl font-bold">
                    Order Placed Successfully!
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Your rental order has been confirmed. You can track it from
                    your dashboard.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                    <Link
                        href="/dashboard/customer"
                        onClick={onClose}
                        className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700 text-center"
                    >
                        Go to My Dashboard
                    </Link>
                    <button
                        onClick={onClose}
                        className="w-full rounded-lg border py-2.5 font-medium hover:bg-gray-50"
                    >
                        Continue Browsing
                    </button>
                </div>
            </div>
        </div>
    );
}
