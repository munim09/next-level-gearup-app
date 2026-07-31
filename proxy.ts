// import { cookies } from 'next/headers';
import { getNewAccessToken } from "@/service/refreshToken";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtUtils } from "./utils/jwt";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];
const PUBLIC_ROUTES = [
    "/",
    "/gear",
    "/gear/**",
    "/payment/success",
    "/payment/cancel",
];

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const cookieStore = await cookies();
    // const accessToken = cookieStore.get("accessToken")?.value;

    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    let decodedAccessToken = accessToken
        ? jwtUtils.verifyToken(
              accessToken,
              process.env.JWT_ACCESS_SECRET as string,
          )
        : null;

    const decodedRefreshToken = refreshToken
        ? jwtUtils.verifyToken(
              refreshToken,
              process.env.JWT_REFRESH_SECRET as string,
          )
        : null;

    if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
        //access token has expired but refresh token is valid, get new access token from backend
        const result = await getNewAccessToken();

        if (result.success) {
            const newAccessToken = result.data.accessToken;

            cookieStore.set("accessToken", newAccessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24,
                sameSite: "lax",
            });

            accessToken = newAccessToken;
            decodedAccessToken = jwtUtils.verifyToken(
                accessToken!,
                process.env.JWT_ACCESS_SECRET as string,
            );
        } else {
            cookieStore.delete("refreshToken");
        }
    }

    let userRole = null;

    if (!decodedAccessToken?.success) {
        //token has expired or is invalid, clear the cookies
        cookieStore.delete("accessToken");
        cookieStore.delete("authUser");
    }

    if (decodedAccessToken?.success && decodedAccessToken.data) {
        userRole = (decodedAccessToken.data as JwtPayload).role;
    }

    //user is logged in and trying to access login or register page, redirect to dashboard or root home page
    // if (accessToken && AUTH_ROUTES.includes(pathname)) {
    //     if (userRole === "CUSTOMER") {
    //         return NextResponse.redirect(
    //             new URL("/dashboard/customer", request.url),
    //         );
    //     } else if (userRole === "ADMIN") {
    //         return NextResponse.redirect(
    //             new URL("/dashboard/admin", request.url),
    //         );
    //     } else if (userRole === "PROVIDER") {
    //         return NextResponse.redirect(
    //             new URL("/dashboard/provider", request.url),
    //         );
    //     } else {
    //         return NextResponse.redirect(new URL("/", request.url));
    //     }
    // }

    const isPublicRoute = PUBLIC_ROUTES.some(
        (route) =>
            pathname === route ||
            pathname.startsWith(route + "/") ||
            pathname.startsWith("/gear"),
    );

    const isAuthRoute = AUTH_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + "/"),
    );

    // Authenticated Pages Protection : Authorization is not handled yet
    if (!accessToken && !isPublicRoute && !isAuthRoute) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Authorization : Role based access control
    if (pathname.startsWith("/dashboard/customer") && userRole !== "CUSTOMER") {
        return NextResponse.redirect(new URL("/not-found", request.url));
    } else if (
        pathname.startsWith("/dashboard/admin") &&
        userRole !== "ADMIN"
    ) {
        return NextResponse.redirect(new URL("/not-found", request.url));
    } else if (
        pathname.startsWith("/dashboard/provider") &&
        userRole !== "PROVIDER"
    ) {
        return NextResponse.redirect(new URL("/not-found", request.url));
    }

    // return NextResponse.redirect(new URL('/', request.url))
    return NextResponse.next();
}

export const config = {
    matcher: [
        // '/dashboard/:path*',
        // '/admin-dashboard/:path*',
        "/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)",
    ],
};
