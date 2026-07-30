import { fetchAllGear, fetchCategories } from "@/app/_actions/gear";
import Footer from "@/app/_components/footer";
import GearFilter from "@/app/_components/gear-filter";
import GearSearch from "@/app/_components/gear-search";
import Navbar from "@/app/_components/navbar";
import Image from "next/image";
import Link from "next/link";

function categoryColor(name: string) {
    const colors: Record<string, string> = {
        Cycling: "bg-indigo-100 text-indigo-700",
        Camping: "bg-green-100 text-green-700",
        "Water Sports": "bg-orange-100 text-orange-700",
        Fitness: "bg-purple-100 text-purple-700",
        "Winter Sports": "bg-red-100 text-red-700",
        "Team Sports": "bg-yellow-100 text-yellow-700",
    };
    return colors[name] ?? "bg-gray-100 text-gray-700";
}

function getCatName(cat: { name: string } | string | undefined): string {
    if (!cat) return "";
    return typeof cat === "string" ? cat : cat.name;
}

export default async function GearPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const sp = await searchParams;
    const params: Record<string, string> = {};
    if (sp.search) params.search = String(sp.search);
    if (sp.category) params.categoryId = String(sp.category);
    if (sp.minPrice) params.minPrice = String(sp.minPrice);
    if (sp.maxPrice) params.maxPrice = String(sp.maxPrice);
    if (sp.page) params.page = String(sp.page);

    const [categories, { data: gear, pagination }] = await Promise.all([
        fetchCategories(),
        fetchAllGear(params),
    ]);

    console.log("categories", categories);

    const currentPage = pagination.page;

    function buildLink(delta: number) {
        const p = new URLSearchParams(params);
        const newPage = currentPage + delta;
        if (newPage <= 1) p.delete("page");
        else p.set("page", String(newPage));
        const q = p.toString();
        return `/gear${q ? "?" + q : ""}`;
    }

    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold">
                        Browse All Gear
                    </h1>
                    <p className="mt-2 text-indigo-100">
                        Find the perfect equipment for your next adventure
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col lg:flex-row gap-8">
                <GearFilter categories={categories} />

                <div className="flex-1 min-w-0">
                    <GearSearch initial={sp.search ? String(sp.search) : ""} />

                    {gear.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <p className="text-lg font-medium">No gear found</p>
                            <p className="text-sm mt-1">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                                {gear.map((item) => (
                                    <Link
                                        key={item._id || item.id}
                                        href={`/gear/${item._id || item.id}`}
                                        className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition group"
                                    >
                                        <div className="h-44 bg-gray-200 flex items-center justify-center text-gray-400 text-sm relative">
                                            {item.images?.[0] ? (
                                                <Image
                                                    src={item.images[0]}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                />
                                            ) : (
                                                <span>Gear Image</span>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <span
                                                className={`text-xs px-2 py-1 rounded ${categoryColor(getCatName(item.category))}`}
                                            >
                                                {getCatName(item.category) ||
                                                    "General"}
                                            </span>
                                            <h3 className="mt-2 font-semibold text-lg group-hover:text-indigo-600 transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                {item.brand ?? ""}
                                            </p>
                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="text-indigo-700 font-bold">
                                                    ${item.pricePerDay}
                                                    <span className="text-sm font-normal text-gray-500">
                                                        /day
                                                    </span>
                                                </span>
                                                <span className="text-sm border border-indigo-600 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                                                    Rent Now
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-center gap-4 mt-12">
                                    {currentPage > 1 && (
                                        <Link
                                            href={buildLink(-1)}
                                            className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    {Array.from(
                                        { length: pagination.totalPages },
                                        (_, i) => i + 1,
                                    )
                                        .filter(
                                            (p) =>
                                                Math.abs(p - currentPage) <=
                                                    1 ||
                                                p === 1 ||
                                                p === pagination.totalPages,
                                        )
                                        .map((p, idx, arr) => (
                                            <span
                                                key={p}
                                                className="flex items-center gap-1"
                                            >
                                                {idx > 0 &&
                                                    arr[idx - 1] !== p - 1 && (
                                                        <span className="text-gray-400">
                                                            ...
                                                        </span>
                                                    )}
                                                {p === currentPage ? (
                                                    <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-semibold">
                                                        {p}
                                                    </span>
                                                ) : (
                                                    <Link
                                                        href={`/gear?${new URLSearchParams({ ...params, page: String(p) }).toString()}`}
                                                        className="w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium hover:bg-gray-50"
                                                    >
                                                        {p}
                                                    </Link>
                                                )}
                                            </span>
                                        ))}
                                    {currentPage < pagination.totalPages && (
                                        <Link
                                            href={buildLink(1)}
                                            className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
