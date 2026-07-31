const GlobalLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-500" />

                <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Loading...
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Please wait.....
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GlobalLoading;
