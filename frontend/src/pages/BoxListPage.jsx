// src/pages/BoxListPage.jsx
import { useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { getBoxes } from '../api/box';
import BoxCard from '../components/BoxCard';
import LoadingSpinner from '../components/LoadingSpinner';

const BoxListPage = () => {
    const [boxes, setBoxes] = useState([]);
    const [filteredBoxes, setFilteredBoxes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const role = sessionStorage.getItem('role');

    useEffect(() => {
        const fetchBoxes = async () => {
            try {
                const response = await getBoxes();
                setBoxes(response.data.data);
                setFilteredBoxes(response.data.data); // 初始化过滤后的列表
            } catch (err) {
                setError(err.message);
                console.error('获取盲盒列表失败:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBoxes();
    }, []);

    // 搜索功能
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredBoxes(boxes);
        } else {
            const filtered = boxes.filter(box =>
                box.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredBoxes(filtered);
        }
    }, [searchTerm, boxes]);

    const handleBoxClick = (boxId) => {
        navigate(`/boxes/${boxId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen mt-10 min-w-screen">
            {/* 固定头部区域 */}
            <div className=" sticky top-10 z-10 border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h1 className="text-3xl font-bold">盲盒列表</h1>

                        {role === 'admin' && (
                            <button>
                                <Link to="/create-box">新建盲盒</Link>
                            </button>
                        )}

                        {/* 搜索框 */}
                        <div className="w-full md:w-64">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="搜索盲盒名称..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="absolute left-3 top-2.5 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 可滚动的内容区域 */}
            <div className="flex-1 mt-10 overflow-auto">
                <div className="container mx-auto px-4 py-6">
                    {filteredBoxes.length === 0 ? (
                        <div className="text-center py-12">
                            {searchTerm ? (
                                <p className="text-gray-500">没有找到名称包含"{searchTerm}"的盲盒</p>
                            ) : (
                                <p className="text-gray-500">暂无盲盒，快去创建吧！</p>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-6">
                            {filteredBoxes.map((box) => (
                                <BoxCard
                                    key={box.id}
                                    box={box}
                                    onClick={() => handleBoxClick(box.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BoxListPage;