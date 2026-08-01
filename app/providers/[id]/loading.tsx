import Navbar from "@/app/_components/navbar";

export default function ProviderGearLoading() {
    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <div className="h-8 bg-white/20 rounded-lg w-64 mx-auto" />
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-48 mb-6" />
                <div className="h-4 bg-gray-200 rounded w-40 mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-sm border overflow-hidden"
                        >
                            <div className="h-44 bg-gray-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-16" />
                                <div className="h-5 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                <div className="h-5 bg-gray-200 rounded w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
