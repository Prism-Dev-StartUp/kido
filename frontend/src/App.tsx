import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ChildProvider } from "./contexts/ChildContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CyclePage from "./pages/CyclePage";
import GamePage from "./pages/GamePage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ChildProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/cycles/:cycle" element={<PrivateRoute><CyclePage /></PrivateRoute>} />
            <Route path="/play/:gameId" element={<PrivateRoute><GamePage /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </ChildProvider>
    </AuthProvider>
  );
}
