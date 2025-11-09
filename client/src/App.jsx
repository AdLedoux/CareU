import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/login/login"
import Register from "./pages/register/register"
import Home from "./pages/home/home"
import Layout from "./components/layout/layout"
import NotFound from "./pages/notFound/NotFound"
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute"
import "./chartSetup";

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
        <Route index element={<Home />} />
        <Route path="activity" element={<Activity />} />
        <Route path="body-measurements" element={<Body />} />
        <Route path="cycle-tracking" element={<Cycle />} />
        <Route path="heart" element={<Heart />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<RegisterAndLogout />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
