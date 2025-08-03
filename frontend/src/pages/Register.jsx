import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import  request from '../utils/request.js';
export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // 简单验证
        if (!formData.username || !formData.email || !formData.password) {
            setError("请填写所有字段");
            return;
        }

        try {
            const response = await request.post("api/user/register",{
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            // 模拟注册请求（实际开发替换为 fetch/axios）
            console.log("注册数据:", response);
            alert("注册成功！");
            navigate("/login"); // 跳转到登录页
        } catch (err) {
            setError("注册失败，请重试");
        }
    };

    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center bg-blue-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-1/3 max-w--md">
                <h2 className="text-2xl font-bold mb-6 text-center text-black">注册</h2>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="username">
                            用户名
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="请输入用户名"

                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">
                            邮箱
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="请输入邮箱"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">
                            密码
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="请输入密码"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        注册
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        已有账号？{" "}
                        <Link to="/login" className="text-blue-500 hover:underline">
                            去登录
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}