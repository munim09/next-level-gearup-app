"use client";

import { initiatePayment } from "@/app/_actions/dashboard";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function PayButton({ orderId }: { orderId: string }) {
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    function handlePay() {
        setError("");
        startTransition(async () => {
            const result = await initiatePayment(orderId);

            console.log("result", result);

            if (!result?.success) {
                const message =
                    result?.message ?? "Failed to initiate payment.";
                setError(message);
                toast.error(message);
                return;
            }

            const gatewayUrl = result.data?.gatewayUrl;
            if (gatewayUrl) {
                window.location.href = gatewayUrl;
            } else {
                setError("Payment gateway URL is missing.");
                toast.error("Payment gateway URL is missing.");
            }
        });
    }

    return (
        <div>
            {error && (
                <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <button
                onClick={handlePay}
                disabled={isPending}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending ? "Redirecting to Secure Payment..." : "Pay Now"}
            </button>
        </div>
    );
}
