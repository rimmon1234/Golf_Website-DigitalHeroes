import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { ProtectedRoute } from './routes/ProtectedRoute.tsx';
import { AdminRoute } from './routes/AdminRoute.tsx';
import LandingPage from './pages/public/LandingPage.tsx';
import HowItWorksPage from './pages/public/HowItWorksPage.tsx';
import CharityDirectoryPage from './pages/public/CharityDirectoryPage.tsx';
import CharityDetailPage from './pages/public/CharityDetailPage.tsx';
import Login from './pages/auth/Login.tsx';
import Signup from './pages/auth/Signup.tsx';
import DashboardPlaceholder from './pages/protected/DashboardPlaceholder.tsx';
import ScoresPage from './pages/protected/ScoresPage.tsx';
import MyCharityPage from './pages/protected/MyCharityPage.tsx';
import AdminPlaceholder from './pages/protected/AdminPlaceholder.tsx';
import Unauthorized from './pages/public/Unauthorized.tsx';
import NotFound from './pages/public/NotFound.tsx';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Website & Charity Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/charities" element={<CharityDirectoryPage />} />
          <Route path="/charities/:id" element={<CharityDetailPage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected User Routes (Phase 1 & Phase 3) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scores"
            element={
              <ProtectedRoute>
                <ScoresPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-charity"
            element={
              <ProtectedRoute>
                <MyCharityPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes (Phase 1 verified, Phase 5 to expand) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPlaceholder />
              </AdminRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
