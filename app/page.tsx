import { fetchCategories, fetchFeaturedGear } from "@/app/_actions/gear";
import FeaturedGear from "@/app/_components/featured-gear";
import Footer from "@/app/_components/footer";
import HomeSearch from "@/app/_components/home-search";
import Navbar from "@/app/_components/navbar";
import Link from "next/link";

export default async function HomePage() {
    const gear = await fetchFeaturedGear();
    const categories = await fetchCategories();

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
                    <HomeSearch />
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
                <FeaturedGear gear={gear} />
            </section>

            {/* Categories */}
            <section className="bg-white py-16 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold mb-8">
                        Browse by Category
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/gear?category=${cat.id}`}
                                className="bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-full font-medium hover:bg-indigo-100 cursor-pointer"
                            >
                                {cat.name}
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
