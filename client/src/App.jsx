import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/login/login"
import Register from "./pages/register/register"
import Home from "./pages/home/home"
import Layout from "./components/layout/layout"
import NotFound from "./pages/notFound/NotFound"
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute"
import "./chartSetup";

// ✅ new imports for the feature pages
import Activity from "./pages/activity/Activity"
import Body from "./pages/body/Body"
import Cycle from "./pages/cycle/Cycle"
import Heart from "./pages/heart/Heart"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <Routes>
      {/* Protected routes — everything inside Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Existing Home route */}
        <Route index element={<Home />} />

        {/* ✅ Newly added feature routes */}
        <Route path="activity" element={<Activity />} />
        <Route path="body" element={<Body />} />
        <Route path="cycle" element={<Cycle />} />
        <Route path="heart" element={<Heart />} />
      </Route>

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<RegisterAndLogout />} />

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
