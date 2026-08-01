import { fetchAdminUsers } from "@/app/_actions/admin";
import { fetchCategories } from "@/app/_actions/gear";
import { verifySession } from "@/app/_actions/session-verify";
import AdminCategoryManager from "@/app/_components/admin-category-manager";
import AdminUserList from "@/app/_components/admin-user-list";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
    const session = await verifySession();

    if (!session.authenticated) {
        redirect("/auth/login");
    }

    const role =
        typeof session.user?.role === "string" ? session.user.role : "";
    if (role && role !== "ADMIN") {
        redirect(
            role === "CUSTOMER"
                ? "/dashboard/customer"
                : "/dashboard/provider",
        );
    }

    const [users, categories] = await Promise.all([
        fetchAdminUsers(),
        fetchCategories(),
    ]);

    const totalUsers = users.length;
    const customers = users.filter((u) => u.role === "CUSTOMER").length;
    const providers = users.filter((u) => u.role === "PROVIDER").length;
    const admins = users.filter((u) => u.role === "ADMIN").length;
    const activeUsers = users.filter(
        (u) => u.activeStatus === "ACTIVE",
    ).length;
    const suspendedUsers = totalUsers - activeUsers;

    const sortedUsers = [...users].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

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

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mt-6">
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
                </div>

                <section className="mt-10">
                    <h2 className="text-xl font-bold mb-4">
                        All Users ({totalUsers})
                    </h2>
                    {sortedUsers.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border text-center py-16 text-gray-500">
                            <p className="text-lg font-medium">No users found</p>
                        </div>
                    ) : (
                        <AdminUserList users={sortedUsers} />
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
