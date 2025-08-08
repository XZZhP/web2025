// src/pages/BoxDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBoxDetails, purchaseBox } from '../api/box';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { addToWishlist, removeFromWishlist, getWishlist } from '../api/wishlist';

const BoxDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [box, setBox] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchasing, setPurchasing] = useState(false);
    const [purchaseResult, setPurchaseResult] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);

    const userId = sessionStorage.getItem('userId');
    const user = sessionStorage.getItem('isAuthenticated');
    const [inWishlist, setInWishlist] = useState(false);

    // 检查是否已在心愿单
    useEffect(() => {
        if (user && box) {
            checkInWishlist();
        }
    }, [user, box]);

    const checkInWishlist = async () => {
        try {
            const response = await getWishlist(userId);
            const isInList = response.data.data.some(item => item.box.id === box.id);
            setInWishlist(isInList);
        } catch (err) {
            console.error('检查心愿单失败:', err);
        }
    };

    const handleWishlist = async () => {
        if (!user) {
            alert('请先登录');
            return;
        }

        try {
            if (inWishlist) {
                await removeFromWishlist(userId, box.id);
                setInWishlist(false);
                alert('已从心愿单移除');
            } else {
                await addToWishlist(userId, box.id);
                setInWishlist(true);
                alert('已添加到心愿单');
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    }
    useEffect(() => {
        const fetchBoxDetails = async () => {
            try {
                const response = await getBoxDetails(id);
                setBox(response.data.data);
            } catch (err) {
                setError(err.message);
                console.error('获取盲盒详情失败:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBoxDetails();
    }, [id]);

    const handlePurchase = async () => {
        if (!userId) {
            alert('请先登录');
            return;
        }

        setPurchasing(true);
        try {
            const response = await purchaseBox({ userId, boxId: id });
            console.log("after purchase",response);
            setPurchaseResult(response.data.data);
            setShowResultModal(true);

            // 更新库存显示
            setBox(prev => ({
                ...prev,
                stock: response.data.data.remainingStock
            }));
        } catch (err) {
            alert(err.response?.data?.message || err.message || '购买失败');
        } finally {
            setPurchasing(false);
        }
    };

    const closeResultModal = () => {
        setShowResultModal(false);
    };

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

    if (!box) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500">盲盒不存在</div>
            </div>
        );
    }

    const totalProbability = box.items.reduce((sum, item) => sum + item.probability, 0);

    return (
        <div className="container mx-auto px-4 py-8 text-black mt-10 bg-blue-100 min-w-screen min-h-screen">
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

            {/* 盲盒基本信息 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="md:flex">
                    {/* 封面图片 */}
                    <div className="md:w-1/3">
                        <div className="h-64 md:h-full bg-gray-100 relative">
                            {box.coverImage ? (
                                <img
                                    src={box.coverImage}
                                    alt={box.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <span className="text-gray-500">暂无封面</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 盲盒详情 */}
                    <div className="p-6 md:w-2/3">
                        <h1 className="text-2xl font-bold mb-2">{box.name}</h1>
                        <p className="text-gray-600 mb-4">{box.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <span className="text-sm text-gray-500">价格</span>
                                <p className="text-xl font-semibold">¥{box.price}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">库存</span>
                                <p className="text-xl font-semibold">{box.stock}件</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <h3 className="font-medium text-blue-800 mb-2">概率说明</h3>
                            <p className="text-sm text-blue-600">
                                所有物品概率总和: {totalProbability}%
                                {totalProbability !== 100 && (
                                    <span className="text-red-500 ml-2">(应该等于100%)</span>
                                )}
                            </p>
                        </div>
                        <div className="flex gap-4 mt-6">
                            {/* 购买按钮 */}
                            <button
                                onClick={handlePurchase}
                                disabled={purchasing || box.stock <= 0}
                                className={`px-6 py-3 rounded-lg font-medium ${
                                    purchasing
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : box.stock <= 0
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {purchasing ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        购买中...
                                    </span>
                                ) : box.stock <= 0 ? (
                                    '已售罄'
                                ) : (
                                    '立即购买'
                                )}
                            </button>

                            <button
                                onClick={handleWishlist}
                                className={`px-6 py-2 rounded-lg border ${
                                    inWishlist
                                        ? 'bg-green-100 text-green-800 border-green-300'
                                        : 'bg-white text-red-500 border-gray-300'
                                } hover:bg-gray-50`}
                            >
                                {inWishlist ? '❤️ 已收藏' : '♡ 加入心愿单'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 物品列表 */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">包含物品</h2>
                {box.items.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">此盲盒暂无物品</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {box.items.map((item, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border">
                                <div className="h-40 bg-gray-100 relative">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
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
                                <div className="p-4">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            item.rarity === 'common' ? 'bg-gray-100 text-gray-800' :
                                                item.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                                                    item.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                                                        item.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {item.rarity}
                                        </span>
                                        <span className="text-sm font-medium">{item.probability}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 购买结果弹窗 */}
            {showResultModal && purchaseResult && (
                <Modal onClose={closeResultModal}>
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4 text-center">购买成功！</h3>

                        <div className="text-center mb-6">
                            <p className="text-gray-600 mb-2">你获得了：</p>
                            <p className="text-lg font-semibold">{purchaseResult.item.name}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                                purchaseResult.item.rarity === 'common' ? 'bg-gray-100 text-gray-800' :
                                    purchaseResult.item.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                                        purchaseResult.item.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                                            purchaseResult.item.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {purchaseResult.item.rarity}
                            </span>
                        </div>

                        <div className="flex justify-center mb-6">
                            {purchaseResult.item.image ? (
                                <img
                                    src={purchaseResult.item.image}
                                    alt={purchaseResult.item.name}
                                    className="h-32 object-contain"
                                    onError={(e) => {
                                        e.target.src = 'https://placehold.co/200?text=Image+Not+Found';
                                    }}
                                />
                            ) : (
                                <div className="h-32 w-32 flex items-center justify-center bg-gray-200 rounded">
                                    <span className="text-gray-500">无图片</span>
                                </div>
                            )}
                        </div>

                        <div className="text-center text-sm text-gray-500 mb-6">
                            <p>剩余库存: {purchaseResult.remainingStock}件</p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={closeResultModal}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                确定
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default BoxDetailPage;