"use server";

import type { Payment, RentalOrder } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

async function authedFetch(path: string, init?: RequestInit) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        redirect("/auth/login");
    }

    const res = await fetch(`${API}${path}`, {
        ...init,
        headers: {
            ...(init?.headers ?? {}),
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });

    return res;
}

export async function fetchCustomerRentals(): Promise<RentalOrder[]> {
    try {
        const res = await authedFetch("/api/rentals?limit=500");
        if (!res.ok) return [];
        const body = await res.json();
        return body.data ?? [];
    } catch (err) {
        const digest = (err as { digest?: string } | null)?.digest;
        if (digest?.startsWith("NEXT_REDIRECT")) {
            throw err;
        }
        return [];
    }
}

export async function fetchRentalOrder(
    orderId: string,
): Promise<RentalOrder | null> {
    try {
        const res = await authedFetch(`/api/rentals/${orderId}`);
        if (!res.ok) return null;
        const body = await res.json();
        return body.data?.order ?? body.data ?? null;
    } catch (err) {
        const digest = (err as { digest?: string } | null)?.digest;
        if (digest?.startsWith("NEXT_REDIRECT")) {
            throw err;
        }
        return null;
    }
}

export async function fetchCustomerPayments(): Promise<Payment[]> {
    try {
        const res = await authedFetch("/api/payments?limit=50");
        if (!res.ok) return [];
        const body = await res.json();
        return body.data ?? [];
    } catch (err) {
        const digest = (err as { digest?: string } | null)?.digest;
        if (digest?.startsWith("NEXT_REDIRECT")) {
            throw err;
        }
        return [];
    }
}

export async function cancelRentalOrder(orderId: string) {
    const res = await authedFetch(`/api/rentals/cancel/${orderId}`, {
        method: "PATCH",
    });

    const body = await res.json();

    if (!res.ok || !body.success) {
        return {
            success: false,
            message: body.message || "Failed to cancel the order.",
        };
    }

    return {
        success: true,
        message: body.message || "Order cancelled successfully.",
    };
}

export async function submitReview(
    gearId: string,
    input: { rating: number; comment: string },
) {
    const res = await authedFetch(`/api/reviews/${gearId}`, {
        method: "POST",
        body: JSON.stringify(input),
    });

    const body = await res.json();

    if (!res.ok || !body.success) {
        return {
            success: false,
            message: body.message || "Failed to submit review.",
        };
    }

    return {
        success: true,
        message: body.message || "Review submitted successfully.",
    };
}

export async function initiatePayment(orderId: string) {
    const res = await authedFetch(`/api/payments/create/${orderId}`, {
        method: "POST",
    });

    const body = await res.json();

    if (!res.ok || !body.success) {
        return {
            success: false,
            message: body.message || "Failed to initiate payment.",
        };
    }

    return {
        success: true,
        message: body.message || "Payment initiated",
        data: body.data as { gatewayUrl?: string; tranId?: string },
    };
}
