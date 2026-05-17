import React from 'react';
import DecorationOverlay from '../components/DecorationOverlay';

const getBackgroundStyle = (background) => {
  if (!background) return { backgroundColor: '#fff' };
  if (background.type === 'gradient') {
    return { background: `linear-gradient(${background.gradient?.direction || '135deg'}, ${background.gradient?.from || '#fdf2f8'}, ${background.gradient?.to || '#fff7ed'})` };
  }
  if (background.type === 'image' && background.image) {
    return { backgroundImage: `url(${background.image})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
  return { backgroundColor: background.color || '#fff' };
};

const getPhotoStyle = (shape) => {
  switch (shape) {
    case 'circle': return { borderRadius: '50%' };
    case 'rounded': return { borderRadius: '20px' };
    case 'square': return { borderRadius: '0' };
    default: return { borderRadius: '50%' };
  }
};

export default function PhotoFocusedTemplate({ biodata, exportMode = false }) {
  const { sections = [], style = {}, background = {}, profile = {}, decorations = {} } = biodata || {};
  const bgStyle = getBackgroundStyle(background);

  const titleStyle = {
    fontFamily: style.titleFont || 'EB Garamond',
    fontSize: `${style.titleSize || 30}px`,
    fontWeight: style.titleBold ? '500' : '400',
    fontStyle: style.titleItalic ? 'italic' : 'normal',
    color: style.titleColor || '#2c1a22',
  };

  const sectionTitleStyle = {
    fontFamily: style.sectionTitleFont || 'EB Garamond',
    fontSize: `${style.sectionTitleSize || 16}px`,
    fontWeight: '500',
    color: style.sectionTitleColor || '#8B4B6B',
    borderBottom: '1px solid #D4A853',
    paddingBottom: '6px',
    marginBottom: '12px',
  };

  const labelStyle = {
    fontFamily: style.labelFont || 'Lato',
    fontSize: `${style.labelSize || 11}px`,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  const valueStyle = {
    fontFamily: style.valueFont || 'EB Garamond',
    fontSize: `${style.valueSize || 15}px`,
    color: style.valueColor || '#333',
  };

  const personalSection = sections.find(s => s.id === 'personal');
  const nameField = personalSection?.fields?.find(f => f.id === 'name');
  const name = nameField?.value || 'Your Name';
  const otherSections = sections.filter(s => s.id !== 'personal');

  return (
    <div id={exportMode ? "biodata-preview" : "biodata-visual"} style={{ ...bgStyle, width: '794px', minHeight: '1123px', position: 'relative', fontFamily: 'EB Garamond, serif' }}>
      <DecorationOverlay decorations={decorations} />

      {/* Full-width photo area */}
      <div style={{
        height: '320px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #2c1a22 0%, #8B4B6B 100%)',
      }}>
        {profile.photo ? (
          <>
            <img
              src={profile.photo} alt=""
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                opacity: 0.4,
                position: 'absolute', inset: 0,
              }}
            />
            {/* Circular portrait centered */}
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px', height: '200px',
              border: '4px solid #D4A853',
              boxShadow: '0 0 0 8px rgba(212,168,83,0.2)',
              ...getPhotoStyle(profile.shape),
              overflow: 'hidden',
            }}>
              <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </>
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyCenter: 'center',
          }}>
            <div style={{
              width: '160px', height: '160px',
              border: '3px solid rgba(212,168,83,0.6)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyCenter: 'center',
              fontSize: '48px', color: 'rgba(212,168,83,0.6)',
            }}>✦</div>
          </div>
        )}

        {/* Name overlay at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(transparent, rgba(44,26,34,0.9))',
          padding: '32px 48px 20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '10px', color: '#D4A853', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '6px' }}>
            Marriage Biodata
          </div>
          <div style={{ ...titleStyle, color: '#ffffff' }}>{name}</div>
        </div>
      </div>

      {/* Content below photo */}
      <div style={{ padding: '36px 48px' }}>
        {/* Personal section */}
        {personalSection && (
          <div style={{ marginBottom: '28px' }}>
            <div style={sectionTitleStyle}>{personalSection.title}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              {personalSection.fields.filter(f => f.id !== 'name' && f.value).map(field => (
                <div key={field.id} style={{ padding: '10px', background: '#fafafa', borderRadius: '8px', border: '1px solid #f0e0e8' }}>
                  <div style={labelStyle}>{field.label}</div>
                  <div style={{ ...valueStyle, marginTop: '4px' }}>{field.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {otherSections.map(section => {
          const visibleFields = section.fields.filter(f => f.value);
          if (visibleFields.length === 0) return null;
          return (
            <div key={section.id} style={{ marginBottom: '24px' }}>
              <div style={sectionTitleStyle}>{section.title}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {visibleFields.map(field => (
                  <div key={field.id} style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ ...labelStyle, minWidth: '150px' }}>{field.label}:</span>
                    <span style={valueStyle}>{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
