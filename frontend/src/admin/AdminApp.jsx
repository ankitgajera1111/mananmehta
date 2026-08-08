import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './AuthContext';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HomeEditor from './pages/HomeEditor';
import AboutEditor from './pages/AboutEditor';
import ContactEditor from './pages/ContactEditor';
import SettingsPage from './pages/SettingsPage';
import MessagesPage from './pages/MessagesPage';
import ProjectsEditor from './pages/ProjectsEditor';
import ListingPageEditor from './pages/ListingPageEditor';
import PageVisibilityEditor from './pages/PageVisibilityEditor';

/** Blocks a route until the session check finishes, then redirects if signed out. */
const RequireAuth = ({ children }) => {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Remember where they were headed so login can send them back.
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  }

  return children;
};

/** A content list plus the header copy for its public page. */
const ResourceScreen = ({ resource, pageKey, pageTitle }) => (
  <>
    <ProjectsEditor resource={resource} />
    <div className="mt-8">
      <ListingPageEditor pageKey={pageKey} title={pageTitle} />
    </div>
  </>
);

const AdminRoutes = () => {
  // Lifted so the sidebar badge and the Messages/Dashboard screens agree.
  const [unread, setUnread] = useState(0);

  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route
        path="*"
        element={
          <RequireAuth>
            <AdminLayout unreadCount={unread}>
              <Routes>
                <Route
                  index
                  element={<DashboardPage onUnreadChange={setUnread} />}
                />
                <Route path="home" element={<HomeEditor />} />
                <Route
                  path="films"
                  element={
                    <ResourceScreen
                      resource="films"
                      pageKey="films_page"
                      pageTitle="Films page header"
                    />
                  }
                />
                <Route
                  path="ads"
                  element={
                    <ResourceScreen
                      resource="ads"
                      pageKey="ads_page"
                      pageTitle="Ads page header"
                    />
                  }
                />
                <Route
                  path="credits"
                  element={
                    <ResourceScreen
                      resource="credits"
                      pageKey="credits_page"
                      pageTitle="Credits page header"
                    />
                  }
                />
                <Route path="about" element={<AboutEditor />} />
                <Route path="contact" element={<ContactEditor />} />
                <Route
                  path="messages"
                  element={<MessagesPage onUnreadChange={setUnread} />}
                />
                <Route path="visibility" element={<PageVisibilityEditor />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </AdminLayout>
          </RequireAuth>
        }
      />
    </Routes>
  );
};

const AdminApp = () => (
  <AuthProvider>
    <AdminRoutes />
  </AuthProvider>
);

export default AdminApp;
