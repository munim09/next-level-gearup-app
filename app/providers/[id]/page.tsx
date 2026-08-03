import { fetchProviderPublicGear } from "@/app/_actions/provider";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import ProviderGearBrowse from "@/app/_components/provider-gear-browse";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProviderGearPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ name?: string | string[] }>;
}) {
    const { id } = await params;
    const sp = await searchParams;
    const providerName = typeof sp.name === "string" ? sp.name : "";

    const gearList = await fetchProviderPublicGear(id);

    const gear = gearList.filter((g) => g.status === "ACTIVE");

    if (gear.length === 0 && !providerName) notFound();

    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold">
                        {providerName || "Provider Gear"}
                    </h1>
                    <p className="mt-2 text-indigo-100">
                        Browse gear available to rent
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-28">
                <nav className="text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-indigo-600">
                        Home
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href="/providers" className="hover:text-indigo-600">
                        Providers
                    </Link>
                    {providerName && (
                        <>
                            <span className="mx-2">/</span>
                            <span className="text-gray-800 font-medium">
                                {providerName}
                            </span>
                        </>
                    )}
                </nav>

                {gear.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg font-medium">No gear available</p>
                        <p className="text-sm mt-1">
                            This provider has not listed any gear yet.
                        </p>
                    </div>
                ) : (
                    <ProviderGearBrowse gear={gear} />
                )}
            </section>

            <Footer />
        </div>
    );
}
