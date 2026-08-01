import Navbar from "@/app/_components/navbar";

export default function AdminDashboardLoading() {
    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-64" />
                <div className="h-4 bg-gray-200 rounded w-96 mt-2" />

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mt-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-sm border p-5 space-y-2"
                        >
                            <div className="h-4 bg-gray-200 rounded w-20" />
                            <div className="h-8 bg-gray-200 rounded w-12" />
                        </div>
                    ))}
                </div>

                <div className="mt-10">
                    <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
                    <div className="bg-white rounded-xl shadow-sm border">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="border-b last:border-0 px-5 py-4 flex items-center gap-4"
                            >
                                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                                </div>
                                <div className="h-5 bg-gray-200 rounded w-16" />
                                <div className="h-8 bg-gray-200 rounded w-20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
