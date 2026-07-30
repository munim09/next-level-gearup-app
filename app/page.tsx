import { fetchFeaturedGear } from "@/app/_actions/gear";
import Footer from "@/app/_components/footer";
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
    return colors[name] ?? "bg-indigo-100 text-indigo-700";
}

function getCatName(cat: { name: string } | string | undefined): string {
    if (!cat) return "";
    return typeof cat === "string" ? cat : cat.name;
}

export default async function HomePage() {
    const gear = await fetchFeaturedGear();

    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            {/* Hero */}
            <section className="relative bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                        Rent Sports & Outdoor Gear Instantly
                    </h1>
                    <p className="mt-4 text-lg text-indigo-100 max-w-2xl mx-auto">
                        Browse high-quality gear from trusted providers. Rent by
                        the day and return when you&apos;re done.
                    </p>
                    <div className="mt-8 max-w-xl mx-auto flex gap-2">
                        <input
                            type="text"
                            placeholder="Search gear by name..."
                            className="flex-1 px-4 py-3 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-3 rounded-lg">
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Gear */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Featured Gear</h2>
                    <Link
                        href="/gear"
                        className="text-indigo-600 hover:underline text-sm font-medium"
                    >
                        View All
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {gear.length === 0 &&
                        Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl shadow-sm border overflow-hidden animate-pulse"
                            >
                                <div className="h-44 bg-gray-200" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 w-16 bg-gray-200 rounded" />
                                    <div className="h-5 w-40 bg-gray-200 rounded" />
                                    <div className="h-3 w-24 bg-gray-200 rounded" />
                                </div>
                            </div>
                        ))}
                    {gear.map((item) => (
                        <Link
                            key={item.id || item.id}
                            href={`/gear/${item.id}`}
                            className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition group"
                        >
                            <div className="h-44 bg-gray-200 flex items-center justify-center text-gray-400 text-sm relative">
                                {item.imageUrl ? (
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                ) : (
                                    "Gear Image"
                                )}
                            </div>
                            <div className="p-4">
                                <span
                                    className={`text-xs px-2 py-1 rounded ${categoryColor(getCatName(item.category))}`}
                                >
                                    {getCatName(item.category)}
                                </span>
                                <h3 className="mt-2 font-semibold text-lg group-hover:text-indigo-600 transition-colors">
                                    {item.name}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {item.brand ?? ""}
                                </p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-indigo-700 font-bold">
                                        ${item.dailyRentalPrice}
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
            </section>

            {/* Categories */}
            <section className="bg-white py-16 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold mb-8">
                        Browse by Category
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            "Cycling",
                            "Camping",
                            "Water Sports",
                            "Fitness",
                            "Winter Sports",
                            "Team Sports",
                        ].map((cat) => (
                            <Link
                                key={cat}
                                href={`/gear?category=${cat.toLowerCase().replace(/\s+/g, "-")}`}
                                className="bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-full font-medium hover:bg-indigo-100 cursor-pointer"
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-2xl font-bold text-center mb-12">
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {[
                        {
                            num: "1",
                            title: "Browse & Choose",
                            desc: "Explore our catalog of sports and outdoor gear.",
                        },
                        {
                            num: "2",
                            title: "Select Dates & Rent",
                            desc: "Pick your rental dates and complete the checkout.",
                        },
                        {
                            num: "3",
                            title: "Pick Up & Enjoy",
                            desc: "Pick up your gear and enjoy your adventure!",
                        },
                    ].map((step) => (
                        <div key={step.num}>
                            <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                                {step.num}
                            </div>
                            <h3 className="mt-4 font-semibold">{step.title}</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
