import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ChildProvider, useChild } from "./contexts/ChildContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChildSelectPage from "./pages/ChildSelectPage";
import HomePage from "./pages/HomePage";
import NaturePage from "./pages/NaturePage";
import ActivityPage from "./pages/ActivityPage";
import ProgressPage from "./pages/ProgressPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function ChildRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { activeChild } = useChild();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!activeChild) return <Navigate to="/accueil" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <ChildProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/accueil" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/accueil" element={<PrivateRoute><ChildSelectPage /></PrivateRoute>} />
            <Route path="/jouer" element={<ChildRoute><HomePage /></ChildRoute>} />
            <Route path="/nature/:mot" element={<ChildRoute><NaturePage /></ChildRoute>} />
            <Route path="/nature/:mot/:phase" element={<ChildRoute><ActivityPage /></ChildRoute>} />
            <Route path="/progression" element={<PrivateRoute><ProgressPage /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </ChildProvider>
    </AuthProvider>
  );
}
