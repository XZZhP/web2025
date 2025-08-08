import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import request from "../utils/request.js";

export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // 检查登录状态并获取用户数据
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const username = sessionStorage.getItem('username');
                const response = await request.get(`/api/user/profile/${username}`);
                if (response.status === 200) {
                    console.log( response);
                    setUserData(response.data.data);
                    console.log("用户的数据是" ,userData);
                } else {
                    console.log("没有得到用户信息！-1");
                    sessionStorage.removeItem("isAuthenticated");
                    sessionStorage.removeItem("username");
                }
            } catch (err) {
                console.log("没有得到用户信息！-2");
                sessionStorage.removeItem("isAuthenticated");
                sessionStorage.removeItem("username");
            } finally {
                setLoading(false);
            }
        };

        if (sessionStorage.getItem("isAuthenticated")) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, []);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm({
            ...passwordForm,
            [name]: value,
        });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError("新密码与确认密码不匹配");
            return;
        }

        try {
            const username = sessionStorage.getItem("username");
            const response = await request.put("/api/user/password", {
                username: username,
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });

            if (response.status === 200) {
                alert("密码修改成功");
                setEditMode(false);
                setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || "密码修改失败");
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("username");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">加载中...</div>
            </div>
        );
    }

    if (!sessionStorage.getItem("isAuthenticated") || !userData) {
        return (
            <div className="min-h-screen min-w-screen bg-blue-100 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-black mb-4">您尚未登录!</h2>
                    <p className="mb-6 text-black">请登录后访问此页面</p>
                    <Link
                        to="/login"
                        className="px-4 py-2 bg-blue-200 text-black rounded hover:bg-blue-300"
                    >
                        前往登录
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen min-w-screen bg-blue-100 p-8 mt-10 text-black">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">个人中心</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        退出登录
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">个人信息</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">用户名</p>
                            <p className="font-medium">{userData.username}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">电子邮箱</p>
                            <p className="font-medium">{userData.email}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">修改密码</h2>
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                            {editMode ? "取消" : "修改密码"}
                        </button>
                    </div>

                    {editMode && (
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">当前密码</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">新密码</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        minLength="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">确认新密码</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        minLength="1"
                                    />
                                </div>
                                {error && <p className="text-red-500">{error}</p>}
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    保存更改
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* 可扩展的功能区域 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">功能</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* 历史记录按钮 - 预留扩展 */}
                        <button className="text-white px-4 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                            我的足迹
                        </button>

                        {/* 其他功能按钮 - 预留扩展 */}
                        <button className="text-white px-4 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                            <Link to="/wishlist">我的心愿单</Link>
                        </button>

                        {/*<button className="px-4 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition">*/}
                        {/*    账户设置*/}
                        {/*</button>*/}
                    </div>
                </div>
            </div>
        </div>
    );
}