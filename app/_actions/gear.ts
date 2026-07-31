"use server";

import type {
    Category,
    GearDetail,
    GearItem,
    GearListResponse,
    Review,
} from "@/lib/types";
import { unstable_noStore as noStore } from "next/cache";

const API = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

interface RawGear {
    id: string;
    name: string;
    dailyRentalPrice?: string | number;
    brand?: string;
    imageUrl?: string;
    stockQuantity?: number;
    category?: { id: string; name: string } | string;
    images?: string[];
    stock?: number;
    [key: string]: unknown;
}

function mapGearItem(raw: RawGear): GearItem {
    return {
        id: raw.id,
        name: raw.name,
        dailyRentalPrice: Number(raw.dailyRentalPrice),
        brand: raw.brand ?? undefined,
        category: raw.category,
        imageUrl: raw.imageUrl,
        stockQuantity: raw.stockQuantity ?? undefined,
    };
}

export async function fetchFeaturedGear(): Promise<GearDetail[]> {
    try {
        const res = await fetch(`${API}/api/gear?limit=4`, {
            cache: "no-cache",
            next: { revalidate: 60 },
        });
        if (!res.ok) return [];
        const body = await res.json();
        const raw: RawGear[] = body.data ?? body ?? [];
        return body.data;
        // return raw.map(mapGearItem);
    } catch {
        return [];
    }
}

export async function fetchAllGear(
    params?: Record<string, string>,
): Promise<GearListResponse> {
    noStore();
    try {
        const qs = params ? "?" + new URLSearchParams(params).toString() : "";
        const res = await fetch(`${API}/api/gear${qs}`, {
            cache: "no-cache",
        });
        if (!res.ok)
            return {
                data: [],
                pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
            };
        const body = await res.json();
        const raw: RawGear[] = body.data ?? body ?? [];

        const p = body.pagination ?? body.meta ?? null;
        const totalHeader =
            res.headers.get("x-total-count") ||
            res.headers.get("X-Total-Count");
        const reqPage = Number(params?.page) || 1;
        const reqLimit = Number(params?.limit) || 12;

        if (p) {
            return {
                data: body.data,
                pagination: {
                    total: p.total ?? Number(totalHeader) ?? raw.length,
                    page: p.page ?? reqPage,
                    limit: p.limit ?? reqLimit,
                    totalPages:
                        p.totalPages ??
                        Math.ceil(
                            (p.total ?? raw.length) / (p.limit ?? reqLimit),
                        ),
                },
            };
        }

        const total = totalHeader ? Number(totalHeader) : raw.length;
        return {
            data: raw.map(mapGearItem),
            pagination: {
                total,
                page: reqPage,
                limit: reqLimit,
                totalPages: Math.ceil(total / reqLimit) || 1,
            },
        };
    } catch {
        return {
            data: [],
            pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
        };
    }
}

export async function fetchGearById(id: string): Promise<GearDetail | null> {
    try {
        const res = await fetch(`${API}/api/gear/${id}`, {
            cache: "no-cache",
            next: { revalidate: 30 },
        });
        if (!res.ok) return null;
        const body = await res.json();

        const raw: RawGear = body.data ?? body ?? null;
        if (!raw) return null;
        const mapped = mapGearItem(raw);

        return body.data.gear;

        // return {
        //     ...mapped,
        //     description:
        //         (body.data?.description as string) ??
        //         (raw.description as string) ??
        //         undefined,
        //     location:
        //         (body.data?.location as string) ??
        //         (raw.location as string) ??
        //         undefined,
        //     provider:
        //         (body.data?.provider as GearDetail["provider"]) ??
        //         (raw.provider as GearDetail["provider"]) ??
        //         undefined,
        //     category: raw.category,
        // } as GearDetail;
    } catch {
        return null;
    }
}

export async function fetchReviews(gearId: string): Promise<Review[]> {
    try {
        const res = await fetch(`${API}/api/reviews/${gearId}`, {
            cache: "no-cache",
            next: { revalidate: 30 },
        });

        if (!res.ok) return [];
        const body = await res.json();

        return body.data.reviews ?? body.data ?? body ?? [];
    } catch {
        return [];
    }
}

export async function fetchCategories(): Promise<Category[]> {
    try {
        const res = await fetch(`${API}/api/categories`, {
            cache: "no-cache",
            next: { revalidate: 120 },
        });

        if (!res.ok) return [];
        const body = await res.json();
        const raw: { id?: string; name: string }[] =
            body.data?.categories ?? body.data ?? body ?? [];
        return raw.map((cat) => ({
            id: cat.id ?? "",
            name: cat.name,
        }));
    } catch {
        return [];
    }
}
