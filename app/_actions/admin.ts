"use server";

import type {
    AdminGear,
    AdminGearListResponse,
    AdminRentalOrder,
    AdminRentalOrderListResponse,
    AdminUser,
    PaginationInfo,
} from "@/lib/types";
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

const EMPTY_PAGINATION: PaginationInfo = {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
};

async function fetchPaginated<T>(
    path: string,
    params?: Record<string, string>,
): Promise<{ data: T[]; pagination: PaginationInfo }> {
    try {
        const qs = params ? "?" + new URLSearchParams(params).toString() : "";
        const res = await authedFetch(`${path}${qs}`);
        if (!res.ok) {
            return { data: [], pagination: EMPTY_PAGINATION };
        }
        const body = await res.json();
        const raw: T[] = body.data ?? body ?? [];
        const meta = body.meta ?? null;
        const reqPage = Number(params?.page) || 1;
        const reqLimit = Number(params?.limit) || 12;
        const total = meta?.total ?? raw.length;
        const limit = meta?.limit ?? reqLimit;
        const totalPages =
            meta?.totalPage ??
            meta?.totalPages ??
            (limit ? Math.ceil(total / limit) : 0);

        return {
            data: raw,
            pagination: {
                total,
                page: meta?.page ?? reqPage,
                limit,
                totalPages,
            },
        };
    } catch (err) {
        const digest = (err as { digest?: string } | null)?.digest;
        if (digest?.startsWith("NEXT_REDIRECT")) {
            throw err;
        }
        return { data: [], pagination: EMPTY_PAGINATION };
    }
}

export async function fetchAdminGear(
    params?: Record<string, string>,
): Promise<AdminGearListResponse> {
    return fetchPaginated<AdminGear>("/api/admin/gear", params);
}

export async function fetchAdminRentals(
    params?: Record<string, string>,
): Promise<AdminRentalOrderListResponse> {
    return fetchPaginated<AdminRentalOrder>("/api/admin/rentals", params);
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

export async function createCategory(input: {
    name: string;
    description?: string;
}) {
    const res = await authedFetch("/api/admin/category", {
        method: "POST",
        body: JSON.stringify(input),
    });

    const body = await res.json();

    if (!res.ok || !body.success) {
        return {
            success: false,
            message:
                body.message ||
                body.errors?.name?.[0] ||
                "Failed to create category.",
        };
    }

    return {
        success: true,
        message: body.message || "Category created successfully.",
    };
}
