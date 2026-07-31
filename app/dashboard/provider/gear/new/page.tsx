import { fetchCategories } from "@/app/_actions/gear";
import { verifySession } from "@/app/_actions/session-verify";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import ProviderGearForm from "@/app/_components/provider-gear-form";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProviderAddGearPage() {
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

    const categories = await fetchCategories();

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
                        Add New Gear
                    </span>
                </nav>

                <div className="mt-4">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Add New Gear
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        List a new item in your inventory
                    </p>
                </div>

                <div className="mt-6 max-w-2xl mx-auto">
                    <ProviderGearForm gear={null} categories={categories} pageMode />
                </div>
            </div>

            <Footer />
        </div>
    );
}
