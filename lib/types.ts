import { JwtPayload } from "jsonwebtoken";

export interface GearItem {
    _id: string;
    id?: string;
    name: string;
    pricePerDay: number;
    brand?: string;
    category?: { name: string } | string;
    images?: string[];
    stock?: number;
}

export interface GearDetail extends GearItem {
    description?: string;
    location?: string;
    provider?: {
        _id: string;
        name: string;
        email: string;
    };
    category?: { _id: string; name: string };
}

export interface Review {
    _id: string;
    rating: number;
    comment: string;
    user: { _id: string; name: string };
    createdAt: string;
}

export interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface GearListResponse {
    data: GearItem[];
    pagination: PaginationInfo;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
    role: "CUSTOMER" | "PROVIDER";
    profilePhoto?: string;
}

export type RegisterState = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
    inputs?: { name: string; email: string; role: string };
    clearPasswords?: boolean;
};

export type LoginState = {
    success: boolean;
    message: string;
    data?: JwtPayload;
    errors?: Record<string, string[]>;
    inputs?: { email: string };
};

export interface Category {
    id: string;
    name: string;
}
