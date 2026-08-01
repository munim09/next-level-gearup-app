// "use server";

// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// const API = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

// export async function placeRentalOrder(formData: FormData) {
//     const cookieStore = await cookies();
//     const accessToken = cookieStore.get("accessToken")?.value;

//     if (!accessToken) {
//         redirect("/auth/login");
//     }

//     const rentalStartDate = formData.get("rentalStartDate") as string;
//     const rentalEndDate = formData.get("rentalEndDate") as string;
//     const gearId = formData.get("gearId") as string;
//     const quantity = Number(formData.get("quantity")) || 1;
//     const note = (formData.get("note") as string) || undefined;

//     const body = {
//         rentalStartDate,
//         rentalEndDate,
//         note,
//         items: [{ gearId, quantity }],
//     };

//     const res = await fetch(`${API}/api/rentals`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(body),
//         cache: "no-store",
//     });

//     const result = await res.json();

//     if (!res.ok || !result.success) {
//         return { success: false, message: result.message || "Failed to place rental order" };
//     }

//     redirect("/dashboard/customer");
// }

"use server";

import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

export async function placeRentalOrder(formData: FormData) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return {
            success: false,
            message: "Please login first.",
        };
    }

    const body = {
        rentalStartDate: formData.get("rentalStartDate"),
        rentalEndDate: formData.get("rentalEndDate"),
        note: formData.get("note") || undefined,
        items: [
            {
                gearId: formData.get("gearId"),
                quantity: Number(formData.get("quantity")),
            },
        ],
    };
    const res = await fetch(`${API}/api/rentals`, {
        method: "POST",
        headers: {
            Cookie: `accessToken=${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    const result = await res.json();

    // return {
    //     success: res.ok && result.success,
    //     message: result.message,
    //     data: result.data,
    // };

    return result;
}

export interface RentalItemInput {
    gearId: string;
    quantity: number;
}

export async function placeMultiItemRentalOrder(
    items: RentalItemInput[],
    rentalStartDate: string,
    rentalEndDate: string,
    note?: string,
) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return {
            success: false,
            message: "Please login first.",
        };
    }

    if (!items.length) {
        return {
            success: false,
            message: "No gear selected.",
        };
    }

    const body = {
        rentalStartDate,
        rentalEndDate,
        note: note || undefined,
        items,
    };

    const res = await fetch(`${API}/api/rentals`, {
        method: "POST",
        headers: {
            Cookie: `accessToken=${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || !result?.success) {
        return {
            success: false,
            message:
                result?.message ||
                result?.error?.message ||
                "Failed to place rental order.",
        };
    }

    return result;
}
