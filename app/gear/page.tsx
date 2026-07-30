import { fetchCategories } from "@/app/_actions/gear";
import Footer from "@/app/_components/footer";
import GearFilter from "@/app/_components/gear-filter";
import GearList from "@/app/_components/gear-list";
import GearSearch from "@/app/_components/gear-search";
import Navbar from "@/app/_components/navbar";

export default async function GearPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const sp = await searchParams;
    const params: Record<string, string> = {};
    params.limit = "12";
    if (sp.search) params.search = String(sp.search);
    if (sp.category) params.categoryId = String(sp.category);
    if (sp.minPrice) params.minPrice = String(sp.minPrice);
    if (sp.maxPrice) params.maxPrice = String(sp.maxPrice);
    if (sp.page) params.page = String(sp.page);

    const categories = await fetchCategories();

    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold">Browse All Gear</h1>
                    <p className="mt-2 text-indigo-100">Find the perfect equipment for your next adventure</p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col lg:flex-row gap-8">
                <GearFilter categories={categories} />

                <div className="flex-1 min-w-0">
                    <GearSearch initial={sp.search ? String(sp.search) : ""} />

                    <GearList params={params} />
                </div>
            </section>

            <Footer />
        </div>
    );
}
