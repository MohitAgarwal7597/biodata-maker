import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBiodataStore } from '../store/biodataStore';
import TemplateRenderer from '../templates/TemplateRenderer';
import { exportAsPDF, exportAsPNG, exportAsJPG, getPersonName } from '../utils/exportUtils';

export default function PreviewScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentBiodata, saveBiodata } = useBiodataStore();
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState(null);
  const [toast, setToast] = useState(null);
  const [zoom, setZoom] = useState(0.5);
  const [autoExported, setAutoExported] = useState(false);
  const autoExport = searchParams.get('export');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleExport = useCallback(async (type) => {
    setExporting(true);
    setExportType(type);

    const exportEl = document.getElementById('biodata-export-container');
    if (exportEl) {
      exportEl.style.left = '-9999px';
      exportEl.style.visibility = 'visible';
    }

    await new Promise(r => setTimeout(r, 200));

    try {
      const name = currentBiodata
        ? (getPersonName(currentBiodata).replace(/\s+/g, '_') || 'biodata')
        : 'biodata';

      if (type === 'pdf') await exportAsPDF('biodata-preview', `${name}_biodata`);
      else if (type === 'png') await exportAsPNG('biodata-preview', `${name}_biodata`);
      else if (type === 'jpg') await exportAsJPG('biodata-preview', `${name}_biodata`);

      showToast(`✓ ${type.toUpperCase()} exported successfully!`);
    } catch (err) {
      console.error(err);
      showToast('❌ Export failed — please try again.');
    } finally {
      if (exportEl) {
        exportEl.style.visibility = 'hidden';
      }
      setExporting(false);
      setExportType(null);
    }
  }, [currentBiodata, showToast]);

  useEffect(() => {
    if (autoExport && currentBiodata && !autoExported) {
      setAutoExported(true);
      setTimeout(() => handleExport(autoExport), 1000);
    }
  }, [autoExport, currentBiodata, autoExported, handleExport]);

  if (!currentBiodata) {
    navigate('/home');
    return null;
  }

  const handleSaveAndGoHome = () => {
    saveBiodata();
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a0e16]">
      {/* Hidden container for export */}
      <div
        id="biodata-export-container"
        style={{
          position: 'fixed',
          top: 0,
          left: '-9999px',
          width: '794px',
          minHeight: '1123px',
          zIndex: -1,
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <TemplateRenderer biodata={currentBiodata} exportMode={true} />
      </div>

      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 glass-card border-b border-white/5 h-20 flex-shrink-0" style={{ background: 'rgba(26, 14, 22, 0.8)' }}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/form')} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              ←
            </button>
            <div>
              <h1 className="font-playfair font-black text-xl text-white tracking-tight">
                Export <span className="text-[#D4A853]">Masterpiece</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 -mt-1">
                Design: {getPersonName(currentBiodata) || 'Untitled'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
              <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="text-white/40 hover:text-white transition-colors">－</button>
              <span className="text-[10px] font-mono text-white/60 min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(1.2, z + 0.1))} className="text-white/40 hover:text-white transition-colors">＋</button>
            </div>
            
            <button onClick={() => navigate('/templates')} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white/70 bg-white/5 hover:bg-white/10 transition-all">Layouts</button>
            <button onClick={() => navigate('/editor')} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white/70 bg-white/5 hover:bg-white/10 transition-all">Style</button>
            <button onClick={handleSaveAndGoHome} className="px-8 py-2.5 rounded-xl text-xs font-black bg-[#D4A853] text-[#1a0e16] shadow-xl shadow-gold-900/20 active:scale-95 transition-all">
              Save & Exit
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-auto flex items-start justify-center p-8 lg:p-12 custom-scrollbar">
        <div 
          className="relative transition-transform duration-500 ease-out animate-fade-in-scale"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.8)',
            marginBottom: `${-(1 - zoom) * 1123}px`
          }}
        >
          <TemplateRenderer biodata={currentBiodata} />
        </div>
      </main>

      {/* Export Bar */}
      <footer className="glass-card border-t border-white/5 py-8 flex-shrink-0" style={{ background: 'rgba(26, 14, 22, 0.9)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-2">Select Format</h3>
              <p className="text-white text-lg font-playfair font-bold">Download your high-resolution biodata</p>
            </div>

            <div className="flex gap-4">
              {[
                { id: 'pdf', label: 'Download PDF', icon: '📄', color: 'bg-white text-[#1a0e16]' },
                { id: 'png', label: 'Save as PNG', icon: '🖼️', color: 'bg-white/10 text-white border border-white/10' },
                { id: 'jpg', label: 'Save as JPG', icon: '📸', color: 'bg-white/10 text-white border border-white/10' },
              ].map(format => (
                <button
                  key={format.id}
                  onClick={() => handleExport(format.id)}
                  disabled={exporting}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 ${format.color}`}
                >
                  {exporting && exportType === format.id ? (
                    <span className="animate-spin text-lg">⏳</span>
                  ) : (
                    <span className="text-lg">{format.icon}</span>
                  )}
                  {exporting && exportType === format.id ? 'Working...' : format.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
              Full A4 Resolution • No Watermarks • Instant Delivery
            </p>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 glass-card px-8 py-4 rounded-[24px] border border-[#D4A853]/30 shadow-2xl animate-fade-in-scale z-[100]">
          <div className="flex items-center gap-3">
            <span className="text-[#D4A853] text-lg font-bold">✨</span>
            <span className="text-white text-sm font-bold tracking-tight">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
