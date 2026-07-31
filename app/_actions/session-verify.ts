"use server";

import { VerifySessionResult } from "@/lib/types";
import { jwtUtils } from "@/utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_BACKEND_API_URL!;

export async function verifySession(): Promise<VerifySessionResult> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
        return {
            authenticated: false,
        };
    }

    const decodedAccessToken = accessToken
        ? jwtUtils.verifyToken(
              accessToken,
              process.env.JWT_ACCESS_SECRET as string,
          )
        : null;
    if (decodedAccessToken?.success) {
        return {
            authenticated: true,
            user: decodedAccessToken.data as JwtPayload,
        };
    }

    return {
        authenticated: false,
    };
}
