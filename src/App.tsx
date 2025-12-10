import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { theme } from "./shared/theme/theme";
import LoginPage from "./pages/auth/LoginPage";
import OAuthCallback from "./pages/auth/OAuthCallbackPage";
import FilesPage from "./pages/file/FilesStoragePage";
import { DownloadPage } from "./pages/download/DownloadPage";
import { UsersPage } from "./pages/user/UsersPage";
import CreateFilePage from "./pages/file/CreateFilePage";
import LinksPage from "./pages/link/LinksPage";
import CreateLinkPage from "./pages/link/CreateLinkPage";
import TagsPage from "./pages/tag/TagsPage";
import GroupListPage from "./pages/group/GroupListPage";
import GroupSettingsPage from "./pages/group/GroupSettingsPage";
import { setupInterceptors } from "./shared/api/axios";

const AppContent: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      <Route path="/download/:token" element={<DownloadPage />} />

      <Route path="/" element={<Navigate to="/files" replace />} />
      <Route path="/files" element={<FilesPage />} />
      <Route path="/files/upload" element={<CreateFilePage />} />
      <Route path="/links" element={<LinksPage />} />
      <Route path="/links/create" element={<CreateLinkPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/tags" element={<TagsPage />} />

      <Route path="/groups" element={<GroupListPage />} />
      <Route path="/groups/:groupId/settings" element={<GroupSettingsPage />} />

      <Route path="*" element={<Navigate to="/files" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Toaster position="top-center" reverseOrder={false} />
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </ThemeProvider>
);
