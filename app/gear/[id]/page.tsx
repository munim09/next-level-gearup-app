import { fetchGearById, fetchReviews } from "@/app/_actions/gear";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import RentButton from "@/app/_components/rent-button";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

function getCatName(cat: { name: string } | string | undefined): string {
    if (!cat) return "General";
    return typeof cat === "string" ? cat : cat.name;
}

function StarRating({ rating }: { rating: number }) {
    return (
        <span className="inline-flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <svg
                    key={s}
                    className={`w-4 h-4 ${s <= rating ? "text-amber-400" : "text-gray-200"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </span>
    );
}

export default async function GearDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [gear, reviews] = await Promise.all([
        fetchGearById(id),
        fetchReviews(id),
    ]);

    // console.log("gear", gear);
    // console.log("reviews", reviews);
    if (!gear) notFound();

    const avgRating =
        reviews.length > 0
            ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
            : 0;
    const catName = getCatName(gear.category);

    console.log("gear", gear);
    console.log("price", gear.dailyRentalPrice);

    return (
        <div className="flex flex-col min-h-full">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <nav className="text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:text-indigo-600">
                        Home
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href="/gear" className="hover:text-indigo-600">
                        Gear
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-800 font-medium">
                        {gear.name}
                    </span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <div className="h-80 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm relative overflow-hidden">
                            {gear.imageUrl ? (
                                <Image
                                    src={gear.imageUrl}
                                    alt={gear.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            ) : (
                                "Gear Image"
                            )}
                        </div>
                        {gear.imageUrl && (
                            <div className="flex gap-2 mt-3">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden relative flex-shrink-0">
                                    <Image
                                        src={gear.imageUrl}
                                        alt={`${gear.name}`}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <span className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700 font-medium">
                            {catName}
                        </span>
                        <h1 className="text-2xl md:text-3xl font-bold mt-3">
                            {gear.name}
                        </h1>
                        {gear.brand && (
                            <p className="text-gray-500 mt-1">{gear.brand}</p>
                        )}

                        <div className="flex items-center gap-3 mt-4">
                            <span className="text-3xl font-bold text-indigo-700">
                                ${gear.dailyRentalPrice}
                                <span className="text-lg font-normal text-gray-500">
                                    /day
                                </span>
                            </span>
                            {reviews.length > 0 && (
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <StarRating
                                        rating={Math.round(avgRating)}
                                    />
                                    ({reviews.length})
                                </span>
                            )}
                        </div>

                        <div className="mt-6 space-y-3">
                            {gear.location && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">
                                        Location:
                                    </span>{" "}
                                    {gear.location}
                                </p>
                            )}
                            {gear.stockQuantity !== undefined && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Stock:</span>{" "}
                                    {gear.stockQuantity > 0 ? (
                                        <span className="text-green-600">
                                            {gear.stockQuantity} available
                                        </span>
                                    ) : (
                                        <span className="text-red-500">
                                            Out of stock
                                        </span>
                                    )}
                                </p>
                            )}
                            {gear.provider && (
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">
                                        Provider:
                                    </span>{" "}
                                    {gear.provider.name}
                                </p>
                            )}
                        </div>

                        {gear.description && (
                            <div className="mt-6">
                                <h2 className="font-semibold mb-2">
                                    Description
                                </h2>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                    {gear.description}
                                </p>
                            </div>
                        )}

                        <div className="mt-8">
                            <RentButton
                                gearId={gear.id!}
                                inStock={(gear.stockQuantity ?? 0) > 0}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t pt-8">
                    <h2 className="text-xl font-bold mb-6">
                        Reviews ({reviews.length})
                    </h2>
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                            No reviews yet. Be the first to review!
                        </p>
                    ) : (
                        <div className="space-y-5">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="bg-white border rounded-xl p-5"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">
                                                {review.customer.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <span className="font-medium text-sm">
                                                {review.customer.name}
                                            </span>
                                        </div>
                                        <StarRating rating={review.rating} />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
