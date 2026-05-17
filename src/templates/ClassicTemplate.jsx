import React from 'react';
import DecorationOverlay from '../components/DecorationOverlay';

const getBackgroundStyle = (background) => {
  if (!background) return { backgroundColor: '#ffffff' };
  if (background.type === 'gradient') {
    return {
      background: `linear-gradient(${background.gradient?.direction || '135deg'}, ${background.gradient?.from || '#fdf2f8'}, ${background.gradient?.to || '#fff7ed'})`,
    };
  }
  if (background.type === 'image' && background.image) {
    return {
      backgroundImage: `url(${background.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }
  return { backgroundColor: background.color || '#ffffff' };
};

const getPhotoStyle = (shape) => {
  switch (shape) {
    case 'circle': return { borderRadius: '50%' };
    case 'rounded': return { borderRadius: '16px' };
    case 'square': return { borderRadius: '0px' };
    default: return { borderRadius: '50%' };
  }
};

export default function ClassicTemplate({ biodata, exportMode = false }) {
  const { sections = [], style = {}, background = {}, profile = {}, decorations = {} } = biodata || {};
  const bgStyle = getBackgroundStyle(background);

  const titleStyle = {
    fontFamily: style.titleFont || 'Playfair Display',
    fontSize: `${style.titleSize || 28}px`,
    fontWeight: style.titleBold ? 'bold' : 'normal',
    fontStyle: style.titleItalic ? 'italic' : 'normal',
    color: style.titleColor || '#8B4B6B',
  };

  const sectionTitleStyle = {
    fontFamily: style.sectionTitleFont || 'Playfair Display',
    fontSize: `${style.sectionTitleSize || 16}px`,
    fontWeight: style.sectionTitleBold ? 'bold' : 'normal',
    fontStyle: style.sectionTitleItalic ? 'italic' : 'normal',
    color: style.sectionTitleColor || '#8B4B6B',
  };

  const labelStyle = {
    fontFamily: style.labelFont || 'Lato',
    fontSize: `${style.labelSize || 13}px`,
    fontWeight: style.labelBold ? 'bold' : 'normal',
    fontStyle: style.labelItalic ? 'italic' : 'normal',
    color: style.labelColor || '#5a3a4a',
  };

  const valueStyle = {
    fontFamily: style.valueFont || 'Lato',
    fontSize: `${style.valueSize || 13}px`,
    fontWeight: style.valueBold ? 'bold' : 'normal',
    fontStyle: style.valueItalic ? 'italic' : 'normal',
    color: style.valueColor || '#333333',
  };

  const personalSection = sections.find(s => s.id === 'personal');
  const nameField = personalSection?.fields?.find(f => f.id === 'name');
  const name = nameField?.value || 'Your Name';

  const otherSections = sections.filter(s => s.id !== 'personal');

  return (
    <div
      id={exportMode ? "biodata-preview" : "biodata-visual"}
      style={{ ...bgStyle, width: '794px', minHeight: '1123px', position: 'relative', padding: '0' }}
    >
      <DecorationOverlay decorations={decorations} />
      
      {/* Decorative border */}
      <div style={{
        position: 'absolute', inset: '16px',
        border: '2px solid #D4A853',
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'absolute', inset: '20px',
        border: '1px solid #e8c47a',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Corner ornaments */}
      {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: i < 2 ? '8px' : 'auto',
          bottom: i >= 2 ? '8px' : 'auto',
          left: i % 2 === 0 ? '8px' : 'auto',
          right: i % 2 === 1 ? '8px' : 'auto',
          width: '24px', height: '24px',
          borderTop: i < 2 ? `3px solid #D4A853` : 'none',
          borderBottom: i >= 2 ? `3px solid #D4A853` : 'none',
          borderLeft: i % 2 === 0 ? `3px solid #D4A853` : 'none',
          borderRight: i % 2 === 1 ? `3px solid #D4A853` : 'none',
          zIndex: 2,
        }} />
      ))}

      <div style={{ padding: '48px 56px', position: 'relative', zIndex: 3 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={titleStyle}>{name}</div>
          <div style={{ width: '80px', height: '2px', background: 'linear-gradient(90deg, transparent, #D4A853, transparent)', margin: '12px auto' }} />
        </div>

        {/* Profile photo */}
        {profile.photo && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '140px', height: '140px',
              border: '3px solid #D4A853',
              padding: '4px',
              ...getPhotoStyle(profile.shape),
              boxShadow: '0 4px 20px rgba(139,75,107,0.2)',
            }}>
              <img src={profile.photo} alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover', ...getPhotoStyle(profile.shape) }} />
            </div>
          </div>
        )}

        {/* Personal section */}
        {personalSection && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px',
            }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #D4A853)' }} />
              <div style={{ ...sectionTitleStyle, whiteSpace: 'nowrap' }}>{personalSection.title}</div>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #D4A853, transparent)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
              {personalSection.fields.filter(f => f.id !== 'name' && f.value).map(field => (
                <div key={field.id} style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                  <span style={{ ...labelStyle, minWidth: '120px' }}>{field.label}:</span>
                  <span style={valueStyle}>{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other sections */}
        {otherSections.map(section => {
          const visibleFields = section.fields.filter(f => f.value);
          if (visibleFields.length === 0) return null;
          return (
            <div key={section.id} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #D4A853)' }} />
                <div style={{ ...sectionTitleStyle, whiteSpace: 'nowrap' }}>{section.title}</div>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #D4A853, transparent)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
                {visibleFields.map(field => (
                  <div key={field.id} style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                    <span style={{ ...labelStyle, minWidth: '160px' }}>{field.label}:</span>
                    <span style={valueStyle}>{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer */}
        {/* <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e8c47a' }}>
          <div style={{ fontSize: '10px', color: '#B5718A', fontFamily: 'Lato', letterSpacing: '2px' }}>
            ✦ OM NAMAH SHIVAYA ✦
          </div>
        </div> */}
      </div>
    </div>
  );
}
