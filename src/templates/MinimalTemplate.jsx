import React from 'react';
import DecorationOverlay from '../components/DecorationOverlay';

const getBackgroundStyle = (background) => {
  if (!background) return { backgroundColor: '#fafafa' };
  if (background.type === 'gradient') {
    return { background: `linear-gradient(${background.gradient?.direction || '135deg'}, ${background.gradient?.from || '#fdf2f8'}, ${background.gradient?.to || '#fff7ed'})` };
  }
  if (background.type === 'image' && background.image) {
    return { backgroundImage: `url(${background.image})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
  return { backgroundColor: background.color || '#fafafa' };
};

const getPhotoStyle = (shape) => {
  switch (shape) {
    case 'circle': return { borderRadius: '50%' };
    case 'rounded': return { borderRadius: '12px' };
    case 'square': return { borderRadius: '0' };
    default: return { borderRadius: '50%' };
  }
};

export default function MinimalTemplate({ biodata, exportMode = false }) {
  const { sections = [], style = {}, background = {}, profile = {}, decorations = {} } = biodata || {};
  const bgStyle = getBackgroundStyle(background);

  const titleStyle = {
    fontFamily: style.titleFont || 'Cormorant Garamond',
    fontSize: `${style.titleSize || 36}px`,
    fontWeight: style.titleBold ? '600' : '300',
    fontStyle: style.titleItalic ? 'italic' : 'normal',
    color: style.titleColor || '#2c1a22',
    letterSpacing: '2px',
  };

  const sectionTitleStyle = {
    fontFamily: style.sectionTitleFont || 'Cormorant Garamond',
    fontSize: `${style.sectionTitleSize || 15}px`,
    fontWeight: '600',
    color: style.sectionTitleColor || '#8B4B6B',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  };

  const labelStyle = {
    fontFamily: style.labelFont || 'Lato',
    fontSize: `${style.labelSize || 11}px`,
    fontWeight: '400',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
  };

  const valueStyle = {
    fontFamily: style.valueFont || 'Cormorant Garamond',
    fontSize: `${style.valueSize || 15}px`,
    fontWeight: '400',
    color: style.valueColor || '#333',
  };

  const personalSection = sections.find(s => s.id === 'personal');
  const nameField = personalSection?.fields?.find(f => f.id === 'name');
  const name = nameField?.value || 'Your Name';
  const otherSections = sections.filter(s => s.id !== 'personal');

  return (
    <div id={exportMode ? "biodata-preview" : "biodata-visual"} style={{ ...bgStyle, width: '794px', minHeight: '1123px', position: 'relative' }}>
      <DecorationOverlay decorations={decorations} />
      
      <div style={{ display: 'flex', minHeight: '1123px' }}>
        {/* Left sidebar */}
        <div style={{
          width: '220px', flexShrink: 0,
          background: '#2c1a22',
          padding: '48px 28px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          {profile.photo && (
            <div style={{
              width: '130px', height: '130px',
              border: '3px solid #D4A853',
              marginBottom: '24px',
              ...getPhotoStyle(profile.shape),
              overflow: 'hidden',
            }}>
              <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          {!profile.photo && (
            <div style={{
              width: '100px', height: '100px',
              borderRadius: '50%',
              border: '2px solid #D4A853',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', color: '#D4A853', marginBottom: '24px',
            }}>✦</div>
          )}

          <div style={{
            fontSize: '10px', color: '#D4A853', letterSpacing: '3px',
            textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center',
          }}>Marriage</div>
          <div style={{ fontSize: '10px', color: '#D4A853', letterSpacing: '3px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '24px' }}>
            Biodata
          </div>
          <div style={{ width: '30px', height: '1px', background: '#D4A853', marginBottom: '24px' }} />

          {/* Contact in sidebar */}
          {sections.find(s => s.id === 'contact') && (
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: '9px', color: '#D4A853', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Contact</div>
              {sections.find(s => s.id === 'contact').fields.filter(f => f.value).map(f => (
                <div key={f.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '9px', color: 'rgba(212,168,83,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>{f.label}</div>
                  <div style={{ fontSize: '12px', color: '#ddd', marginTop: '2px', wordBreak: 'break-word' }}>{f.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '48px 40px' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={titleStyle}>{name}</div>
            <div style={{ width: '48px', height: '1px', background: '#D4A853', marginTop: '12px' }} />
          </div>

          {personalSection && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ ...sectionTitleStyle, marginBottom: '16px' }}>{personalSection.title}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {personalSection.fields.filter(f => f.id !== 'name' && f.value).map(field => (
                  <div key={field.id}>
                    <div style={labelStyle}>{field.label}</div>
                    <div style={{ ...valueStyle, marginTop: '3px' }}>{field.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {otherSections.filter(s => s.id !== 'contact').map(section => {
            const visibleFields = section.fields.filter(f => f.value);
            if (visibleFields.length === 0) return null;
            return (
              <div key={section.id} style={{ marginBottom: '24px', paddingTop: '20px', borderTop: '1px solid #f0e0e8' }}>
                <div style={{ ...sectionTitleStyle, marginBottom: '14px' }}>{section.title}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {visibleFields.map(field => (
                    <div key={field.id}>
                      <div style={labelStyle}>{field.label}</div>
                      <div style={{ ...valueStyle, marginTop: '3px' }}>{field.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
