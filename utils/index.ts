export function statusBadgeClass(status: string) {
    switch (status) {
        case "PLACED":
            return "bg-amber-100 text-amber-700";
        case "CONFIRMED":
            return "bg-blue-100 text-blue-700";
        case "PAID":
            return "bg-purple-100 text-purple-700";
        case "PICKED_UP":
            return "bg-green-100 text-green-700";
        case "RETURNED":
            return "bg-gray-100 text-gray-700";
        case "CANCELLED":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}
