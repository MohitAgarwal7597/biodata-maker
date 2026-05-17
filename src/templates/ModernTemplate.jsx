import React from 'react';
import DecorationOverlay from '../components/DecorationOverlay';

const getBackgroundStyle = (background) => {
  if (!background) return { backgroundColor: '#ffffff' };
  if (background.type === 'gradient') {
    return { background: `linear-gradient(${background.gradient?.direction || '135deg'}, ${background.gradient?.from || '#fdf2f8'}, ${background.gradient?.to || '#fff7ed'})` };
  }
  if (background.type === 'image' && background.image) {
    return { backgroundImage: `url(${background.image})`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
  return { backgroundColor: background.color || '#ffffff' };
};

const getPhotoStyle = (shape) => {
  switch (shape) {
    case 'circle': return { borderRadius: '50%' };
    case 'rounded': return { borderRadius: '24px' };
    case 'square': return { borderRadius: '8px' };
    default: return { borderRadius: '50%' };
  }
};

export default function ModernTemplate({ biodata, exportMode = false }) {
  const { sections = [], style = {}, background = {}, profile = {}, decorations = {} } = biodata || {};
  const bgStyle = getBackgroundStyle(background);

  const titleStyle = {
    fontFamily: style.titleFont || 'Playfair Display',
    fontSize: `${style.titleSize || 32}px`,
    fontWeight: style.titleBold ? '900' : 'normal',
    fontStyle: style.titleItalic ? 'italic' : 'normal',
    color: style.titleColor || '#2c1a22',
    letterSpacing: '-1px',
  };

  const sectionTitleStyle = {
    fontFamily: style.sectionTitleFont || 'Playfair Display',
    fontSize: `${style.sectionTitleSize || 18}px`,
    fontWeight: style.sectionTitleBold ? 'bold' : 'normal',
    fontStyle: style.sectionTitleItalic ? 'italic' : 'normal',
    color: style.sectionTitleColor || '#8B4B6B',
  };

  const labelStyle = {
    fontFamily: style.labelFont || 'Lato',
    fontSize: `${style.labelSize || 12}px`,
    fontWeight: style.labelBold ? '900' : 'normal',
    fontStyle: style.labelItalic ? 'italic' : 'normal',
    color: style.labelColor || '#B5718A',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  const valueStyle = {
    fontFamily: style.valueFont || 'Lato',
    fontSize: `${style.valueSize || 14}px`,
    fontWeight: style.valueBold ? 'bold' : 'normal',
    fontStyle: style.valueItalic ? 'italic' : 'normal',
    color: style.valueColor || '#333333',
  };

  const personalSection = sections.find(s => s.id === 'personal');
  const nameField = personalSection?.fields?.find(f => f.id === 'name');
  const name = nameField?.value || 'Your Name';
  const otherSections = sections.filter(s => s.id !== 'personal');

  return (
    <div id={exportMode ? "biodata-preview" : "biodata-visual"} style={{ ...bgStyle, width: '794px', minHeight: '1123px', position: 'relative' }}>
      <DecorationOverlay decorations={decorations} />
      
      <div style={{ padding: '60px 50px' }}>
        <div style={{ display: 'flex', gap: '40px', marginBottom: '48px', alignItems: 'center' }}>
          {profile.photo && (
            <div style={{
              width: '180px', height: '180px', flexShrink: 0,
              border: '8px solid white',
              boxShadow: '0 10px 30px rgba(139,75,107,0.15)',
              ...getPhotoStyle(profile.shape),
            }}>
              <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', ...getPhotoStyle(profile.shape) }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: '900', color: '#D4A853', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Marriage Biodata
            </div>
            <div style={titleStyle}>{name}</div>
            <div style={{ width: '60px', height: '4px', background: '#8B4B6B', marginTop: '16px' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
          {personalSection && (
            <div style={{ background: 'rgba(255,255,255,0.4)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(139,75,107,0.1)' }}>
              <div style={{ ...sectionTitleStyle, marginBottom: '20px' }}>{personalSection.title}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 30px' }}>
                {personalSection.fields.filter(f => f.id !== 'name' && f.value).map(field => (
                  <div key={field.id}>
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
              <div key={section.id} style={{ padding: '0 30px' }}>
                <div style={{ ...sectionTitleStyle, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {section.title}
                  <div style={{ flex: 1, height: '1px', background: 'rgba(139,75,107,0.1)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 30px' }}>
                  {visibleFields.map(field => (
                    <div key={field.id}>
                      <div style={labelStyle}>{field.label}</div>
                      <div style={{ ...valueStyle, marginTop: '4px' }}>{field.value}</div>
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
