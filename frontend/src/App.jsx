// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { BrowserRouter } from "react-router";

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard.jsx';
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";

function App() {
  //const [count, setCount] = useState(0)

  return (

      <BrowserRouter>
          {/* 导航栏 (Tailwind 样式) */}
          <nav className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-50">
              <Link to="/" className="mr-4 hover:underline">首页</Link>
              <Link to="/about" className="mr-4 hover:underline">个人中心</Link>
              <Link to="/login" className="hover:underline">登录</Link>
              {/*<Link to="/register" className="hover:underline">Register</Link>*/}
          </nav>

          {/* 路由配置 */}
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
