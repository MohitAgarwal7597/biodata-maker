import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Features', href: '#features' },
    { label: 'Templates', href: '#templates' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollTo = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      transition: 'all 0.4s ease',
      background: scrolled
        ? 'rgba(255,255,255,0.95)'
        : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(139,75,107,0.1)' : 'none',
      boxShadow: scrolled ? '0 4px 32px rgba(139,75,107,0.08)' : 'none',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => scrollTo('#hero')}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B4B6B, #D4A853)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', boxShadow: '0 4px 12px rgba(139,75,107,0.3)',
          }}>💍</div>
          <div>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: '700',
              fontSize: '18px',
              color: scrolled ? '#2c1a22' : '#fff',
              lineHeight: 1.1,
              transition: 'color 0.3s',
            }}>Biodata Maker</div>
            <div style={{
              fontSize: '9px',
              letterSpacing: '2px',
              color: scrolled ? '#D4A853' : 'rgba(212,168,83,0.9)',
              textTransform: 'uppercase',
              transition: 'color 0.3s',
            }}>Marriage Profiles</div>
          </div>
        </div>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          {navLinks.map(link => (
            <button key={link.label}
              onClick={() => scrollTo(link.href)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 16px', borderRadius: '20px',
                fontFamily: 'Lato, sans-serif', fontWeight: '600',
                fontSize: '14px',
                color: scrolled ? '#5a3a4a' : 'rgba(255,255,255,0.85)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.target.style.background = scrolled ? '#f5e6ed' : 'rgba(255,255,255,0.15)';
                e.target.style.color = scrolled ? '#8B4B6B' : '#fff';
              }}
              onMouseLeave={e => {
                e.target.style.background = 'none';
                e.target.style.color = scrolled ? '#5a3a4a' : 'rgba(255,255,255,0.85)';
              }}
            >{link.label}</button>
          ))}
          <button
            onClick={() => navigate('/app')}
            style={{
              marginLeft: '8px',
              padding: '10px 24px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #D4A853, #B08C3D)',
              border: 'none', cursor: 'pointer',
              fontFamily: 'Lato, sans-serif', fontWeight: '700',
              fontSize: '14px', color: '#2c1a22',
              boxShadow: '0 4px 16px rgba(212,168,83,0.4)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(212,168,83,0.5)'; }}
            onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 16px rgba(212,168,83,0.4)'; }}
          >✨ Create Now</button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'none', flexDirection: 'column', gap: '5px', padding: '8px',
          }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: '22px', height: '2px',
              background: scrolled ? '#2c1a22' : '#fff',
              borderRadius: '2px', transition: 'all 0.3s',
              transform: menuOpen
                ? i === 0 ? 'rotate(45deg) translateY(7px)' : i === 2 ? 'rotate(-45deg) translateY(-7px)' : 'scaleX(0)'
                : 'none',
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          padding: '16px 24px 24px',
          borderTop: '1px solid #f0e0e8',
        }}>
          {navLinks.map(link => (
            <button key={link.label}
              onClick={() => scrollTo(link.href)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '14px 0', fontFamily: 'Lato, sans-serif',
                fontWeight: '600', fontSize: '16px', color: '#2c1a22',
                borderBottom: '1px solid #f5e6ed',
              }}>
              {link.label}
            </button>
          ))}
          <button onClick={() => navigate('/app')}
            style={{
              marginTop: '16px', width: '100%', padding: '14px',
              borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #8B4B6B, #6B3553)',
              fontFamily: 'Lato, sans-serif', fontWeight: '700',
              fontSize: '16px', color: '#fff',
            }}>
            ✨ Create Your Biodata
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section id="hero" style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(145deg, #4a1830 0%, #6B3553 35%, #8B4B6B 65%, #a85c7a 100%)',
      display: 'flex', alignItems: 'center',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-120px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,168,83,0.18) 0%, transparent 70%)',
        animation: 'pulse-blob 6s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,168,83,0.12) 0%, transparent 70%)',
        animation: 'pulse-blob 8s 2s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '60%',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)',
        animation: 'float 10s ease-in-out infinite',
      }} />

      {/* Ornamental ring */}
      <div style={{
        position: 'absolute', top: '50%', right: '8%',
        transform: 'translateY(-50%)',
        width: '380px', height: '380px',
        border: '1px solid rgba(212,168,83,0.15)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: '300px', height: '300px', border: '1px solid rgba(212,168,83,0.1)', borderRadius: '50%' }} />
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 32px 80px', width: '100%', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '620px' }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(212,168,83,0.15)',
            border: '1px solid rgba(212,168,83,0.3)',
            borderRadius: '24px', padding: '6px 16px',
            marginBottom: '28px',
            opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s ease',
          }}>
            <span style={{ color: '#D4A853', fontSize: '14px' }}>✦</span>
            <span style={{ color: 'rgba(212,168,83,0.9)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'Lato' }}>
              India's Finest Biodata Maker
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: '700', color: '#fff',
            lineHeight: '1.15', margin: '0 0 20px',
            opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s 0.1s ease',
          }}>
            Create a Beautiful<br />
            <span style={{ color: '#D4A853', fontStyle: 'italic' }}>Marriage Biodata</span><br />
            in Minutes
          </h1>

          {/* Subheadline */}
          <p style={{
            fontFamily: 'Lato, sans-serif', fontSize: '18px',
            color: 'rgba(255,255,255,0.72)', lineHeight: '1.7', margin: '0 0 40px',
            opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s 0.2s ease',
          }}>
            Choose from 5 elegant templates, fill your details, and export a stunning PDF. Perfect for matrimonial profiles, resumes, and professional introductions.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: '16px', flexWrap: 'wrap',
            opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s 0.3s ease',
          }}>
            <button onClick={() => navigate('/app')} style={{
              padding: '16px 36px', borderRadius: '40px', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #D4A853, #B08C3D)',
              fontFamily: 'Lato, sans-serif', fontWeight: '700', fontSize: '16px',
              color: '#2c1a22', boxShadow: '0 8px 32px rgba(212,168,83,0.45)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 16px 40px rgba(212,168,83,0.55)'; }}
              onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 8px 32px rgba(212,168,83,0.45)'; }}
            >
              ✨ Get Started Free
            </button>
            <button onClick={() => document.querySelector('#templates').scrollIntoView({ behavior: 'smooth' })} style={{
              padding: '16px 36px', borderRadius: '40px', cursor: 'pointer',
              background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.3)',
              fontFamily: 'Lato, sans-serif', fontWeight: '600', fontSize: '16px', color: '#fff',
              backdropFilter: 'blur(10px)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; }}
            >
              View Templates →
            </button>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: '40px', marginTop: '56px', flexWrap: 'wrap',
            opacity: loaded ? 1 : 0, transition: 'all 0.8s 0.5s ease',
          }}>
            {[
              { num: '5+', label: 'Templates' },
              { num: '100%', label: 'Free' },
              { num: 'PDF', label: 'Export' },
              { num: '∞', label: 'Saves' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: '700', color: '#D4A853' }}>{stat.num}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Lato' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        opacity: loaded ? 0.6 : 0, transition: 'opacity 1s 1s',
        animation: 'bounce 2s ease-in-out infinite',
      }}>
        <div style={{ fontSize: '11px', color: '#D4A853', letterSpacing: '2px', fontFamily: 'Lato' }}>SCROLL</div>
        <div style={{ color: '#D4A853', fontSize: '18px' }}>↓</div>
      </div>

      <style>{`
        @keyframes pulse-blob { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
      `}</style>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    { icon: '📝', title: 'Easy Form Filling', desc: 'Fill out all your details in organized sections — personal, education, family, and contact info. Add custom fields anytime.' },
    { icon: '🎨', title: 'Style Customization', desc: 'Change fonts, colors, backgrounds, and photo shapes. Make your biodata truly yours with our rich style editor.' },
    { icon: '📄', title: 'PDF & Image Export', desc: 'Export as high-resolution PDF, PNG, or JPG. Print-ready A4 format with no watermarks — ever.' },
    { icon: '🖼️', title: '5 Elegant Templates', desc: 'Classic, Modern, Minimal, Traditional, and Photo-Focused. Each crafted with attention to beauty and readability.' },
    { icon: '☁️', title: 'Auto-Save & Multiple Profiles', desc: 'Your biodatas save automatically in your browser. Create and manage multiple profiles for different purposes.' },
    { icon: '⠿', title: 'Drag & Drop Sections', desc: 'Reorder sections exactly how you want them. Your layout, your way — no coding required.' },
  ];

  return (
    <section id="features" style={{ padding: '100px 32px', background: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '4px', color: '#D4A853', textTransform: 'uppercase', fontFamily: 'Lato', marginBottom: '12px' }}>
            ✦ Why Choose Us ✦
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '700', color: '#2c1a22', margin: '0 0 16px' }}>
            Everything You Need
          </h2>
          <p style={{ fontFamily: 'Lato', fontSize: '18px', color: '#888', maxWidth: '500px', margin: '0 auto', lineHeight: '1.7' }}>
            A complete biodata creation studio — right in your browser.
          </p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {features.map((f, i) => (
            <div key={i} style={{
              padding: '36px 32px',
              borderRadius: '20px',
              border: '1.5px solid #f0e0e8',
              background: '#fdf8f9',
              transition: 'all 0.3s',
              cursor: 'default',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 48px rgba(139,75,107,0.12)';
                e.currentTarget.style.borderColor = '#D4A853';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#f0e0e8';
              }}
            >
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #f5e6ed, #fdf6e3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '26px', marginBottom: '20px',
                border: '1px solid rgba(212,168,83,0.2)',
              }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '600', color: '#2c1a22', margin: '0 0 10px' }}>{f.title}</h3>
              <p style={{ fontFamily: 'Lato', fontSize: '15px', color: '#888', lineHeight: '1.7', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Templates showcase ───────────────────────────────────────────────────────
function TemplatesShowcase() {
  const navigate = useNavigate();
  const templates = [
    { id: 'classic', name: 'Classic', desc: 'Timeless elegance with ornate gold borders', icon: '📜', color: '#8B4B6B', bg: 'linear-gradient(135deg, #fff5f8, #fff9f0)' },
    { id: 'modern', name: 'Modern', desc: 'Bold contemporary design with gradient header', icon: '✨', color: '#6B3553', bg: 'linear-gradient(135deg, #f8f5ff, #fff5f8)' },
    { id: 'minimal', name: 'Minimal', desc: 'Two-column layout with dark sidebar', icon: '◻', color: '#2c1a22', bg: 'linear-gradient(135deg, #f5f5f5, #fff)' },
    { id: 'traditional', name: 'Traditional', desc: 'Vibrant Indian style with Om & double border', icon: '🪔', color: '#8B4B6B', bg: 'linear-gradient(135deg, #fffbf0, #fff9e8)' },
    { id: 'photo', name: 'Photo Focused', desc: 'Full-width photo header, gallery-style', icon: '📸', color: '#4a2035', bg: 'linear-gradient(135deg, #1a0e16, #3a1a28)' },
  ];

  return (
    <section id="templates" style={{ padding: '100px 32px', background: 'linear-gradient(135deg, #fdf8f9, #fff9f0)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '4px', color: '#D4A853', textTransform: 'uppercase', fontFamily: 'Lato', marginBottom: '12px' }}>
            ✦ Designs ✦
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '700', color: '#2c1a22', margin: '0 0 16px' }}>
            5 Stunning Templates
          </h2>
          <p style={{ fontFamily: 'Lato', fontSize: '18px', color: '#888', maxWidth: '500px', margin: '0 auto', lineHeight: '1.7' }}>
            Each template is crafted for elegance, readability, and a lasting impression.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {templates.map(t => (
            <div key={t.id} style={{
              borderRadius: '20px', overflow: 'hidden', cursor: 'pointer',
              border: '1.5px solid #f0e0e8', transition: 'all 0.3s',
              background: '#fff',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 24px 56px rgba(139,75,107,0.16)'; e.currentTarget.style.borderColor = t.color; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f0e0e8'; }}
              onClick={() => navigate('/app')}
            >
              {/* Mock preview area */}
              <div style={{
                height: '160px', background: t.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: '8px',
                borderBottom: '1px solid #f0e0e8',
              }}>
                <div style={{
                  fontSize: '40px',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                }}>{t.icon}</div>
                <div style={{
                  fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
                  color: t.id === 'photo' ? 'rgba(212,168,83,0.7)' : '#D4A853',
                  fontFamily: 'Lato',
                }}>Template</div>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '17px', fontWeight: '600', color: '#2c1a22', marginBottom: '6px' }}>{t.name}</div>
                <div style={{ fontFamily: 'Lato', fontSize: '13px', color: '#aaa', lineHeight: '1.6' }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/app')} style={{
            padding: '16px 48px', borderRadius: '40px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #8B4B6B, #6B3553)',
            fontFamily: 'Lato, sans-serif', fontWeight: '700', fontSize: '16px', color: '#fff',
            boxShadow: '0 8px 32px rgba(139,75,107,0.3)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 16px 40px rgba(139,75,107,0.4)'; }}
            onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 8px 32px rgba(139,75,107,0.3)'; }}
          >Browse All Templates →</button>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const navigate = useNavigate();
  const steps = [
    { num: '01', icon: '🖼️', title: 'Pick a Template', desc: 'Choose from 5 professionally designed templates that suit your style and occasion.' },
    { num: '02', icon: '📝', title: 'Fill Your Details', desc: 'Enter your personal, educational, family, and contact information. Add a photo, customize sections.' },
    { num: '03', icon: '🎨', title: 'Style It Your Way', desc: 'Adjust fonts, colors, backgrounds. Drag sections to reorder. Preview in real time.' },
    { num: '04', icon: '📥', title: 'Download & Share', desc: 'Export as PDF, PNG, or JPG in high resolution. Share instantly or print beautifully.' },
  ];

  return (
    <section style={{ padding: '100px 32px', background: '#2c1a22' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '4px', color: '#D4A853', textTransform: 'uppercase', fontFamily: 'Lato', marginBottom: '12px' }}>
            ✦ Process ✦
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '700', color: '#fff', margin: '0 0 16px' }}>
            How It Works
          </h2>
          <p style={{ fontFamily: 'Lato', fontSize: '18px', color: 'rgba(255,255,255,0.5)', maxWidth: '500px', margin: '0 auto', lineHeight: '1.7' }}>
            From blank page to beautiful biodata in four simple steps.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '56px' }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              padding: '36px 28px',
              borderRadius: '20px',
              border: '1px solid rgba(212,168,83,0.15)',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(10px)',
              position: 'relative', overflow: 'hidden',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,168,83,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,168,83,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            >
              <div style={{
                position: 'absolute', top: '20px', right: '20px',
                fontFamily: 'Playfair Display, serif', fontSize: '52px',
                fontWeight: '700', color: 'rgba(212,168,83,0.06)', lineHeight: 1,
              }}>{s.num}</div>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{s.icon}</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '600', color: '#fff', margin: '0 0 10px' }}>{s.title}</h3>
              <p style={{ fontFamily: 'Lato', fontSize: '15px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.7', margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/app')} style={{
            padding: '18px 56px', borderRadius: '40px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #D4A853, #B08C3D)',
            fontFamily: 'Lato, sans-serif', fontWeight: '700', fontSize: '18px',
            color: '#2c1a22', boxShadow: '0 8px 40px rgba(212,168,83,0.4)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-4px)'; e.target.style.boxShadow = '0 16px 56px rgba(212,168,83,0.55)'; }}
            onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 8px 40px rgba(212,168,83,0.4)'; }}
          >
            ✨ Start Creating for Free
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ padding: '100px 32px', background: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        {/* Text side */}
        <div>
          <div style={{ fontSize: '12px', letterSpacing: '4px', color: '#D4A853', textTransform: 'uppercase', fontFamily: 'Lato', marginBottom: '12px' }}>
            ✦ Our Story ✦
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: '700', color: '#2c1a22', margin: '0 0 20px', lineHeight: '1.3' }}>
            Made with ❤️ for<br />Indian Families
          </h2>
          <p style={{ fontFamily: 'Lato', fontSize: '16px', color: '#666', lineHeight: '1.8', marginBottom: '20px' }}>
            Creating a marriage biodata has always been an important tradition in Indian culture. We built this tool to make that process beautiful, effortless, and modern — while honoring the sentiment behind it.
          </p>
          <p style={{ fontFamily: 'Lato', fontSize: '16px', color: '#666', lineHeight: '1.8', marginBottom: '32px' }}>
            Whether you're creating a biodata for matrimonial purposes, a professional introduction, or a personal profile, our maker gives you the tools to present yourself in the most elegant way possible.
          </p>
          <div style={{ display: 'flex', gap: '32px' }}>
            {[{ n: '5', l: 'Templates' }, { n: '100%', l: 'Free' }, { n: '∞', l: 'Profiles' }].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: '700', color: '#8B4B6B' }}>{s.n}</div>
                <div style={{ fontSize: '13px', color: '#aaa', fontFamily: 'Lato', letterSpacing: '1px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual side */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '100%', aspectRatio: '4/5',
            borderRadius: '24px', maxWidth: '400px', margin: '0 auto',
            background: 'linear-gradient(145deg, #6B3553, #8B4B6B)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '16px', padding: '48px 32px',
            boxShadow: '0 32px 80px rgba(107,53,83,0.3)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(212,168,83,0.1)' }} />
            <div style={{ fontSize: '56px' }}>💍</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: '#fff', fontWeight: '600', textAlign: 'center' }}>Your Perfect Biodata</div>
            <div style={{ width: '40px', height: '2px', background: '#D4A853' }} />
            <div style={{ fontFamily: 'Lato', fontSize: '14px', color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: '1.7' }}>Elegant · Professional · Memorable</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {['📜','✨','◻','🪔','📸'].map((icon, i) => (
                <div key={i} style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(212,168,83,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                }}>{icon}</div>
              ))}
            </div>
          </div>

          {/* Floating badge */}
          <div style={{
            position: 'absolute', bottom: '-16px', right: '0',
            background: '#fff', borderRadius: '16px', padding: '16px 20px',
            boxShadow: '0 8px 32px rgba(139,75,107,0.15)',
            border: '1px solid #f0e0e8',
          }}>
            <div style={{ fontSize: '12px', color: '#aaa', fontFamily: 'Lato', marginBottom: '4px' }}>Export Quality</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: '600', color: '#2c1a22' }}>A4 Print-Ready</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #about > div { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', message: '' });
  };

  const inputStyle = {
    width: '100%', padding: '14px 18px', borderRadius: '12px',
    border: '1.5px solid #f0e0e8', fontFamily: 'Lato, sans-serif',
    fontSize: '15px', color: '#2c1a22', background: '#fff',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  return (
    <section id="contact" style={{ padding: '100px 32px', background: 'linear-gradient(135deg, #fdf8f9, #fff9f0)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '4px', color: '#D4A853', textTransform: 'uppercase', fontFamily: 'Lato', marginBottom: '12px' }}>
            ✦ Get in Touch ✦
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '700', color: '#2c1a22', margin: '0 0 16px' }}>
            Contact Us
          </h2>
          <p style={{ fontFamily: 'Lato', fontSize: '18px', color: '#888', lineHeight: '1.7' }}>
            Have a question, suggestion, or feedback? We'd love to hear from you.
          </p>
        </div>

        <div style={{
          background: '#fff', borderRadius: '24px', padding: '48px',
          border: '1.5px solid #f0e0e8',
          boxShadow: '0 16px 64px rgba(139,75,107,0.08)',
        }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#2c1a22', marginBottom: '8px' }}>Message Sent!</h3>
              <p style={{ fontFamily: 'Lato', color: '#888' }}>Thank you for reaching out. We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'Lato', fontSize: '13px', fontWeight: '700', color: '#5a3a4a', marginBottom: '8px', letterSpacing: '0.5px' }}>Your Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Priya Sharma" required style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#8B4B6B'}
                    onBlur={e => e.target.style.borderColor = '#f0e0e8'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'Lato', fontSize: '13px', fontWeight: '700', color: '#5a3a4a', marginBottom: '8px', letterSpacing: '0.5px' }}>Email Address</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="priya@example.com" required style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#8B4B6B'}
                    onBlur={e => e.target.style.borderColor = '#f0e0e8'} />
                </div>
              </div>
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontFamily: 'Lato', fontSize: '13px', fontWeight: '700', color: '#5a3a4a', marginBottom: '8px', letterSpacing: '0.5px' }}>Message</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what's on your mind..." required rows={5}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                  onFocus={e => e.target.style.borderColor = '#8B4B6B'}
                  onBlur={e => e.target.style.borderColor = '#f0e0e8'} />
              </div>
              <button type="submit" style={{
                width: '100%', padding: '16px', borderRadius: '40px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #8B4B6B, #6B3553)',
                fontFamily: 'Lato, sans-serif', fontWeight: '700', fontSize: '16px', color: '#fff',
                boxShadow: '0 8px 24px rgba(139,75,107,0.3)', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 32px rgba(139,75,107,0.4)'; }}
                onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 8px 24px rgba(139,75,107,0.3)'; }}
              >Send Message →</button>
            </form>
          )}
        </div>

        <style>{`
          @media (max-width: 600px) {
            form > div:first-child { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const navigate = useNavigate();
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer style={{ background: '#1a0e16', padding: '64px 32px 32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '64px', marginBottom: '48px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #8B4B6B, #D4A853)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
              }}>💍</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: '700', color: '#fff' }}>Biodata Maker</div>
            </div>
            <p style={{ fontFamily: 'Lato', fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.8', maxWidth: '300px' }}>
              Create beautiful marriage biodatas and professional profiles effortlessly. No account needed, always free.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <div style={{ fontFamily: 'Lato', fontSize: '12px', letterSpacing: '3px', color: '#D4A853', textTransform: 'uppercase', marginBottom: '20px' }}>Navigate</div>
            {[
              { label: 'Home', href: '#hero' },
              { label: 'Features', href: '#features' },
              { label: 'Templates', href: '#templates' },
              { label: 'About', href: '#about' },
              { label: 'Contact', href: '#contact' },
            ].map(link => (
              <button key={link.label}
                onClick={() => scrollTo(link.href)}
                style={{
                  display: 'block', background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'Lato', fontSize: '15px', color: 'rgba(255,255,255,0.55)',
                  padding: '6px 0', textAlign: 'left', transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#D4A853'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
              >{link.label}</button>
            ))}
          </div>

          {/* App */}
          <div>
            <div style={{ fontFamily: 'Lato', fontSize: '12px', letterSpacing: '3px', color: '#D4A853', textTransform: 'uppercase', marginBottom: '20px' }}>The App</div>
            <button onClick={() => navigate('/app')} style={{
              display: 'block', width: '100%', padding: '14px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #8B4B6B, #6B3553)',
              fontFamily: 'Lato, sans-serif', fontWeight: '600', fontSize: '14px', color: '#fff',
              marginBottom: '12px', textAlign: 'center', transition: 'all 0.2s',
            }}>✨ Create Biodata</button>
            <div style={{ fontFamily: 'Lato', fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: '1.7' }}>
              Completely free · No sign-up · Works offline · Export PDF/PNG/JPG
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontFamily: 'Lato', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
            © 2026 Biodata Maker · Made with ❤️ in India
          </div>
          <div style={{ fontFamily: 'Lato', fontSize: '13px', color: '#D4A853', letterSpacing: '2px' }}>
            ✦ OM SHANTI ✦
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </footer>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ fontFamily: 'Lato, sans-serif' }}>
      <Navbar />
      <Hero />
      <Features />
      <TemplatesShowcase />
      <HowItWorks />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}