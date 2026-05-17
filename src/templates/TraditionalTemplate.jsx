import React from 'react';
import DecorationOverlay from '../components/DecorationOverlay';

const getBackgroundStyle = (background) => {
  if (!background) return { backgroundColor: '#fffbf0' };
  if (background.type === 'gradient') {
    return { background: `linear-gradient(${background.gradient?.direction || '135deg'}, ${background.gradient?.from || '#fffbf0'}, ${background.gradient?.to || '#fff5e0'})` };
  }
  if (background.type === 'image' && background.image) {
    return { backgroundImage: `url(${background.image})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
  return { backgroundColor: background.color || '#fffbf0' };
};

const getPhotoStyle = (shape) => {
  switch (shape) {
    case 'circle': return { borderRadius: '50%' };
    case 'rounded': return { borderRadius: '12px' };
    case 'square': return { borderRadius: '2px' };
    default: return { borderRadius: '50%' };
  }
};

const Divider = () => (
  <div style={{ textAlign: 'center', margin: '12px 0', color: '#D4A853', fontSize: '14px', letterSpacing: '8px' }}>
    ✦ ❖ ✦
  </div>
);

export default function TraditionalTemplate({ biodata, exportMode = false }) {
  const { sections = [], style = {}, background = {}, profile = {}, decorations = {} } = biodata || {};
  const bgStyle = getBackgroundStyle(background);

  const titleStyle = {
    fontFamily: style.titleFont || 'Cinzel',
    fontSize: `${style.titleSize || 26}px`,
    fontWeight: style.titleBold ? '700' : '400',
    color: style.titleColor || '#6B3553',
    letterSpacing: '3px',
    textAlign: 'center',
  };

  const sectionTitleStyle = {
    fontFamily: style.sectionTitleFont || 'Cinzel',
    fontSize: `${style.sectionTitleSize || 13}px`,
    fontWeight: '600',
    color: style.sectionTitleColor || '#8B4B6B',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textAlign: 'center',
  };

  const labelStyle = {
    fontFamily: style.labelFont || 'Lato',
    fontSize: `${style.labelSize || 12}px`,
    fontWeight: '700',
    color: style.labelColor || '#6B3553',
    minWidth: '160px',
  };

  const valueStyle = {
    fontFamily: style.valueFont || 'Lato',
    fontSize: `${style.valueSize || 12}px`,
    color: style.valueColor || '#333',
  };

  const personalSection = sections.find(s => s.id === 'personal');
  const nameField = personalSection?.fields?.find(f => f.id === 'name');
  const name = nameField?.value || 'Your Name';
  const otherSections = sections.filter(s => s.id !== 'personal');

  return (
    <div id={exportMode ? "biodata-preview" : "biodata-visual"} style={{ ...bgStyle, width: '794px', minHeight: '1123px', position: 'relative' }}>
      <DecorationOverlay decorations={decorations} />
      
      {/* Outer border */}
      <div style={{ position: 'absolute', inset: '10px', border: '3px double #D4A853', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: '16px', border: '1px solid #e8c47a', pointerEvents: 'none', zIndex: 1 }} />

      {/* Corner flowers */}
      {[
        { top: '6px', left: '6px' },
        { top: '6px', right: '6px' },
        { bottom: '6px', left: '6px' },
        { bottom: '6px', right: '6px' },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', ...pos,
          fontSize: '18px', color: '#D4A853', zIndex: 2, lineHeight: 1,
        }}>✿</div>
      ))}

      <div style={{ padding: '40px 60px', position: 'relative', zIndex: 3 }}>
        {/* Main title box */}
        <div style={{
          border: '2px solid #D4A853',
          padding: '16px 24px',
          textAlign: 'center',
          marginBottom: '20px',
          background: 'rgba(212,168,83,0.05)',
          position: 'relative',
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '4px', color: '#D4A853', fontFamily: 'Cinzel', marginBottom: '8px' }}>
            VIVAH BIODATA
          </div>
          <div style={titleStyle}>{name}</div>
          <Divider />
          <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#B5718A', fontFamily: 'Cinzel' }}>
            WITH BLESSINGS OF ALMIGHTY
          </div>
        </div>

        {/* Profile photo */}
        {profile.photo && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '130px', height: '130px',
              border: '4px solid #D4A853',
              padding: '3px',
              ...getPhotoStyle(profile.shape),
              boxShadow: '0 0 0 2px #fff, 0 0 0 4px #D4A853',
            }}>
              <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', ...getPhotoStyle(profile.shape) }} />
            </div>
          </div>
        )}

        {/* Personal section */}
        {personalSection && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ background: 'linear-gradient(90deg, transparent, #8B4B6B, transparent)', height: '1px', marginBottom: '8px' }} />
            <div style={sectionTitleStyle}>{personalSection.title}</div>
            <div style={{ background: 'linear-gradient(90deg, transparent, #8B4B6B, transparent)', height: '1px', margin: '8px 0 14px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
              {personalSection.fields.filter(f => f.id !== 'name' && f.value).map(field => (
                <div key={field.id} style={{ display: 'flex', gap: '8px', paddingBottom: '6px', borderBottom: '1px dotted #e8c47a' }}>
                  <span style={labelStyle}>{field.label}</span>
                  <span style={{ color: '#888', margin: '0 4px' }}>:</span>
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
            <div key={section.id} style={{ marginBottom: '14px' }}>
              <div style={{ background: 'linear-gradient(90deg, transparent, #8B4B6B, transparent)', height: '1px', marginBottom: '8px' }} />
              <div style={sectionTitleStyle}>{section.title}</div>
              <div style={{ background: 'linear-gradient(90deg, transparent, #8B4B6B, transparent)', height: '1px', margin: '8px 0 12px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
                {visibleFields.map(field => (
                  <div key={field.id} style={{ display: 'flex', gap: '8px', paddingBottom: '6px', borderBottom: '1px dotted #e8c47a' }}>
                    <span style={labelStyle}>{field.label}</span>
                    <span style={{ color: '#888', margin: '0 4px' }}>:</span>
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
