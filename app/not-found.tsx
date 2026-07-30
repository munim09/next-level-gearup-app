import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl font-extrabold text-indigo-600">404</h1>
            <p className="mt-4 text-xl font-semibold">Page not found</p>
            <p className="mt-1 text-gray-500 text-sm">The page you are looking for does not exist.</p>
            <Link
                href="/"
                className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700"
            >
                Go Home
            </Link>
        </div>
    );
}
