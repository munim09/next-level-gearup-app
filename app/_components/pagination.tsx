import Link from "next/link";

function pageNumbers(current: number, total: number) {
    const nums: number[] = [];
    for (let p = 1; p <= total; p++) {
        if (p === 1 || p === total || Math.abs(p - current) <= 2) {
            nums.push(p);
        }
    }
    return nums;
}

export default function Pagination({
    basePath,
    currentPage,
    totalPages,
    totalItems,
}: {
    basePath: string;
    currentPage: number;
    totalPages: number;
    totalItems: number;
}) {
    if (totalPages <= 1) return null;

    const href = (page: number) =>
        `${basePath}${basePath.includes("?") ? "&" : "?"}page=${page}`;

    return (
        <div className="flex flex-col items-center gap-4 mt-12">
            <div className="flex items-center gap-2">
                {currentPage > 1 && (
                    <Link
                        href={href(currentPage - 1)}
                        className="px-3 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                        Prev
                    </Link>
                )}
                {pageNumbers(currentPage, totalPages).map((p, idx, arr) => (
                    <span key={p} className="flex items-center">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-1 text-gray-400">...</span>
                        )}
                        {p === currentPage ? (
                            <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-semibold">
                                {p}
                            </span>
                        ) : (
                            <Link
                                href={href(p)}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium hover:bg-gray-50"
                            >
                                {p}
                            </Link>
                        )}
                    </span>
                ))}
                {currentPage < totalPages && (
                    <Link
                        href={href(currentPage + 1)}
                        className="px-3 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                        Next
                    </Link>
                )}
            </div>
            <p className="text-sm text-gray-500">
                Showing page {currentPage} of {totalPages} ({totalItems} total)
            </p>
        </div>
    );
}
