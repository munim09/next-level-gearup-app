import type { OrderPaymentInfo } from "@/lib/payment-callback";
import Link from "next/link";

function formatDate(value: string | null | undefined) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function paymentStatusBadge(status: string) {
    if (status === "COMPLETED") return "bg-green-100 text-green-700";
    if (status === "FAILED") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
}

function DetailRow({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-gray-500">{label}</span>
            {children}
        </div>
    );
}

export default function PaymentResult({
    success,
    details,
}: {
    success: boolean;
    details: OrderPaymentInfo | null;
}) {
    const heading = success ? "Payment Successful" : "Payment Failed";
    const message = success
        ? "Your payment has been processed successfully."
        : "";

    console.log("details", details);

    return (
        <div className="flex flex-col min-h-full bg-gray-100">
            <header
                className={`${
                    success ? "bg-green-600" : "bg-red-600"
                } text-white text-center px-4 py-12`}
            >
                <div className="w-14 h-14 rounded-full bg-white/25 inline-flex items-center justify-center text-2xl font-bold">
                    {success ? "✓" : "✕"}
                </div>
                <h1 className="text-3xl font-bold mt-4">{heading}</h1>
                <p className="text-sm opacity-90 mt-1">{message}</p>
            </header>

            <main className="w-full max-w-3xl mx-auto px-4 py-8 flex-1">
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                    <Link
                        href="/"
                        className="bg-indigo-600 text-white text-sm px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700"
                    >
                        Back to Home
                    </Link>
                    <Link
                        href="/dashboard/customer"
                        className="bg-white text-indigo-600 border border-indigo-200 text-sm px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-50"
                    >
                        Go to Dashboard
                    </Link>
                </div>

                {details ? (
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50/50">
                            <h2 className="font-semibold">
                                Order Payment Details
                            </h2>
                        </div>
                        <div className="px-6 py-5">
                            <div className="divide-y divide-gray-100">
                                <DetailRow label="Order ID">
                                    <span className="font-mono text-xs font-semibold text-gray-800">
                                        {details.rentalOrderId}
                                    </span>
                                </DetailRow>
                                <DetailRow label="Total Amount">
                                    <span className="font-semibold text-indigo-700">
                                        ${details.totalAmount}
                                    </span>
                                </DetailRow>
                                <DetailRow label="Rental Order Status">
                                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                                        {details.rentalStatus || "—"}
                                    </span>
                                </DetailRow>
                            </div>

                            {details.payments.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        Payments
                                    </p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm min-w-[480px]">
                                            <thead>
                                                <tr className="text-left text-gray-500 border-b bg-gray-50/50">
                                                    <th className="px-4 py-2.5 font-medium">
                                                        Transaction
                                                    </th>
                                                    <th className="px-4 py-2.5 font-medium">
                                                        Amount
                                                    </th>
                                                    <th className="px-4 py-2.5 font-medium">
                                                        Status
                                                    </th>
                                                    <th className="px-4 py-2.5 font-medium">
                                                        Paid At
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {details.payments.map(
                                                    (payment) => (
                                                        <tr
                                                            key={payment.id}
                                                            className="border-b last:border-0"
                                                        >
                                                            <td className="px-4 py-3 font-mono text-xs text-gray-700">
                                                                {payment.tranId}
                                                            </td>
                                                            <td className="px-4 py-3 font-semibold">
                                                                {
                                                                    payment.currency
                                                                }{" "}
                                                                {payment.amount}
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span
                                                                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${paymentStatusBadge(payment.status)}`}
                                                                >
                                                                    {
                                                                        payment.status
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-600">
                                                                {formatDate(
                                                                    payment.paidAt,
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border text-center py-16 text-gray-500">
                        <p className="text-lg font-medium">
                            Payment details are not available
                        </p>
                        <p className="text-sm mt-1">
                            We couldn&apos;t retrieve details for this order.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
