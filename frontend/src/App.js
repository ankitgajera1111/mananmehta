import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ContentProvider, usePageVisibility } from './context/ContentContext';
import ContentGate from './components/layout/ContentGate';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import { PUBLIC_PAGES } from './lib/pages';
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

/** The component each switchable page renders, keyed as in PUBLIC_PAGES. */
const PAGE_ELEMENTS = {
  films: <FilmsPage />,
  ads: <AdsPage />,
  about: <AboutPage />,
  credits: <CreditsPage />,
  contact: <ContactPage />,
};

/** The public site: shared chrome plus the content pages. */
const PublicSite = () => {
  const visible = usePageVisibility();

  return (
    <ContentGate>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {PUBLIC_PAGES.filter(({ key }) => visible[key]).map(
            ({ path, key }) => (
              <Route key={path} path={path} element={PAGE_ELEMENTS[key]} />
            )
          )}
          {/*
            Catches both hidden pages and genuinely unknown URLs. A hidden page
            has to stop resolving here, not just lose its nav link, or anyone
            holding the URL - or arriving from a search result - still reaches
            it. Home is the friendliest landing spot, and the site has no 404
            page to send them to instead.
          */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </ContentGate>
  );
};

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
