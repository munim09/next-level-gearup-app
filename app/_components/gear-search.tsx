"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function GearSearch({ initial }: { initial: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const debouncedRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    function handleChange(value: string) {
        if (debouncedRef.current) clearTimeout(debouncedRef.current);

        debouncedRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            const trimmed = value.trim();
            if (trimmed) {
                params.set("search", trimmed);
            } else {
                params.delete("search");
            }
            params.delete("page");
            router.replace(`${pathname}?${params.toString()}`);
        }, 500);
    }

    function clearSearch() {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("search");
        params.delete("page");
        router.replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex gap-2 max-w-xl">
            <input
                type="text"
                defaultValue={initial}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Search gear by name..."
                className="flex-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            />
            {initial && (
                <button
                    type="button"
                    onClick={clearSearch}
                    className="text-sm text-gray-500 hover:text-gray-700 px-2"
                >
                    Clear
                </button>
            )}
        </div>
    );
}
