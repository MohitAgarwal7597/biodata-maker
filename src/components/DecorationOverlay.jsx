import React from 'react';

export default function DecorationOverlay({ decorations }) {
  if (!decorations) return null;

  const {
    headerEnabled, headerText,
    footerEnabled, footerText,
    godSymbolEnabled, godSymbolUrl, godSymbolPosition, godSymbolSize
  } = decorations;

  const symbolStyle = {
    position: 'absolute',
    width: `${godSymbolSize || 60}px`,
    height: `${godSymbolSize || 60}px`,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Adjust symbol position to avoid touching borders
  if (godSymbolPosition === 'top-left') {
    symbolStyle.top = '45px';
    symbolStyle.left = '45px';
  } else if (godSymbolPosition === 'top-right') {
    symbolStyle.top = '45px';
    symbolStyle.right = '45px';
  } else {
    // Top Center
    // If header is enabled, we might need more room
    symbolStyle.top = headerEnabled ? '50px' : '35px';
    symbolStyle.left = '50%';
    symbolStyle.transform = 'translateX(-50%)';
  }

  return (
    <>
      {/* Header Text */}
      {headerEnabled && headerText && (
        <div style={{
          position: 'absolute', top: '28px', left: 0, right: 0,
          textAlign: 'center', zIndex: 5,
          fontSize: '11px', letterSpacing: '2px', color: '#8B4B6B',
          fontFamily: 'Lato', textTransform: 'uppercase', fontWeight: 'bold'
        }}>
          {headerText}
        </div>
      )}

      {/* God Symbol */}
      {godSymbolEnabled && godSymbolUrl && (
        <div style={symbolStyle}>
          <img src={godSymbolUrl} alt="Symbol" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
      )}

      {/* Footer Text */}
      {footerEnabled && footerText && (
        <div style={{
          position: 'absolute', bottom: '28px', left: 0, right: 0,
          textAlign: 'center', zIndex: 5,
          fontSize: '10px', letterSpacing: '2px', color: '#8B4B6B',
          fontFamily: 'Lato', textTransform: 'uppercase', fontWeight: 'bold'
        }}>
          {footerText}
        </div>
      )}
    </>
  );
}
