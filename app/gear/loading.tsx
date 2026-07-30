import Navbar from "@/app/_components/navbar";

export default function GearLoading() {
    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold">Browse All Gear</h1>
                    <p className="mt-2 text-indigo-100">Find the perfect equipment for your next adventure</p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col lg:flex-row gap-8 animate-pulse">
                <aside className="lg:w-64 shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border p-5 space-y-6">
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                            <div className="flex gap-2">
                                <div className="h-8 bg-gray-200 rounded w-full" />
                                <div className="h-8 bg-gray-200 rounded w-full" />
                            </div>
                        </div>
                        <div className="h-9 bg-gray-200 rounded w-full" />
                    </div>
                </aside>

                <div className="flex-1 min-w-0">
                    <div className="h-10 bg-gray-200 rounded-lg max-w-xl mb-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden">
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
                </div>
            </section>
        </div>
    );
}
