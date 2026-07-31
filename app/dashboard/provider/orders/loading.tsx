import Navbar from "@/app/_components/navbar";

export default function ProviderOrdersLoading() {
    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-40" />
                <div className="h-8 bg-gray-200 rounded w-56 mt-4" />
                <div className="h-4 bg-gray-200 rounded w-64 mt-2" />

                <div className="mt-6 space-y-4">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-sm border overflow-hidden"
                        >
                            <div className="px-5 py-4 border-b bg-gray-50/50 flex justify-between">
                                <div className="h-5 bg-gray-200 rounded w-28" />
                                <div className="h-5 bg-gray-200 rounded w-36" />
                            </div>
                            <div className="px-5 py-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
