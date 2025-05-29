import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import LoginPage from './pages/LoginPage/page.tsx'
import RegisterPage from './pages/RegisterPage/page.tsx'
import DashboardPage from './pages/DashboardPage/page.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}></Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashborad" element={<DashboardPage />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
