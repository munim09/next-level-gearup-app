import {
    fetchAdminGear,
    fetchAdminRentals,
    fetchAdminUsers,
} from "@/app/_actions/admin";
import { fetchCategories } from "@/app/_actions/gear";
import { verifySession } from "@/app/_actions/session-verify";
import AdminCategoryManager from "@/app/_components/admin-category-manager";
import AdminUserList from "@/app/_components/admin-user-list";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import Pagination from "@/app/_components/pagination";
import Link from "next/link";
import { redirect } from "next/navigation";

const USERS_PER_PAGE = 10;

export default async function AdminDashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await verifySession();

    if (!session.authenticated) {
        redirect("/auth/login");
    }

    const role =
        typeof session.user?.role === "string" ? session.user.role : "";
    if (role && role !== "ADMIN") {
        redirect(
            role === "CUSTOMER" ? "/dashboard/customer" : "/dashboard/provider",
        );
    }

    const [users, categories, gearPage, rentalPage] = await Promise.all([
        fetchAdminUsers(),
        fetchCategories(),
        fetchAdminGear({ page: "1", limit: "1" }),
        fetchAdminRentals({ page: "1", limit: "1" }),
    ]);

    const totalUsers = users.length;
    const customers = users.filter((u) => u.role === "CUSTOMER").length;
    const providers = users.filter((u) => u.role === "PROVIDER").length;
    const admins = users.filter((u) => u.role === "ADMIN").length;
    const activeUsers = users.filter((u) => u.activeStatus === "ACTIVE").length;
    const suspendedUsers = totalUsers - activeUsers;
    const activeGearCount = gearPage.pagination.total;
    const rentalOrderCount = rentalPage.pagination.total;

    const sortedUsers = [...users].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const sp = await searchParams;
    const requestedPage = Math.max(Number(sp.page) || 1, 1);
    const searchQuery =
        typeof sp.search === "string" ? sp.search.trim() : "";

    const filteredUsers = searchQuery
        ? sortedUsers.filter((u) =>
              u.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : sortedUsers;

    const totalPages = Math.max(
        1,
        Math.ceil(filteredUsers.length / USERS_PER_PAGE),
    );
    const currentPage = Math.min(requestedPage, totalPages);
    const pageUsers = filteredUsers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE,
    );
    const usersBasePath = searchQuery
        ? `/dashboard/admin?search=${encodeURIComponent(searchQuery)}`
        : "/dashboard/admin";

    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Admin Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage platform users and monitor platform health
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-3xl font-bold mt-1">{totalUsers}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Customers</p>
                        <p className="text-3xl font-bold mt-1 text-green-600">
                            {customers}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Providers</p>
                        <p className="text-3xl font-bold mt-1 text-indigo-700">
                            {providers}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Admins</p>
                        <p className="text-3xl font-bold mt-1 text-purple-700">
                            {admins}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Active</p>
                        <p className="text-3xl font-bold mt-1 text-green-600">
                            {activeUsers}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Suspended</p>
                        <p className="text-3xl font-bold mt-1 text-red-600">
                            {suspendedUsers}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">All Rental Orders</p>
                        <p className="text-3xl font-bold mt-1 text-amber-600">
                            {rentalOrderCount}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <p className="text-sm text-gray-500">Active Gear</p>
                        <p className="text-3xl font-bold mt-1 text-teal-600">
                            {activeGearCount}
                        </p>
                    </div>
                </div>

                <section className="mt-10">
                    <h2 className="text-xl font-bold mb-4">Manage Platform</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href="/dashboard/admin/gear"
                            className="group bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-semibold text-indigo-700">
                                        All Gear
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        View all the gears
                                    </p>
                                </div>
                                <span className="text-indigo-600 group-hover:translate-x-1 transition-transform">
                                    →
                                </span>
                            </div>
                        </Link>
                        <Link
                            href="/dashboard/admin/rentalorder"
                            className="group bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-semibold text-indigo-700">
                                        Rental Orders
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        View all the rental orders
                                    </p>
                                </div>
                                <span className="text-indigo-600 group-hover:translate-x-1 transition-transform">
                                    →
                                </span>
                            </div>
                        </Link>
                    </div>
                </section>

                <section className="mt-10">
                    <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                        <h2 className="text-xl font-bold">
                            All Users ({filteredUsers.length})
                        </h2>
                        <form
                            method="get"
                            action="/dashboard/admin"
                            className="flex flex-wrap items-center gap-2"
                        >
                            <input
                                type="text"
                                name="search"
                                defaultValue={searchQuery}
                                placeholder="Search users by name..."
                                className="w-full sm:w-64 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                            />
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
                            >
                                Search
                            </button>
                            {searchQuery && (
                                <Link
                                    href="/dashboard/admin"
                                    className="text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50"
                                >
                                    Clear
                                </Link>
                            )}
                        </form>
                    </div>
                    {pageUsers.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border text-center py-16 text-gray-500">
                            <p className="text-lg font-medium">No users found</p>
                            {searchQuery && (
                                <p className="text-sm mt-1">
                                    No users matching &quot;{searchQuery}&quot;
                                </p>
                            )}
                        </div>
                    ) : (
                        <>
                            <AdminUserList users={pageUsers} />
                            <Pagination
                                basePath={usersBasePath}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={filteredUsers.length}
                            />
                        </>
                    )}
                </section>

                <section className="mt-10">
                    <h2 className="text-xl font-bold mb-4">Categories</h2>
                    <AdminCategoryManager categories={categories} />
                </section>
            </div>

            <Footer />
        </div>
    );
}
