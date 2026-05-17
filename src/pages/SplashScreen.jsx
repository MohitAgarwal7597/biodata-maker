import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/home'), 2800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #6B3553 0%, #8B4B6B 50%, #B5718A 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'rgba(212,168,83,0.12)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '240px', height: '240px', borderRadius: '50%',
          background: 'rgba(212,168,83,0.08)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '-40px',
          width: '160px', height: '160px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Logo ring */}
        <div className="float-up" style={{
          width: '120px', height: '120px', borderRadius: '50%',
          border: '3px solid rgba(212,168,83,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '32px',
          boxShadow: '0 0 40px rgba(212,168,83,0.2), inset 0 0 40px rgba(212,168,83,0.05)',
        }}>
          <div style={{
            width: '90px', height: '90px', borderRadius: '50%',
            border: '1px solid rgba(212,168,83,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '40px',
          }}>
            💍
          </div>
        </div>

        {/* Title */}
        <h1 className="float-up-delay-1 font-playfair text-white text-center" style={{
          fontSize: '36px', fontWeight: '700', marginBottom: '8px',
          textShadow: '0 2px 20px rgba(0,0,0,0.2)',
        }}>
          Marriage Biodata
        </h1>
        <p className="float-up-delay-2 text-center" style={{
          color: '#D4A853', letterSpacing: '4px', fontSize: '12px',
          textTransform: 'uppercase', marginBottom: '48px',
        }}>
          Maker
        </p>

        {/* Tagline */}
        <p className="float-up-delay-3 text-center" style={{
          color: 'rgba(255,255,255,0.7)', fontSize: '15px',
          maxWidth: '280px', lineHeight: '1.6',
        }}>
          Create beautiful biodatas for your perfect match
        </p>

        {/* Loading dots */}
        <div className="flex gap-2 mt-12">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#D4A853',
                animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.4); opacity: 1; }
        }
      `}</style>
    </div>
  );
}