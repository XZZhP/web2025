// src/components/BoxCard.jsx
const BoxCard = ({ box, onClick }) => {
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
            onClick={onClick}
        >
            <div className="aspect-square bg-gray-100 relative">
                {box.coverImage ? (
                    <img
                        src={box.coverImage}
                        alt={box.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://placehold.co/400?text=Image+Not+Found';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500">暂无封面</span>
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-medium text-lg truncate text-black">{box.name}</h3>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">¥{box.price}</span>
                    <span className="text-sm text-gray-500">{box.stock}件剩余</span>
                </div>
            </div>
        </div>
    );
};

export default BoxCard;