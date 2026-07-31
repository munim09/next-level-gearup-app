import Navbar from "@/app/_components/navbar";

export default function GearDetailLoading() {
    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-48 mb-6" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <div className="h-80 bg-gray-200 rounded-xl" />
                        <div className="flex gap-2 mt-3">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                            <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                            <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="h-5 bg-gray-200 rounded w-16" />
                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-10 bg-gray-200 rounded w-1/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="space-y-2 pt-2">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                        </div>
                        <div className="h-12 bg-gray-200 rounded-lg w-full max-w-xs" />
                    </div>
                </div>

                <div className="mt-16 border-t pt-8">
                    <div className="h-6 bg-gray-200 rounded w-32 mb-6" />
                    <div className="space-y-5">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white border rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                    <div className="h-4 bg-gray-200 rounded w-24" />
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
