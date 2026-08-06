import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import ContentGate from './components/layout/ContentGate';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import FilmsPage from './pages/FilmsPage';
import AdsPage from './pages/AdsPage';
import AboutPage from './pages/AboutPage';
import CreditsPage from './pages/CreditsPage';
import ContactPage from './pages/ContactPage';
import { Toaster } from './components/ui/sonner';

/**
 * The admin panel is code-split: visitors to the public site never download it.
 * CRA does not split by route on its own, so this lazy boundary is what keeps
 * the CMS bundle (forms, tables, editors) out of the main chunk.
 */
const AdminApp = lazy(() => import('./admin/AdminApp'));

const AdminFallback = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
  </div>
);

/** The public site: shared chrome plus the content pages. */
const PublicSite = () => (
  <ContentGate>
    <Navigation />
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/films" element={<FilmsPage />} />
        <Route path="/ads" element={<AdsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/credits" element={<CreditsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </main>
    <Footer />
  </ContentGate>
);

function App() {
  return (
    <div className="App">
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin brings its own chrome, so it sits outside PublicSite. */}
            <Route
              path="/admin/*"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminApp />
                </Suspense>
              }
            />
            <Route path="/*" element={<PublicSite />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ContentProvider>
    </div>
  );
}

export default App;
