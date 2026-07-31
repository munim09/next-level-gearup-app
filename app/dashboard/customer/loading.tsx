import Navbar from "@/app/_components/navbar";

export default function CustomerDashboardLoading() {
    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-56" />
                <div className="h-4 bg-gray-200 rounded w-40 mt-2" />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-sm border p-5"
                        >
                            <div className="h-4 bg-gray-200 rounded w-24" />
                            <div className="h-8 bg-gray-200 rounded w-16 mt-3" />
                        </div>
                    ))}
                </div>

                <div className="mt-10">
                    <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
                    <div className="space-y-4">
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

                <div className="mt-10">
                    <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="px-5 py-3 border-b bg-gray-50/50">
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="px-5 py-4 border-b last:border-0"
                            >
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
