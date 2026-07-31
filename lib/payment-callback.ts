import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

export interface OrderPaymentInfo {
    rentalOrderId: string;
    totalAmount: string;
    rentalStatus: string;
    payments: {
        id: string;
        tranId: string;
        amount: string;
        currency: string;
        status: string;
        paidAt: string | null;
        createdAt: string;
    }[];
}

export async function fetchOrderPaymentDetails(
    orderId: string,
): Promise<OrderPaymentInfo | null> {
    if (!orderId) return null;
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const res = await fetch(`${API}/api/payments/${orderId}`, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!res.ok) return null;
        const body = await res.json();

        console.log("body", body);
        const data = body?.data as {
            rentalOrderId?: string;
            totalAmount?: string;
            rentalStatus?: string;
            payments?: OrderPaymentInfo["payments"];
        } | null;
        if (!data) return null;
        return {
            rentalOrderId: data.rentalOrderId ?? orderId,
            totalAmount: data.totalAmount ?? "",
            rentalStatus: data.rentalStatus ?? "",
            payments: Array.isArray(data.payments) ? data.payments : [],
        };
    } catch {
        return null;
    }
}
