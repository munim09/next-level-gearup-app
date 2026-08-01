"use server";

import type { AdminUser } from "@/lib/types";
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

export async function fetchAdminUsers(): Promise<AdminUser[]> {
    try {
        const res = await authedFetch("/api/admin/users?page=1&limit=1000");
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

export async function updateUserStatus(userId: string, activeStatus: string) {
    const res = await authedFetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ activeStatus }),
    });

    const body = await res.json();

    if (!res.ok || !body.success) {
        return {
            success: false,
            message: body.message || "Failed to update user status.",
        };
    }

    return {
        success: true,
        message: body.message || "User status updated successfully.",
    };
}
