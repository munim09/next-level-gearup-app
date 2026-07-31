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
    data: GearDetail[];
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
    role?: string;
    errors?: Record<string, string[]>;
    inputs?: { email: string };
};

export interface Category {
    id: string;
    name: string;
}

export interface RentalOrderItem {
    id: string;
    rentalOrderId: string;
    gearId: string;
    quantity: number;
    dailyRentalPrice: string;
    createdAt: string;
    gear: {
        id: string;
        name: string;
        imageUrl: string | null;
        dailyRentalPrice: string;
    };
}

export interface RentalOrder {
    id: string;
    customerId: string;
    providerId: string;
    rentalStartDate: string;
    rentalEndDate: string;
    totalAmount: string;
    status: string;
    note: string | null;
    createdAt: string;
    updatedAt: string;
    provider: {
        id: string;
        name: string;
        email: string;
    };
    items: RentalOrderItem[];
}

export interface PaymentRentalOrder {
    id: string;
    rentalStartDate: string;
    rentalEndDate: string;
    totalAmount: string;
    status: string;
}

export interface Payment {
    id: string;
    tranId: string;
    rentalOrderId: string;
    stripePaymentIntentId: string | null;
    amount: string;
    currency: string;
    meta: Record<string, unknown> | null;
    status: string;
    paidAt: string | null;
    createdAt: string;
    updatedAt: string;
    rentalOrder: PaymentRentalOrder;
}

export interface ProviderGear {
    id: string;
    providerId: string;
    categoryId: string;
    name: string;
    description: string | null;
    brand: string | null;
    model: string | null;
    imageUrl: string | null;
    dailyRentalPrice: string;
    stockQuantity: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    category: {
        id: string;
        name: string;
    };
}

export interface ProviderOrder {
    id: string;
    customerId: string;
    providerId: string;
    rentalStartDate: string;
    rentalEndDate: string;
    totalAmount: string;
    status: string;
    note: string | null;
    createdAt: string;
    updatedAt: string;
    customer: {
        id: string;
        name: string;
        email: string;
    };
    items: RentalOrderItem[];
}

export interface GearInput {
    categoryId: string;
    name: string;
    description?: string;
    brand?: string;
    model?: string;
    imageUrl?: string;
    dailyRentalPrice: number;
    stockQuantity: number;
}

export type VerifySessionResult =
    | {
          authenticated: true;
          user: JwtPayload;
      }
    | {
          authenticated: false;
      };
