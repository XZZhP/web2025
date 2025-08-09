// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { BrowserRouter } from "react-router";

import {BrowserRouter, Routes, Route, Link, Navigate} from 'react-router-dom';
import BoxListPage from './pages/BoxListPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import CreateBoxPage from "./pages/CreateBox.jsx";
import Upload from "./components/upload.jsx";
import BoxDetailPage from "./pages/BoxDetailPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import ShowcasePage from "./pages/ShowcasePage.jsx";
import UserItemsPage from "./pages/UserItemsPage.jsx";

function App() {
  //const [count, setCount] = useState(  0)

  return (

      <BrowserRouter>
          {/* 导航栏 (Tailwind 样式) */}
          <nav className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 z-50">
              <Link to="/boxes" className="mr-4 hover:underline">首页</Link>
              <Link to="/dashboard" className="mr-4 hover:underline">个人中心</Link>
              <Link to="/showcase" className="hover:underline">玩家秀</Link>

          </nav>

          {/* 路由配置 */}
          <Routes>
              <Route path="/my-items" element={<UserItemsPage />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/showcase" element={<ShowcasePage />} />
              <Route path="/wishlist" element={<WishlistPage/>} />
              <Route path="/boxes/:id" element={<BoxDetailPage />} />
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
