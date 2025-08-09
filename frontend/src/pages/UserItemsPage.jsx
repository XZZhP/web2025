// src/pages/UserItemsPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserItems } from '../api/user';
import LoadingSpinner from '../components/LoadingSpinner';

const UserItemsPage = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = sessionStorage.getItem('userId');
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const fetchUserItems = async () => {
            try {
                const response = await getUserItems(userId);
                console.log("my items:",response);
                setItems(response.data || []);
            } catch (err) {
                setError(err.message);
                console.error('获取用户物品失败:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserItems();
    }, [userId, isAuthenticated, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 text-black mt-10 bg-blue-50 min-h-screen min-w-screen">
            {/* 返回按钮 */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                返回
            </button>

            <h1 className="text-2xl font-bold mb-6">我的收藏品</h1>
            <p className="text-gray-600 mb-8">共 {items.length} 件物品</p>

            {items.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">您还没有获得任何物品</p>
                    <button
                        onClick={() => navigate('/boxes')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        去购买盲盒
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((userItem) => (
                        <div
                            key={userItem.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* 物品图片 */}
                            <div className="h-48 bg-gray-100 relative">
                                {userItem.item.image ? (
                                    <img
                                        src={userItem.item.image}
                                        alt={userItem.item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://placehold.co/400?text=Image+Not+Found';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <span className="text-gray-500">无图片</span>
                                    </div>
                                )}
                            </div>

                            {/* 物品信息 */}
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-1">{userItem.item.name}</h3>

                                {/* 稀有度标签 */}
                                <span className={`inline-block px-2 py-1 text-xs rounded-full mb-2 ${
                                    userItem.item.rarity === 'common' ? 'bg-gray-100 text-gray-800' :
                                        userItem.item.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                                            userItem.item.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                                                userItem.item.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {userItem.item.rarity}
                                </span>

                                {/* 所属盲盒信息 */}
                                {userItem.item.box && (
                                    <div className="mt-2 pt-2 border-t border-gray-100">
                                        <p className="text-sm text-gray-600">来自盲盒:</p>
                                        <p className="font-medium">{userItem.item.box.name}</p>
                                    </div>
                                )}

                                {/* 获得时间 */}
                                <div className="mt-3 text-xs text-gray-500">
                                    获得于: {new Date(userItem.obtainedAt).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserItemsPage;