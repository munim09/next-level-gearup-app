"use client";

import { submitReview } from "@/app/_actions/dashboard";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const RATINGS = [1, 2, 3, 4, 5];

function ratingLabel(value: number) {
    switch (value) {
        case 5:
            return "Excellent";
        case 4:
            return "Good";
        case 3:
            return "Average";
        case 2:
            return "Poor";
        case 1:
            return "Very Poor";
        default:
            return "";
    }
}

export default function ReviewModal({
    gear,
    onClose,
    onSuccess,
}: {
    gear: { id: string; name: string; imageUrl: string | null };
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState("");
    const [pending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (rating < 1) {
            toast.error("Please select a rating.");
            return;
        }

        startTransition(async () => {
            const result = await submitReview(gear.id, {
                rating,
                comment: comment.trim(),
            });
            if (result?.success) {
                toast.success(result.message);
                onSuccess();
                onClose();
            } else {
                toast.error(result?.message ?? "Failed to submit review.");
            }
        });
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl border mx-4">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-bold">Write a Review</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="px-6 py-5 space-y-4"
                    noValidate
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                            {gear.imageUrl ? (
                                <Image
                                    src={gear.imageUrl}
                                    alt={gear.name}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-400 text-xs">
                                    img
                                </div>
                            )}
                        </div>
                        <p className="text-sm font-medium truncate">
                            {gear.name}
                        </p>
                    </div>

                    <div>
                        <p className="block text-sm font-medium mb-1">
                            Your Rating
                        </p>
                        <div
                            className="flex gap-1"
                            onMouseLeave={() => setHovered(0)}
                        >
                            {RATINGS.map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setRating(value)}
                                    onMouseEnter={() => setHovered(value)}
                                    className={`text-3xl leading-none transition-colors cursor-pointer ${
                                        value <= (hovered || rating)
                                            ? "text-amber-400"
                                            : "text-gray-300"
                                    }`}
                                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                                >
                                    {value <= (hovered || rating) ? "★" : "☆"}
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                                {rating}/5 · {ratingLabel(rating)}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="review-comment"
                            className="block text-sm font-medium mb-1"
                        >
                            Comment
                        </label>
                        <textarea
                            id="review-comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            placeholder="Share your experience with this gear..."
                            className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                        />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="submit"
                            disabled={pending}
                            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {pending ? "Submitting..." : "Submit Review"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
