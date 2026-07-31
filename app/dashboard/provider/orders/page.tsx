import { fetchProviderOrders } from "@/app/_actions/provider";
import { verifySession } from "@/app/_actions/session-verify";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import ProviderOrders from "@/app/_components/provider-orders";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProviderOrdersPage() {
    const session = await verifySession();

    if (!session.authenticated) {
        redirect("/auth/login");
    }

    const role =
        typeof session.user?.role === "string" ? session.user.role : "";
    if (role && role !== "PROVIDER") {
        redirect(
            role === "CUSTOMER" ? "/dashboard/customer" : "/dashboard/admin",
        );
    }

    const orders = await fetchProviderOrders();

    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <nav className="text-sm text-gray-500">
                    <Link
                        href="/dashboard/provider"
                        className="hover:text-indigo-600"
                    >
                        Dashboard
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-800 font-medium">
                        Incoming Orders
                    </span>
                </nav>

                <div className="flex items-center justify-between mt-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            Incoming Orders
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage orders placed on your gear
                        </p>
                    </div>
                    <Link
                        href="/dashboard/provider"
                        className="hidden sm:inline-block text-indigo-600 font-medium text-sm hover:underline"
                    >
                        &larr; Back to Dashboard
                    </Link>
                </div>

                <div className="mt-6">
                    <ProviderOrders orders={orders} />
                </div>
            </div>

            <Footer />
        </div>
    );
}
