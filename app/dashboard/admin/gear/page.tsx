import { fetchAdminGear } from "@/app/_actions/admin";
import { verifySession } from "@/app/_actions/session-verify";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import Pagination from "@/app/_components/pagination";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const LIMIT = 10;

function statusBadge(status: string) {
    return status === "ACTIVE"
        ? "bg-green-100 text-green-700"
        : "bg-amber-100 text-amber-700";
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default async function AdminGearPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await verifySession();

    if (!session.authenticated) {
        redirect("/auth/login");
    }

    const role =
        typeof session.user?.role === "string" ? session.user.role : "";
    if (role && role !== "ADMIN") {
        redirect(
            role === "CUSTOMER"
                ? "/dashboard/customer"
                : "/dashboard/provider",
        );
    }

    const sp = await searchParams;
    const currentPage = Math.max(Number(sp.page) || 1, 1);

    const { data: gear, pagination } = await fetchAdminGear({
        page: String(currentPage),
        limit: String(LIMIT),
    });

    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            All Gear
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Inspect every gear listing on the platform
                        </p>
                    </div>
                    <Link
                        href="/dashboard/admin"
                        className="text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {gear.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border text-center py-16 text-gray-500 mt-6">
                        <p className="text-lg font-medium">No gear found</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border overflow-x-auto mt-6">
                        <table className="w-full text-sm min-w-[820px]">
                            <thead>
                                <tr className="text-left text-gray-500 border-b bg-gray-50/50">
                                    <th className="px-5 py-3 font-medium">
                                        Gear
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Category
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Provider
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Price / Day
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Stock
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 font-medium">
                                        Added
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {gear.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b last:border-0 hover:bg-gray-50/50"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                                                    {item.imageUrl ? (
                                                        <Image
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                            sizes="48px"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-gray-400 text-xs">
                                                            img
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {[item.brand, item.model]
                                                            .filter(Boolean)
                                                            .join(" · ") ||
                                                            "—"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {item.category?.name ?? "—"}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {item.provider?.name ?? "—"}
                                        </td>
                                        <td className="px-5 py-4 font-semibold">
                                            ${item.dailyRentalPrice}
                                        </td>
                                        <td className="px-5 py-4">
                                            {item.stockQuantity}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(
                                                    item.status,
                                                )}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {formatDate(item.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination
                    basePath="/dashboard/admin/gear"
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                />
            </div>

            <Footer />
        </div>
    );
}
