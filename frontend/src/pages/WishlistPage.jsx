// src/pages/WishlistPage.jsx
import { useEffect, useState } from 'react';
// import { useUserStore } from '../stores/userStore';
import { getWishlist } from '../api/wishlist';
import BoxCard from '../components/BoxCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {useNavigate} from 'react-router-dom'

const WishlistPage = () => {
    //const user = useUserStore(state => state.user);
    const user = sessionStorage.getItem('isAuthenticated') || false;
    const userId = sessionStorage.getItem('userId') || 0;

    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchWishlist = async () => {
            try {
                const response = await getWishlist(userId);
                console.log("get wishlist return ",response);
                setWishlist(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [user]);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500">请先登录查看心愿单</div>
            </div>
        );
    }

    if (loading) {
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
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">我的心愿单</h1>

            {wishlist.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">心愿单为空，快去添加喜欢的盲盒吧！</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map(item => (
                        <BoxCard
                            key={item.id}
                            box={item.box}
                            onClick={() => navigate(`/boxes/${item.box.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;