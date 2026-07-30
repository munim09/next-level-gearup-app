import type {
    Category,
    GearDetail,
    GearItem,
    GearListResponse,
    Review,
} from "@/lib/types";

const API = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

export async function fetchFeaturedGear(): Promise<GearItem[]> {
    try {
        const res = await fetch(`${API}/api/gear?limit=4`, {
            cache: "no-cache",
            next: { revalidate: 60 },
        });
        if (!res.ok) return [];
        const body = await res.json();
        return body.data ?? body ?? [];
    } catch {
        return [];
    }
}

export async function fetchAllGear(
    params?: Record<string, string>,
): Promise<GearListResponse> {
    try {
        const qs = params ? "?" + new URLSearchParams(params).toString() : "";
        const res = await fetch(`${API}/api/gear${qs}`, {
            cache: "no-cache",
            next: { revalidate: 30 },
        });
        if (!res.ok)
            return {
                data: [],
                pagination: { total: 0, page: 1, limit: 12, totalPages: 0 },
            };
        const body = await res.json();
        return {
            data: body.data ?? body ?? [],
            pagination: body.pagination ?? {
                total: 0,
                page: 1,
                limit: 12,
                totalPages: 0,
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
        return body.data ?? body ?? null;
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
        return body.data ?? body ?? [];
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
        const raw: { _id?: string; id?: string; name: string }[] =
            body.data?.categories ?? body.data ?? body ?? [];
        return raw.map((cat) => ({ id: cat.id ?? cat._id ?? "", name: cat.name }));
    } catch {
        return [];
    }
}
