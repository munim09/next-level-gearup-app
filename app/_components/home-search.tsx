"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

export default function HomeSearch() {
    const router = useRouter();
    const [value, setValue] = useState("");
    const debouncedRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [, startTransition] = useTransition();

    function goToSearch(term: string) {
        const trimmed = term.trim();
        const params = new URLSearchParams();
        if (trimmed) params.set("search", trimmed);
        const qs = params.toString();

        startTransition(() => {
            router.push(qs ? `/gear?${qs}` : "/gear");
        });
    }

    function handleChange(next: string) {
        setValue(next);

        if (debouncedRef.current) {
            clearTimeout(debouncedRef.current);
        }

        debouncedRef.current = setTimeout(() => {
            goToSearch(next);
        }, 1000);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (debouncedRef.current) {
            clearTimeout(debouncedRef.current);
        }

        goToSearch(value);
    }

    useEffect(() => {
        return () => {
            if (debouncedRef.current) {
                clearTimeout(debouncedRef.current);
            }
        };
    }, []);

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-8 max-w-xl mx-auto flex gap-2"
        >
            <input
                type="text"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Search gear by name..."
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-3 rounded-lg cursor-pointer"
            >
                Search
            </button>
        </form>
    );
}
