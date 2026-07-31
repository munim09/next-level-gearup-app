"use server";

import type { GearInput, ProviderGear, ProviderOrder } from "@/lib/types";
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

function actionResult(res: Response, body: unknown, fallback: string) {
    const result = body as {
        success?: boolean;
        message?: string;
        errors?: Record<string, string[]>;
    };

    if (!res.ok || !result.success) {
        const firstError = result.errors
            ? Object.values(result.errors).find((v) => v?.length)?.[0]
            : undefined;
        return {
            success: false,
            message: result.message || firstError || fallback,
        };
    }

    return { success: true, message: result.message || fallback };
}

export async function fetchProviderGear(
    providerId: string,
): Promise<ProviderGear[]> {
    try {
        const res = await authedFetch(
            `/api/gear/provider/${providerId}?page=1&limit=1000`,
        );
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

export async function fetchProviderOrders(): Promise<ProviderOrder[]> {
    try {
        const res = await authedFetch("/api/provider/orders?page=1&limit=100");
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

export async function createGear(input: GearInput) {
    const res = await authedFetch("/api/provider/gear", {
        method: "POST",
        body: JSON.stringify(input),
    });
    return actionResult(res, await res.json(), "Failed to add gear.");
}

export async function updateGear(gearId: string, input: GearInput) {
    const res = await authedFetch(`/api/provider/gear/${gearId}`, {
        method: "PUT",
        body: JSON.stringify(input),
    });

    const response = await res.json();

    if (response.success) {
        redirect("/dashboard/provider");
    }
    return actionResult(res, response, "Failed to update gear.");
}

export async function updateGearStock(gearId: string, stockQuantity: number) {
    const res = await authedFetch(`/api/provider/gear/${gearId}`, {
        method: "PATCH",
        body: JSON.stringify({ stockQuantity }),
    });
    const response = await res.json();

    if (response.success) {
        redirect("/dashboard/provider");
    }

    return actionResult(res, response, "Failed to update stock.");
}

export async function deleteGear(gearId: string) {
    const res = await authedFetch(`/api/provider/gear/${gearId}`, {
        method: "DELETE",
    });

    const response = await res.json();

    if (response.success) {
        redirect("/dashboard/provider");
    }
    return actionResult(res, response, "Failed to delete gear.");
}

export async function updateProviderOrderStatus(
    orderId: string,
    status: string,
) {
    const res = await authedFetch(`/api/provider/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
    return actionResult(
        res,
        await res.json(),
        "Failed to update order status.",
    );
}
