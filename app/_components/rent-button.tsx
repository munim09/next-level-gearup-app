// "use client";

// import { placeRentalOrder } from "@/app/_actions/rentals";
// import Link from "next/link";
// import { useEffect, useState, useTransition } from "react";

// type AuthUser = { name: string; email: string; role: string };

// function getAuthUser(): AuthUser | null {
//     if (typeof document === "undefined") return null;
//     const row = document.cookie
//         .split("; ")
//         .find((r) => r.startsWith("authUser="));
//     if (!row) return null;
//     try {
//         return JSON.parse(decodeURIComponent(row.split("=")[1]));
//     } catch {
//         return null;
//     }
// }

// export default function RentButton({
//     gearId,
//     inStock,
//     stockQuantity,
// }: {
//     gearId: string;
//     inStock: boolean;
//     stockQuantity?: number;
// }) {
//     const [user, setUser] = useState<AuthUser | null>(null);
//     const [open, setOpen] = useState(false);
//     const [error, setError] = useState("");

//     const [isPending, startTransition] = useTransition();

//     useEffect(() => {
//         startTransition(() => {
//             setUser(getAuthUser());
//         });

//         const handler = () => setUser(getAuthUser());
//         window.addEventListener("auth-changed", handler);
//         return () => window.removeEventListener("auth-changed", handler);
//     }, []);

//     async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//         e.preventDefault();
//         setError("");

//         const form = e.currentTarget;
//         const startDate = (
//             form.elements.nativeElement.rentalStartDate as HTMLInputElement
//         ).value;
//         const endDate = (
//             form.elements.nativeElement.rentalEndDate as HTMLInputElement
//         ).value;

//         if (!startDate || !endDate) {
//             setError("Both start and end dates are required");
//             return;
//         }
//         if (new Date(endDate) < new Date(startDate)) {
//             setError("End date cannot be before start date");
//             return;
//         }

//         const fd = new FormData(form);
//         const result = await placeRentalOrder(fd);
//         if (result && "success" in result && !result.success) {
//             setError(result.message || "Failed to place rental order");
//         }
//     }

//     if (!inStock) {
//         return (
//             <button
//                 disabled
//                 className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
//             >
//                 Out of Stock
//             </button>
//         );
//     }

//     if (!user) {
//         return (
//             <Link
//                 href="/auth/login"
//                 className="block w-full text-center bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
//             >
//                 Login to Rent
//             </Link>
//         );
//     }

//     return (
//         <>
//             <button
//                 onClick={() => setOpen(true)}
//                 className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
//             >
//                 Rent Now
//             </button>

//             {open && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//                     <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
//                         <div className="flex items-center justify-between mb-4">
//                             <h2 className="text-lg font-bold">
//                                 Rent This Gear
//                             </h2>
//                             <button
//                                 onClick={() => setOpen(false)}
//                                 className="text-gray-400 hover:text-gray-600 text-xl leading-none"
//                             >
//                                 &times;
//                             </button>
//                         </div>

//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <input type="hidden" name="gearId" value={gearId} />

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Start Date
//                                 </label>
//                                 <input
//                                     type="date"
//                                     name="rentalStartDate"
//                                     required
//                                     min={new Date().toISOString().split("T")[0]}
//                                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     End Date
//                                 </label>
//                                 <input
//                                     type="date"
//                                     name="rentalEndDate"
//                                     required
//                                     min={new Date().toISOString().split("T")[0]}
//                                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Quantity
//                                 </label>
//                                 <input
//                                     type="number"
//                                     name="quantity"
//                                     min={1}
//                                     max={stockQuantity ?? 99}
//                                     defaultValue={1}
//                                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Note (optional)
//                                 </label>
//                                 <textarea
//                                     name="note"
//                                     rows={2}
//                                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
//                                 />
//                             </div>

//                             {error && (
//                                 <p className="text-sm text-red-600">{error}</p>
//                             )}

//                             <div className="flex gap-3 pt-2">
//                                 <button
//                                     type="button"
//                                     onClick={() => setOpen(false)}
//                                     className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700"
//                                 >
//                                     Confirm Rental
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

"use client";

import { placeRentalOrder } from "@/app/_actions/rentals";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import OrderSuccessModal from "./order-success-modal";

type AuthUser = {
    name: string;
    email: string;
    role: string;
};

function getAuthUser(): AuthUser | null {
    if (typeof document === "undefined") return null;

    const row = document.cookie
        .split("; ")
        .find((r) => r.startsWith("authUser="));

    if (!row) return null;

    try {
        return JSON.parse(decodeURIComponent(row.split("=")[1]));
    } catch {
        return null;
    }
}

export default function RentButton({
    gearId,
    inStock,
    stockQuantity,
}: {
    gearId: string;
    inStock: boolean;
    stockQuantity?: number;
}) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(() => {
            setUser(getAuthUser());
        });

        const handler = () => {
            setUser(getAuthUser());
        };

        window.addEventListener("auth-changed", handler);

        return () => {
            window.removeEventListener("auth-changed", handler);
        };
    }, []);

    function validateForm(formData: FormData): string | null {
        const startDate = String(formData.get("rentalStartDate") || "");
        const endDate = String(formData.get("rentalEndDate") || "");
        const quantity = Number(formData.get("quantity"));

        if (!startDate || !endDate) {
            return "Please select rental dates.";
        }

        if (new Date(endDate) < new Date(startDate)) {
            return "End date cannot be before start date.";
        }

        if (quantity < 1) {
            return "Quantity must be at least 1.";
        }

        if (stockQuantity && quantity > stockQuantity) {
            return `Only ${stockQuantity} item(s) available.`;
        }

        return null;
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const validationError = validateForm(formData);

        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");

        startTransition(async () => {
            const result = await placeRentalOrder(formData);

            if (!result?.success) {
                setError(result?.message ?? "Failed to place rental order.");
                toast.error(result?.message ?? "Failed to place rental order.");
                return;
            } else {
                toast.success(result?.message ?? "Order placed");
            }

            form.reset();
            setOpen(false);
            setShowSuccess(true);
        });
    }

    if (!inStock) {
        return (
            <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
            >
                Out of Stock
            </button>
        );
    }

    if (!user) {
        return (
            <Link
                href="/auth/login"
                className="block w-full text-center bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
                Login to Rent
            </Link>
        );
    }

    return (
        <>
            <button
                onClick={() => {
                    setError("");
                    setOpen(true);
                }}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
                Rent Now
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h2 className="text-lg font-semibold">
                                Rent This Gear
                            </h2>

                            <button
                                type="button"
                                onClick={() => {
                                    setOpen(false);
                                    setError("");
                                }}
                                className="text-2xl text-gray-400 hover:text-gray-600"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 p-6">
                            <input type="hidden" name="gearId" value={gearId} />

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    name="rentalStartDate"
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                    className="w-full rounded-lg border px-3 py-2 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    name="rentalEndDate"
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                    className="w-full rounded-lg border px-3 py-2 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    defaultValue={1}
                                    min={1}
                                    max={stockQuantity ?? 999}
                                    className="w-full rounded-lg border px-3 py-2 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Note (Optional)
                                </label>

                                <textarea
                                    name="note"
                                    rows={3}
                                    maxLength={250}
                                    placeholder="Need delivery before noon..."
                                    className="w-full resize-none rounded-lg border px-3 py-2 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            {error && (
                                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpen(false);
                                        setError("");
                                    }}
                                    disabled={isPending}
                                    className="flex-1 rounded-lg border py-2 font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isPending
                                        ? "Placing Order..."
                                        : "Confirm Rental"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showSuccess && (
                <OrderSuccessModal onClose={() => setShowSuccess(false)} />
            )}
        </>
    );
}
