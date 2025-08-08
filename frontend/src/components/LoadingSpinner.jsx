// src/components/LoadingSpinner.jsx
const LoadingSpinner = () => {
    return (
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent">
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;