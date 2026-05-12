import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage            from "../pages/public/HomePage";
import LoginPage           from "../pages/admin/LoginPage";
import DashboardPage       from "../pages/admin/DashboardPage";
import AnimeManagementPage from "../pages/admin/AnimeManagementPage";
import SeasonsPage         from "../pages/admin/SeasonsPage";
import ProtectedRoute      from "./ProtectedRoute";

const adminRoutes = [
  { path: "/admin",        element: <DashboardPage /> },
  { path: "/admin/animes", element: <AnimeManagementPage /> },
  { path: "/admin/seasons", element: <SeasonsPage /> },
];

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<HomePage />} />
        <Route path="/login"  element={<LoginPage />} />

        {adminRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute>{element}</ProtectedRoute>}
          />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}