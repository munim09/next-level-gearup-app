"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

export default function GearSearch({ initial }: { initial: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const debouncedRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isPending, startTransition] = useTransition();

    // function handleChange(value: string) {
    //     if (debouncedRef.current) clearTimeout(debouncedRef.current);

    //     debouncedRef.current = setTimeout(() => {
    //         const params = new URLSearchParams(searchParams.toString());
    //         const trimmed = value.trim();
    //         if (trimmed) {
    //             params.set("search", trimmed);
    //         } else {
    //             params.delete("search");
    //         }
    //         params.delete("page");
    //         router.push(`${pathname}?${params.toString()}`);
    //     }, 500);
    // }

    function handleChange(value: string) {
        setSearch(value);

        if (debouncedRef.current) {
            clearTimeout(debouncedRef.current);
        }

        debouncedRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            const trimmed = value.trim();

            if (trimmed) {
                params.set("search", trimmed);
            } else {
                params.delete("search");
            }

            params.delete("page");

            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`);
            });
        }, 1000);
    }

    function clearSearch() {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("search");
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    }

    const [search, setSearch] = useState(initial);

    useEffect(() => {
        startTransition(() => {
            setSearch(initial);
        });
    }, [initial]);

    return (
        <div className="relative flex-1">
            <input
                value={search}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Search gear by name..."
                className="w-full border rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            />

            {isPending && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg
                        className="h-4 w-4 animate-spin text-indigo-600"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            opacity="0.25"
                        />
                        <path
                            d="M22 12a10 10 0 0 1-10 10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
}
