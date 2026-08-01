"use client";

import { updateUserStatus } from "@/app/_actions/admin";
import type { AdminUser } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

function roleColor(role: string) {
    switch (role) {
        case "ADMIN":
            return "bg-purple-100 text-purple-700";
        case "PROVIDER":
            return "bg-indigo-100 text-indigo-700";
        case "CUSTOMER":
            return "bg-green-100 text-green-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export default function AdminUserList({ users }: { users: AdminUser[] }) {
    const router = useRouter();
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [, startTransition] = useTransition();

    function toggleStatus(user: AdminUser) {
        const nextStatus =
            user.activeStatus === "ACTIVE" ? "SUSPEND" : "ACTIVE";

        setPendingId(user.id);
        startTransition(async () => {
            const result = await updateUserStatus(user.id, nextStatus);
            setPendingId(null);

            if (result?.success) {
                toast.success(
                    nextStatus === "ACTIVE"
                        ? `${user.name} activated`
                        : `${user.name} suspended`,
                );
                router.refresh();
            } else {
                toast.error(
                    result?.message ?? "Failed to update user status.",
                );
            }
        });
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
                <thead>
                    <tr className="text-left text-gray-500 border-b bg-gray-50/50">
                        <th className="px-5 py-3 font-medium">User</th>
                        <th className="px-5 py-3 font-medium">Role</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Joined</th>
                        <th className="px-5 py-3 font-medium text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        const isActive = user.activeStatus === "ACTIVE";
                        const isPending = pendingId === user.id;

                        return (
                            <tr
                                key={user.id}
                                className="border-b last:border-0 hover:bg-gray-50/50"
                            >
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <span
                                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleColor(
                                            user.role,
                                        )}`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <span
                                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                            isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {user.activeStatus}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-gray-600">
                                    {formatDate(user.createdAt)}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() =>
                                                toggleStatus(user)
                                            }
                                            disabled={
                                                isPending ||
                                                user.role === "ADMIN"
                                            }
                                            className={`text-xs px-3 py-1.5 rounded-lg font-medium border disabled:opacity-50 disabled:cursor-not-allowed ${
                                                isActive
                                                    ? "border-red-200 text-red-600 hover:bg-red-50"
                                                    : "border-green-200 text-green-600 hover:bg-green-50"
                                            }`}
                                        >
                                            {isPending
                                                ? "Updating..."
                                                : isActive
                                                  ? "Suspend"
                                                  : "Activate"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
