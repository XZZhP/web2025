// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { BrowserRouter } from "react-router";

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import BoxListPage from './pages/BoxListPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import CreateBoxPage from "./pages/CreateBox.jsx";
import Upload from "./components/upload.jsx";

function App() {
  //const [count, setCount] = useState(  0)

  return (

      <BrowserRouter>
          {/* 导航栏 (Tailwind 样式) */}
          <nav className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-50">
              <Link to="/boxes" className="mr-4 hover:underline">首页</Link>
              <Link to="/dashboard" className="mr-4 hover:underline">个人中心</Link>
              <Link to="/login" className="hover:underline">登录</Link>
              <Link to="/create-box" >创建</Link>
              <Link to='/upload'>上传</Link>
          </nav>

          {/* 路由配置 */}
          <Routes>
              <Route path="/upload" element={<Upload />} />
              <Route path="/create-box" element={<CreateBoxPage />} />
              <Route path="/boxes" element={<BoxListPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
