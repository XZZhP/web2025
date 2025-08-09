// src/pages/ShowcasePage.jsx
import { useState, useEffect } from 'react';
import { getShowcases, likeShowcase } from '../api/showcase';
import { getUserItems } from '../api/user';
import { createShowcase } from '../api/showcase';
import LoadingSpinner from '../components/LoadingSpinner';
import FloatingActionButton from '../components/FloatingActionButton';

const ShowcasePage = () => {
    const userId = sessionStorage.getItem('userId');
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');

    const [showcases, setShowcases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [userItems, setUserItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchShowcases = async () => {
            try {
                setLoading(true);
                const response = await getShowcases({ page });
                //setShowcases(prev => [...prev, ...response.data.data.list]);
                setShowcases(response.data.data.list);
                setHasMore(response.data.data.total > showcases.length + response.data.data.list.length);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchShowcases();
    }, [page]);

    const fetchUserItems = async () => {
        try {
            const response = await getUserItems(userId);
            console.log("my items", response);
            setUserItems(response.data);
        } catch (err) {
            console.error('获取用户物品失败:', err);
        }
    };

    const handleLike = async (id) => {
        try {
            await likeShowcase(id);
            setShowcases(prev => prev.map(item =>
                item.id === id ? { ...item, likes: item.likes + 1 } : item
            ));
        } catch (err) {
            alert(err.response?.data?.message || '点赞失败');
        }
    };

    const handleCreateShowcase = async () => {
        if (!selectedItem || !comment.trim()) {
            alert('请选择物品并填写感想');
            return;
        }

        try {
            setSubmitting(true);
            const response = await createShowcase({
                userId: userId,
                userItemId: selectedItem.id,
                comment
            });

            // 将新创建的展示添加到列表顶部
            setShowcases(prev => [response.data.data, ...prev]);
            setShowCreateModal(false);
            setSelectedItem(null);
            setComment('');
        } catch (err) {
            alert(err.response?.data?.message || '发布失败');
        } finally {
            setSubmitting(false);
        }
    };

    const loadMore = () => {
        setPage(prev => prev + 1);
    };

    if (loading && page === 1) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-20 mt-10">
            <h1 className="text-3xl font-bold mb-6">玩家秀</h1>

            {/* 展示列表 - 优先展示内容 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 w-screen">
                {showcases.map(showcase => (
                    <div key={showcase.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-5">
                            {/* 用户信息 */}
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                    {showcase.user.avatar && (
                                        <img
                                            src={showcase.user.avatar}
                                            alt={showcase.user.username}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">{showcase.user.username}</h3>
                                    <p className="text-xs text-gray-500">
                                        {new Date(showcase.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* 物品展示 */}
                            <div className="mb-4 bg-gray-50 rounded-lg p-3">
                                <div className="h-48 w-full flex items-center justify-center">
                                    <img
                                        src={showcase.userItem.item.image}
                                        alt={showcase.userItem.item.name}
                                        className="max-h-full max-w-full object-contain"
                                        onError={(e) => {
                                            e.target.src = 'https://placehold.co/400?text=Image+Not+Found';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* 物品信息 */}
                            <div className="mb-4">
                                <h4 className="font-medium text-lg">{showcase.userItem.item.name}</h4>
                                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                                    showcase.userItem.item.rarity === 'common' ? 'bg-gray-100 text-gray-800' :
                                        showcase.userItem.item.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                                            showcase.userItem.item.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                                                showcase.userItem.item.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {showcase.userItem.item.rarity}
                                </span>
                            </div>

                            {/* 用户感想 */}
                            <p className="text-gray-700 mb-4 whitespace-pre-line">{showcase.comment}</p>

                            {/* 互动区域 */}
                            <div className="flex justify-between items-center border-t pt-3">
                                <button
                                    onClick={() => handleLike(showcase.id)}
                                    className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                    {showcase.likes}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="text-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? '加载中...' : '加载更多'}
                    </button>
                </div>
            )}

            {/* 浮动发布按钮 */}
            {isAuthenticated && (
                <FloatingActionButton
                    onClick={() => {
                        fetchUserItems();
                        setShowCreateModal(true);
                    }}
                />
            )}

            {/* 创建玩家秀模态框 */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 bg-blue-100">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-black">分享你的收藏</h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">选择要展示的物品</label>
                                {userItems.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">您还没有获得任何物品</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2">
                                        {userItems.map(item => (
                                            <div
                                                key={item.id}
                                                onClick={() => setSelectedItem(item)}
                                                className={`p-2 border rounded-lg cursor-pointer transition-all ${
                                                    selectedItem?.id === item.id
                                                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="h-20 w-full flex items-center justify-center mb-1">
                                                    <img
                                                        src={item.item.image}
                                                        alt={item.item.name}
                                                        className="max-h-full max-w-full object-contain"
                                                        onError={(e) => {
                                                            e.target.src = 'https://placehold.co/100?text=Image+Not+Found';
                                                        }}
                                                    />
                                                </div>
                                                <p className="text-xs text-center font-medium truncate">{item.item.name}</p>
                                                <p className="text-xs text-center text-gray-500">
                                                    {new Date(item.obtainedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">分享你的感想</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={4}
                                    placeholder="这个物品有什么特别之处？分享一下你的感受..."
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                    disabled={submitting}
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleCreateShowcase}
                                    className={`px-4 py-2 rounded-lg flex items-center justify-center transition-colors ${
                                        submitting || !selectedItem || !comment.trim()
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                    disabled={submitting || !selectedItem || !comment.trim()}
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            发布中...
                                        </>
                                    ) : '立即分享'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowcasePage;