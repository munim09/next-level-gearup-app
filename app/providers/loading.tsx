import Navbar from "@/app/_components/navbar";

export default function ProvidersLoading() {
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

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-pulse">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-sm border p-6 space-y-4"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-gray-200" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                </div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-9 bg-gray-200 rounded-lg w-full mt-4" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
