import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBiodataStore } from '../store/biodataStore';
import { getPersonName, formatDate } from '../utils/exportUtils';
import TemplateRenderer from '../templates/TemplateRenderer';

function BiodataCard({ biodata, onEdit, onDelete, onDuplicate, onExport }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (type) => {
    setExporting(true);
    setMenuOpen(false);
    onExport(biodata, type);
    setTimeout(() => setExporting(false), 2000);
  };

  const templateLabels = {
    classic: 'Classic',
    modern: 'Modern',
    minimal: 'Minimal',
    traditional: 'Traditional',
    photo: 'Photo Focused',
  };

  const templateColors = {
    classic: '#8B4B6B',
    modern: '#6B3553',
    minimal: '#2c1a22',
    traditional: '#8B4B6B',
    photo: '#4a2035',
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden premium-shadow premium-shadow-hover transition-all duration-500 animate-fade-in-scale border border-rose-50">
      {/* Preview thumbnail */}
      <div className="relative bg-[#fdf8f9] overflow-hidden aspect-[4/3] cursor-pointer" onClick={() => onEdit(biodata)}>
        <div style={{
          transform: 'scale(0.32)',
          transformOrigin: 'top left',
          width: '794px',
          pointerEvents: 'none',
          position: 'absolute', top: '12px', left: '12px',
        }}>
          <TemplateRenderer biodata={biodata} />
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 bg-white text-[#8B4B6B] px-4 py-2 rounded-full font-bold text-sm shadow-xl transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            Open Editor
          </button>
        </div>

        {/* Template badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
          style={{ background: templateColors[biodata.template] || '#8B4B6B' }}>
          {templateLabels[biodata.template] || 'Classic'}
        </div>
        
        {/* Menu button */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl hover:bg-black/20 transition-colors backdrop-blur-md"
            style={{ background: 'rgba(0,0,0,0.15)' }}
          >⋮</button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-2xl z-20 overflow-hidden min-w-[180px] border border-rose-50 py-2">
                {[
                  { label: '✏️ Edit Design', action: () => { setMenuOpen(false); onEdit(biodata); } },
                  { label: '📋 Duplicate', action: () => { setMenuOpen(false); onDuplicate(biodata.id); } },
                  { label: '📄 Export PDF', action: () => handleExport('pdf') },
                  { label: '🖼️ Export PNG', action: () => handleExport('png') },
                  { label: '🗑️ Delete', action: () => { setMenuOpen(false); onDelete(biodata.id); }, danger: true },
                ].map(item => (
                  <button key={item.label}
                    onClick={(e) => { e.stopPropagation(); item.action(); }}
                    className="flex items-center w-full text-left px-5 py-3 text-sm hover:bg-rose-50 transition-colors font-medium"
                    style={{ color: item.danger ? '#ef4444' : '#5a3a4a' }}>
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-playfair font-bold text-xl truncate text-[#2c1a22]">
              {getPersonName(biodata) || 'Untitled Biodata'}
            </h3>
            <p className="text-xs mt-1.5 font-medium uppercase tracking-wider text-[#B5718A]">
              Last updated {formatDate(biodata.updatedAt)}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onEdit(biodata)}
            className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm hover:shadow-lg active:scale-95"
            style={{ background: 'linear-gradient(135deg, #8B4B6B, #6B3553)', color: '#fff' }}>
            Continue Editing
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting}
            className="px-4 py-3 rounded-2xl text-sm font-bold transition-all hover:bg-rose-50 border-2 border-rose-100 flex items-center justify-center min-w-[60px]"
            style={{ color: '#8B4B6B' }}>
            {exporting ? '...' : '📥'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { savedBiodatas, loadBiodata, deleteBiodata, duplicateBiodata, clearCurrent } = useBiodataStore();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');

  const handleCreate = () => {
    clearCurrent();
    navigate('/templates');
  };

  const handleEdit = (biodata) => {
    loadBiodata(biodata.id);
    navigate('/form');
  };

  const handleDelete = (id) => {
    deleteBiodata(id);
    setDeleteConfirm(null);
  };

  const handleExport = async (biodata, type) => {
    loadBiodata(biodata.id);
    navigate(`/preview?export=${type}`);
  };

  const filtered = savedBiodatas.filter(b =>
    getPersonName(b).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fdf8f9]">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 glass-card border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B4B6B] to-[#6B3553] flex items-center justify-center text-white text-xl shadow-lg shadow-rose-200">
              💍
            </div>
            <div>
              <h1 className="font-playfair font-black text-xl text-[#2c1a22] tracking-tight">
                Biodata<span className="text-[#8B4B6B]">Maker</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#B5718A] -mt-1">
                Premium Design Suite
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 mr-auto ml-12">
            <button className="text-sm font-bold text-[#8B4B6B] border-b-2 border-[#8B4B6B] pb-1">My Projects</button>
            <button className="text-sm font-bold text-[#B5718A] hover:text-[#8B4B6B] transition-colors pb-1" onClick={() => navigate('/templates')}>Templates</button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-rose-100 hover:shadow-rose-200 active:scale-95 text-white"
              style={{ background: 'linear-gradient(135deg, #8B4B6B, #6B3553)' }}>
              <span>+</span> Create New
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome & Search Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="animate-slide-in-right">
            <h2 className="font-playfair font-black text-4xl md:text-5xl text-[#2c1a22] leading-tight">
              Welcome back,<br/>
              <span className="text-[#8B4B6B]">Start a masterpiece.</span>
            </h2>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#2c1a22]">{savedBiodatas.length}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#B5718A]">Total Designs</span>
              </div>
              <div className="w-px h-8 bg-rose-100"></div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#2c1a22]">{savedBiodatas.filter(b => b.profile.photo).length}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#B5718A]">With Photos</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search your designs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-3xl text-sm outline-none bg-white premium-shadow border border-rose-50 transition-all focus:border-[#8B4B6B] focus:ring-4 focus:ring-rose-50"
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-30">🔍</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        {savedBiodatas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 glass-card rounded-[40px] border-2 border-dashed border-rose-200 animate-fade-in-scale">
            <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center text-5xl mb-8 shadow-inner">
              ✨
            </div>
            <h2 className="font-playfair text-3xl font-black mb-4 text-[#2c1a22]">
              No Biodatas Yet
            </h2>
            <p className="text-center text-sm mb-10 max-w-sm text-[#B5718A] leading-relaxed font-medium">
              Join thousands of users creating professional marriage biodatas in minutes. Choose a template to begin!
            </p>
            <button
              onClick={handleCreate}
              className="px-10 py-4 rounded-2xl font-black text-white text-sm transition-all shadow-2xl shadow-rose-200 hover:shadow-rose-300 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #8B4B6B, #6B3553)' }}>
              Get Started Now →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Create New Card */}
            <button
              onClick={handleCreate}
              className="group border-2 border-dashed border-rose-200 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all hover:border-[#8B4B6B] hover:bg-white hover:premium-shadow min-h-[300px] bg-rose-50/30">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 text-[#8B4B6B]">
                +
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#8B4B6B]">New Design</span>
            </button>

            {filtered.map(biodata => (
              <BiodataCard
                key={biodata.id}
                biodata={biodata}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteConfirm(id)}
                onDuplicate={duplicateBiodata}
                onExport={handleExport}
              />
            ))}
          </div>
        )}

        {filtered.length === 0 && savedBiodatas.length > 0 && (
          <div className="text-center py-24">
            <div className="text-4xl mb-4 opacity-20">🔎</div>
            <p className="text-[#B5718A] font-bold">No designs found matching "{search}"</p>
          </div>
        )}
      </main>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full animate-fade-in-scale shadow-2xl border border-rose-50">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">
                🗑️
              </div>
              <h3 className="font-playfair text-2xl font-black text-[#2c1a22]">Delete Project?</h3>
              <p className="text-sm mt-3 text-[#B5718A] font-medium leading-relaxed">
                This will permanently remove your biodata. This action cannot be reversed.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-4 rounded-2xl font-bold text-sm border-2 border-rose-50 text-[#5a3a4a] transition-all hover:bg-rose-50">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-4 rounded-2xl font-bold text-sm text-white transition-all shadow-lg shadow-red-100 hover:brightness-110 active:scale-95 bg-red-500">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
