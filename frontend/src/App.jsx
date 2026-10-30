import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Experience from './pages/Experience';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSkills from './pages/admin/AdminSkills';
import AdminExperience from './pages/admin/AdminExperience';
import AdminPosts from './pages/admin/AdminPosts';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Portfolio layout wrapper
function PortfolioLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ── Public Portfolio Routes ── */}
        <Route path="/" element={
          <PortfolioLayout><Home /></PortfolioLayout>
        } />
        <Route path="/about" element={
          <PortfolioLayout><About /></PortfolioLayout>
        } />
        <Route path="/skills" element={
          <PortfolioLayout><Skills /></PortfolioLayout>
        } />
        <Route path="/experience" element={
          <PortfolioLayout><Experience /></PortfolioLayout>
        } />
        <Route path="/blog" element={
          <PortfolioLayout><Blog /></PortfolioLayout>
        } />
        <Route path="/blog/:slug" element={
          <PortfolioLayout><BlogPost /></PortfolioLayout>
        } />

        {/* ── Admin Routes ── */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="posts" element={<AdminPosts />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <PortfolioLayout>
            <main style={{ paddingTop: 'var(--nav-height)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '5rem', fontWeight: 800, background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '1rem' }}>404</div>
                <h2 style={{ marginBottom: '0.5rem' }}>Page Not Found</h2>
                <p style={{ marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            </main>
          </PortfolioLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}
