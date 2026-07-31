import { fetchCategories } from "@/app/_actions/gear";
import {
    fetchProviderGear,
    fetchProviderOrders,
} from "@/app/_actions/provider";
import { verifySession } from "@/app/_actions/session-verify";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import ProviderGearList from "@/app/_components/provider-gear-list";
import Link from "next/link";
import { redirect } from "next/navigation";

const ACTIVE_STATUSES = ["PLACED", "CONFIRMED", "PAID", "PICKED_UP"];

export default async function ProviderDashboardPage() {
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

    const providerId =
        typeof session.user?.id === "string"
            ? session.user.id
            : typeof session.user?.sub === "string"
              ? session.user.sub
              : "";

    const [gear, orders, categories] = await Promise.all([
        providerId ? fetchProviderGear(providerId) : Promise.resolve([]),
        fetchProviderOrders(),
        fetchCategories(),
    ]);

    const totalStock = gear.reduce((sum, g) => sum + (g.stockQuantity || 0), 0);
    const activeRentals = orders.filter((o) =>
        ACTIVE_STATUSES.includes(o.status),
    ).length;
    const pendingOrders = orders.filter(
        (o) => o.status === "PLACED" || o.status === "CONFIRMED",
    ).length;

    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Provider Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your gear inventory and incoming orders
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Total Gear</p>
                        <p className="text-3xl font-bold mt-1">{gear.length}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Total Stock</p>
                        <p className="text-3xl font-bold mt-1 text-green-600">
                            {totalStock}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Active Rentals</p>
                        <p className="text-3xl font-bold mt-1 text-indigo-700">
                            {activeRentals}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Pending Orders</p>
                        <p className="text-3xl font-bold mt-1 text-amber-600">
                            {pendingOrders}
                        </p>
                    </div>
                </div>

                <section className="mt-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Orders List</h2>
                        <Link
                            href="/dashboard/provider/orders"
                            className="bg-green-600 text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-green-700"
                        >
                            Incoming Orders
                        </Link>
                    </div>
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold mb-4">My Gear</h2>
                    <ProviderGearList gear={gear} categories={categories} />
                </section>
            </div>

            <Footer />
        </div>
    );
}
