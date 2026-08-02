"use server";

import type { LoginState, RegisterState } from "@/lib/types";
import { jwtUtils } from "@/utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

export async function register(
    _prevState: RegisterState,
    formData: FormData,
): Promise<RegisterState> {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const role = formData.get("role") as string;

    const errors: Record<string, string[]> = {};

    if (!name || name.trim().length < 2) {
        errors.name = ["Name must be at least 2 characters"];
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = ["Please enter a valid email"];
    }
    if (!password || password.length < 6) {
        errors.password = ["Password must be at least 6 characters"];
    }
    if (password !== confirmPassword) {
        errors.confirmPassword = ["Passwords do not match"];
    }
    if (role !== "CUSTOMER" && role !== "PROVIDER") {
        errors.role = ["Please select a role"];
    }

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            message: "Validation failed",
            errors,
            inputs: { name: name.trim(), email: email.trim(), role },
            clearPasswords: !!errors.confirmPassword || !!errors.password,
        };
    }

    try {
        const res = await fetch(`${API}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name.trim(),
                email: email.trim(),
                password,
                role,
            }),
            cache: "no-store",
        });

        const body = await res.json();
        console.log("reg body: ", body);
        if (!res.ok || !body.success) {
            return {
                success: false,
                message: body.message || "Registration failed",
                errors: body.errors,
                inputs: { name: name.trim(), email: email.trim(), role },
            };
        } else {
            // toast.success("Registration successful");
            return {
                success: true,
                message: "Registration completed",
                inputs: { name: name.trim(), email: email.trim(), role },
            };
        }
    } catch (error) {
        console.log("error");
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("Unknown error", error);
        }
        return {
            success: false,
            message: "Registration error",
            inputs: { name: name.trim(), email: email.trim(), role },
        };
    }
    // console.log("redirecting.....'");
    // redirect("/auth/login");
}

export async function login(
    modal: string,
    _prevState: LoginState,
    formData: FormData,
): Promise<LoginState> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const errors: Record<string, string[]> = {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = ["Please enter a valid email"];
    }
    if (!password || password.length < 6) {
        errors.password = ["Password must be at least 6 characters"];
    }

    let authRole: string = "";

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            message: "Validation failed",
            errors,
            inputs: { email: email.trim() },
        };
    }

    try {
        const res = await fetch(`${API}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), password }),
            cache: "no-store",
        });

        const body = await res.json();

        if (!res.ok || !body.success) {
            return {
                success: false,
                message: body.message || "Login failed",
                errors: body.errors,
                inputs: { email: email.trim() },
            };
        }

        const cookieStore = await cookies();
        cookieStore.set("accessToken", body.data.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
        });
        cookieStore.set("refreshToken", body.data.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        const decoded = body.data.accessToken
            ? jwtUtils.verifyToken(
                  body.data.accessToken,
                  process.env.JWT_ACCESS_SECRET as string,
              )
            : null;

        if (decoded?.success && decoded.data) {
            const userData = decoded.data as JwtPayload & {
                name: string;
                email: string;
                role: string;
            };

            authRole = userData.role;
            cookieStore.set(
                "authUser",
                JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                }),
                {
                    httpOnly: false,
                    secure: true,
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24,
                    path: "/",
                },
            );
        }

        // console.log("decoded", decoded);

        if (modal === "modal") {
            const userData = decoded?.data as JwtPayload & {
                name: string;
                email: string;
                role: string;
            };
            if (decoded?.success) {
                return {
                    success: true,
                    message: "Login successful",
                    data: decoded.data as JwtPayload,
                    role: userData?.role,
                };
            } else {
                return {
                    success: false,
                    message: "Login failed. Try again.",
                    inputs: { email: email.trim() },
                };
            }
        }
    } catch (error) {
        console.log("error");
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("Unknown error", error);
        }
        if (modal === "modal") {
            return {
                success: false,
                message: "Login error. Please try again.",
                inputs: { email: email.trim() },
            };
        }
        // redirect("/?error=login_failed");
    }

    if (authRole === "PROVIDER") {
        redirect("/dashboard/provider");
    } else if (authRole === "ADMIN") {
        redirect("/dashboard/admin");
    }

    // console.log("here");

    redirect("/");
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("authUser");
    redirect("/");
}
