import { JwtPayload } from "jsonwebtoken";

export interface GearItem {
    id?: string;
    name: string;
    dailyRentalPrice: number;
    brand?: string;
    category?: { name: string } | string;
    imageUrl?: string;
    stockQuantity?: number;
}

export interface GearDetail extends GearItem {
    description?: string;
    location?: string;
    provider?: {
        id: string;
        name: string;
        email: string;
    };
    category?: { id: string; name: string };
}

export interface ReviewCustomerProfile {
    profilePhoto: string | null;
}

export interface ReviewCustomer {
    id: string;
    name: string;
    profile: ReviewCustomerProfile | null;
}

export interface Review {
    id: string;
    customerId: string;
    gearId: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    customer: ReviewCustomer;
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
