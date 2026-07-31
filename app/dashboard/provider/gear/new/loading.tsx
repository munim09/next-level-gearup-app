import Navbar from "@/app/_components/navbar";

export default function ProviderAddGearLoading() {
    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-40" />
                <div className="h-8 bg-gray-200 rounded w-56 mt-4" />
                <div className="h-4 bg-gray-200 rounded w-64 mt-2" />

                <div className="mt-6 max-w-2xl bg-white rounded-xl shadow-sm border p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-40" />
                    <div className="h-10 bg-gray-200 rounded w-full" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="h-10 bg-gray-200 rounded w-full" />
                        <div className="h-10 bg-gray-200 rounded w-full" />
                    </div>
                    <div className="h-20 bg-gray-200 rounded w-full" />
                    <div className="h-10 bg-gray-200 rounded w-full" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="h-10 bg-gray-200 rounded w-full" />
                        <div className="h-10 bg-gray-200 rounded w-full" />
                    </div>
                    <div className="h-11 bg-gray-200 rounded w-full" />
                </div>
            </div>
        </div>
    );
}
