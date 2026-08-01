import { fetchAllProviders } from "@/app/_actions/provider";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import type { Provider } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

function isHttpUrl(url: string | null | undefined): url is string {
    return typeof url === "string" && /^https?:\/\//i.test(url);
}

function ProviderAvatar({ provider }: { provider: Provider }) {
    const photo = provider.profile?.profilePhoto;

    if (isHttpUrl(photo)) {
        return (
            <div className="w-14 h-14 rounded-full overflow-hidden relative bg-gray-100 flex-shrink-0">
                <Image
                    src={photo}
                    alt={provider.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                />
            </div>
        );
    }

    return (
        <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
            {provider.name.charAt(0).toUpperCase()}
        </div>
    );
}

export default async function ProvidersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const sp = await searchParams;
    const currentPage = Math.max(Number(sp.page) || 1, 1);
    const limit = 12;

    const { data: providers, pagination } = await fetchAllProviders({
        page: String(currentPage),
        limit: String(limit),
    });

    const totalPages = pagination.totalPages;

    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold">
                        Our Providers
                    </h1>
                    <p className="mt-2 text-indigo-100">
                        Rent quality gear from trusted providers
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                {providers.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg font-medium">No providers found</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {providers.map((provider) => (
                                <div
                                    key={provider.id}
                                    className="bg-white rounded-xl shadow-sm border p-6 flex flex-col hover:shadow-md transition"
                                >
                                    <div className="flex items-start gap-4">
                                        <ProviderAvatar provider={provider} />
                                        <div className="min-w-0 flex-1">
                                            <h2 className="font-semibold text-lg truncate">
                                                {provider.name}
                                            </h2>
                                            <p className="text-gray-500 text-sm truncate">
                                                {provider.email}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                                        {provider.profile?.bio ||
                                            "No bio available."}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between gap-2">
                                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700">
                                            {provider.activeStatus}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/providers/${provider.id}?name=${encodeURIComponent(provider.name)}`}
                                        className="mt-5 block text-center bg-indigo-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-indigo-700 transition"
                                    >
                                        View Gear
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex flex-col items-center gap-4 mt-12">
                                <div className="flex items-center gap-2">
                                    {currentPage > 1 && (
                                        <Link
                                            href={`/providers?page=${currentPage - 1}`}
                                            className="px-3 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
                                        >
                                            Prev
                                        </Link>
                                    )}
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1,
                                    )
                                        .filter(
                                            (p) =>
                                                Math.abs(p - currentPage) <=
                                                    2 ||
                                                p === 1 ||
                                                p === totalPages,
                                        )
                                        .map((p, idx, arr) => (
                                            <span
                                                key={p}
                                                className="flex items-center"
                                            >
                                                {idx > 0 &&
                                                    arr[idx - 1] !== p - 1 && (
                                                        <span className="px-1 text-gray-400">
                                                            ...
                                                        </span>
                                                    )}
                                                {p === currentPage ? (
                                                    <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-semibold">
                                                        {p}
                                                    </span>
                                                ) : (
                                                    <Link
                                                        href={`/providers?page=${p}`}
                                                        className="w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium hover:bg-gray-50"
                                                    >
                                                        {p}
                                                    </Link>
                                                )}
                                            </span>
                                        ))}
                                    {currentPage < totalPages && (
                                        <Link
                                            href={`/providers?page=${currentPage + 1}`}
                                            className="px-3 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    Showing {providers.length} of {pagination.total} providers
                                </p>
                            </div>
                        )}
                    </>
                )}
            </section>

            <Footer />
        </div>
    );
}
