import PaymentResult from "@/app/_components/payment-result";
import { fetchOrderPaymentDetails } from "@/lib/payment-callback";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Payment Successful | GearUp",
};

export default async function PaymentSuccessPage({
    params,
}: {
    params: Promise<{ orderId: string }>;
}) {
    const { orderId } = await params;
    const details = await fetchOrderPaymentDetails(orderId);
    return <PaymentResult success details={details} />;
}
