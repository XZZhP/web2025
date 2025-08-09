import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import request from '../utils/request.js'

export default function Login() {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })

    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if(!formData.username || !formData.password){
            setError("请填写用户名和密码")
            return;
        }

        try{
            console.log("输入的密码！",formData.password)
            const response =await request.post("api/user/login",{ username:formData.username, password:formData.password }
                ,{
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include' // 允许携带 Cookie
            })

            console.log('登录返回信息！',response.data)
            if(response.status === 200){
                sessionStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('username', response.data.data.username);
                sessionStorage.setItem('userId', response.data.data.userId);
                sessionStorage.setItem('role', response.data.data.role);
                navigate('/dashboard')
            }else{
                setError("登录失败")
            }

        } catch(err){
            setError("登录失败")
            sessionStorage.removeItem('auth');
        }


    }
    if (sessionStorage.getItem("isAuthenticated")) {
        return (
            <div className="min-h-screen min-w-screen bg-blue-100 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-black mb-4">您已经登录!</h2>
                    <p className="mb-6 text-black">请退出登录后访问此页面</p>
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 bg-blue-200 text-black rounded hover:bg-blue-300"
                    >
                        前往个人中心
                    </Link>
                </div>
            </div>
        );
    }
    return (
        <div className="min-w-screen min-h-screen flex bg-blue-100 items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-1/3 max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-black">登录</h2>
                <form onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 mb-2">
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
                        >
                        </input>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 mb-2">密码</label>
                        <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        placeholder="请输入密码"
                        />
                    </div>

                    <button type="submit" className="w-full text-white "
                    >
                        登录
                    </button>
                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            没有账号？{" "}
                            <Link to="/register" className="test-blue-500 hover:underline">
                                去注册
                            </Link>

                        </p>

                    </div>

                </form>
            </div>
        </div>
    )
}