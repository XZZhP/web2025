// src/components/FloatingActionButton.jsx
const FloatingActionButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed right-6 bottom-6 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors z-40"
            aria-label="发布玩家秀"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
        </button>
    );
};

export default FloatingActionButton;