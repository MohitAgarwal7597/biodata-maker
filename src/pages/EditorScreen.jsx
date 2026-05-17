import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBiodataStore } from '../store/biodataStore';
import TemplateRenderer from '../templates/TemplateRenderer';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const FONTS = [
  'Playfair Display',
  'Lato',
  'Cormorant Garamond',
  'Cinzel',
  'EB Garamond',
  'Georgia',
  'Times New Roman',
  'Arial',
];

const GRADIENT_PRESETS = [
  { label: 'Blush', from: '#fdf2f8', to: '#fff7ed', direction: '135deg' },
  { label: 'Rose Gold', from: '#f5e6ed', to: '#fdf6e3', direction: '135deg' },
  { label: 'Lavender', from: '#f3e8ff', to: '#fce7f3', direction: '135deg' },
  { label: 'Ivory', from: '#fffbf0', to: '#fff5e0', direction: '135deg' },
  { label: 'Sage', from: '#f0fff4', to: '#f0f4ff', direction: '135deg' },
  { label: 'Peach', from: '#fff7ed', to: '#fff1f2', direction: '135deg' },
];

const SOLID_PRESETS = [
  '#ffffff', '#fffbf0', '#fdf8f9', '#f5e6ed', '#fdf6e3',
  '#f0f4ff', '#f0fff4', '#2c1a22', '#8B4B6B', '#D4A853',
];

function SortableSection({ section }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style}
      className="flex items-center gap-4 p-4 rounded-2xl bg-white mb-3 premium-shadow border border-rose-50 group transition-all"
    >
      <div {...attributes} {...listeners}
        className="drag-handle text-gray-300 hover:text-[#D4A853] transition-colors cursor-grab text-xl p-2"
      >
        ⠿
      </div>
      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-xl">
        {section.icon}
      </div>
      <span className="font-bold text-sm text-[#2c1a22]">{section.title}</span>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black uppercase tracking-widest text-[#B5718A]">
        Drag to Reorder
      </div>
    </div>
  );
}

function StyleControl({ label, children }) {
  return (
    <div className="mb-6 animate-fade-in-scale">
      <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-[#B5718A]">
        {label}
      </label>
      {children}
    </div>
  );
}

function TextStylePanel({ prefix, label, style, onUpdate }) {
  const fontKey = `${prefix}Font`;
  const sizeKey = `${prefix}Size`;
  const boldKey = `${prefix}Bold`;
  const italicKey = `${prefix}Italic`;
  const colorKey = `${prefix}Color`;

  return (
    <div className="bg-white rounded-[32px] p-8 premium-shadow border border-rose-50 mb-8 animate-fade-in-scale">
      <h4 className="font-playfair font-black text-xl mb-8 text-[#2c1a22]">{label}</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        <StyleControl label="Typography">
          <select value={style[fontKey]} onChange={e => onUpdate(fontKey, e.target.value)}
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2 border-rose-50 bg-white focus:border-[#8B4B6B] transition-all font-medium"
            style={{ fontFamily: style[fontKey] }}>
            {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
          </select>
        </StyleControl>

        <StyleControl label={`Size: ${style[sizeKey]}px`}>
          <div className="flex items-center gap-4">
            <input type="range" min="10" max="48" value={style[sizeKey]}
              onChange={e => onUpdate(sizeKey, parseInt(e.target.value))}
              className="flex-1 h-1.5 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-[#8B4B6B]" />
          </div>
        </StyleControl>

        <StyleControl label="Format">
          <div className="flex gap-3">
            <button onClick={() => onUpdate(boldKey, !style[boldKey])}
              className={`w-12 h-12 rounded-2xl text-sm font-black transition-all ${
                style[boldKey] ? 'bg-[#8B4B6B] text-white' : 'bg-rose-50 text-[#8B4B6B]'
              }`}>B</button>
            <button onClick={() => onUpdate(italicKey, !style[italicKey])}
              className={`w-12 h-12 rounded-2xl text-sm italic font-semibold transition-all ${
                style[italicKey] ? 'bg-[#8B4B6B] text-white' : 'bg-rose-50 text-[#8B4B6B]'
              }`}>I</button>
          </div>
        </StyleControl>

        <StyleControl label="Color">
          <div className="flex items-center gap-4">
            <input type="color" value={style[colorKey]}
              onChange={e => onUpdate(colorKey, e.target.value)}
              className="w-12 h-12 rounded-2xl border-0 cursor-pointer overflow-hidden p-0 bg-transparent" />
            <span className="font-mono text-xs font-bold text-[#B5718A] tracking-wider uppercase">{style[colorKey]}</span>
          </div>
        </StyleControl>
      </div>
    </div>
  );
}

export default function EditorScreen() {
  const navigate = useNavigate();
  const { currentBiodata, updateStyle, updateBackground, updateDecorations, reorderSections, saveBiodata } = useBiodataStore();
  const [tab, setTab] = useState('style'); // 'style' | 'background' | 'order' | 'decorations'
  const [bgTab, setBgTab] = useState('solid');
  const [imgError, setImgError] = useState('');
  const fileInputRef = useRef(null);
  const godSymbolInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!currentBiodata) { navigate('/home'); return null; }

  const { style, background, sections, decorations } = currentBiodata;

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIdx = sections.findIndex(s => s.id === active.id);
      const newIdx = sections.findIndex(s => s.id === over.id);
      reorderSections(arrayMove(sections, oldIdx, newIdx));
    }
  };

  const handleBgImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setImgError('Image must be under 5MB'); return; }
    setImgError('');
    const reader = new FileReader();
    reader.onload = ev => updateBackground({ image: ev.target.result, type: 'image' });
    reader.readAsDataURL(file);
  };

  const handleGodSymbolUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => updateDecorations({ godSymbolUrl: ev.target.result, godSymbolEnabled: true });
    reader.readAsDataURL(file);
  };

  const tabs = [
    { id: 'style', label: '🖋 Text Style', icon: '🖋' },
    { id: 'background', label: '🎨 Background', icon: '🎨' },
    { id: 'decorations', label: '✨ Embellishments', icon: '✨' },
    { id: 'order', label: '⠿ Section Order', icon: '⠿' },
  ];

  const getPersonNameDisplay = (biodata) => {
    const personalSection = biodata.sections.find(s => s.id === 'personal');
    const nameField = personalSection?.fields.find(f => f.id === 'name');
    return nameField?.value || 'New Draft';
  };

  return (
    <div className="min-h-screen bg-[#fdf8f9] flex flex-col h-screen overflow-hidden">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 glass-card border-b border-rose-100 h-20 flex-shrink-0">
        <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/form')} className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#8B4B6B] hover:bg-rose-100 transition-colors">
              ←
            </button>
            <div>
              <h1 className="font-playfair font-black text-xl text-[#2c1a22] tracking-tight">
                Style <span className="text-[#8B4B6B]">Studio</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#B5718A] -mt-1">
                Editing: {getPersonNameDisplay(currentBiodata)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/form')} className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#8B4B6B] bg-rose-50 hover:bg-rose-100 transition-all">
              ✏️ Content
            </button>
            <button onClick={() => navigate('/templates')} className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#8B4B6B] bg-rose-50 hover:bg-rose-100 transition-all">
              🎨 Layouts
            </button>
            <button onClick={() => navigate('/preview')} className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#8B4B6B] bg-rose-50 hover:bg-rose-100 transition-all">
              👁 Preview
            </button>
            <div className="w-px h-6 bg-rose-100 mx-2"></div>
            <button onClick={() => { saveBiodata(); navigate('/preview'); }}
              className="px-8 py-2.5 rounded-xl text-xs font-black transition-all shadow-xl shadow-rose-100 active:scale-95 text-white"
              style={{ background: 'linear-gradient(135deg, #8B4B6B, #6B3553)' }}>
              💾 Save & Preview
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full">
        {/* Left Sidebar Navigation */}
        <aside className="w-80 border-r border-rose-100 bg-white/50 backdrop-blur-md p-6 overflow-y-auto custom-scrollbar flex-shrink-0">
          <div className="mb-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B5718A] mb-6">Editor Modes</h3>
            <div className="space-y-2">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                    tab === t.id 
                    ? 'bg-[#8B4B6B] text-white shadow-xl shadow-rose-200' 
                    : 'hover:bg-rose-50 text-[#5a3a4a]'
                  }`}>
                  <span className={`text-xl transition-transform duration-300 ${tab === t.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {t.icon}
                  </span>
                  <span className="font-bold text-sm tracking-tight">{t.label}</span>
                  {tab === t.id && (
                    <div className="ml-auto w-1.5 h-6 bg-white/30 rounded-full animate-in fade-in duration-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Main Editor Area */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-white/30 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto pb-20">
            {tab === 'style' && (
              <div className="animate-slide-in-right">
                <header className="mb-12">
                  <h2 className="text-4xl font-playfair font-black text-[#2c1a22] mb-3">Text Styling</h2>
                  <p className="text-sm text-[#B5718A] font-medium leading-relaxed">
                    Customize the appearance of every text element in your biodata.
                  </p>
                </header>
                {[
                  { prefix: 'title', label: 'Main Title (Name)' },
                  { prefix: 'sectionTitle', label: 'Section Headers' },
                  { prefix: 'label', label: 'Field Labels' },
                  { prefix: 'value', label: 'Field Values' },
                ].map(({ prefix, label }) => (
                  <TextStylePanel
                    key={prefix}
                    prefix={prefix}
                    label={label}
                    style={style}
                    onUpdate={updateStyle}
                  />
                ))}
              </div>
            )}

            {tab === 'background' && (
              <div className="animate-slide-in-right">
                <header className="mb-12">
                  <h2 className="text-4xl font-playfair font-black text-[#2c1a22] mb-3">Canvas Background</h2>
                  <p className="text-sm text-[#B5718A] font-medium leading-relaxed">
                    Set the mood with elegant colors, gradients, or custom imagery.
                  </p>
                </header>

                <div className="bg-white rounded-[32px] p-8 premium-shadow border border-rose-50 mb-10">
                  <div className="flex gap-2 p-1.5 bg-rose-50 rounded-2xl mb-8">
                    {['solid', 'gradient', 'image'].map(t => (
                      <button key={t} onClick={() => { setBgTab(t); updateBackground({ type: t }); }}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                          bgTab === t ? 'bg-[#8B4B6B] text-white shadow-lg' : 'text-[#8B4B6B]'
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>

                  {bgTab === 'solid' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#B5718A] mb-4">Handpicked Presets</p>
                      <div className="grid grid-cols-5 gap-4 mb-8">
                        {SOLID_PRESETS.map(color => (
                          <button key={color} onClick={() => updateBackground({ color, type: 'solid' })}
                            className="aspect-square rounded-2xl transition-all hover:scale-110 shadow-sm border-2"
                            style={{
                              background: color,
                              borderColor: background.color === color && background.type === 'solid' ? '#8B4B6B' : 'transparent',
                            }} />
                        ))}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#B5718A] mb-4">Custom Color</p>
                      <div className="flex items-center gap-4">
                        <input type="color" value={background.color || '#ffffff'}
                          onChange={e => updateBackground({ color: e.target.value, type: 'solid' })}
                          className="w-14 h-14 rounded-2xl border-0 cursor-pointer p-0 bg-transparent" />
                        <span className="font-mono text-sm font-bold text-[#8B4B6B] uppercase tracking-wider">{background.color}</span>
                      </div>
                    </div>
                  )}

                  {bgTab === 'gradient' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#B5718A] mb-4">Signature Gradients</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {GRADIENT_PRESETS.map(g => (
                          <button key={g.label}
                            onClick={() => updateBackground({ gradient: g, type: 'gradient' })}
                            className="h-20 rounded-2xl transition-all hover:scale-105 flex items-end p-3 shadow-sm border-2 overflow-hidden"
                            style={{
                              background: `linear-gradient(${g.direction}, ${g.from}, ${g.to})`,
                              borderColor: background.gradient?.label === g.label ? '#8B4B6B' : 'transparent',
                            }}>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-white/90 px-2 py-1 rounded-lg text-[#2c1a22]">{g.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-6 p-6 bg-rose-50/50 rounded-3xl">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#B5718A] mb-2 block">Primary</label>
                          <input type="color" value={background.gradient?.from || '#fdf2f8'}
                            onChange={e => updateBackground({ type: 'gradient', gradient: { ...background.gradient, from: e.target.value } })}
                            className="w-full h-12 rounded-xl cursor-pointer" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#B5718A] mb-2 block">Secondary</label>
                          <input type="color" value={background.gradient?.to || '#fff7ed'}
                            onChange={e => updateBackground({ type: 'gradient', gradient: { ...background.gradient, to: e.target.value } })}
                            className="w-full h-12 rounded-xl cursor-pointer" />
                        </div>
                        <div className="col-span-full">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#B5718A] mb-2 block">Angle</label>
                          <select
                            value={background.gradient?.direction || '135deg'}
                            onChange={e => updateBackground({ type: 'gradient', gradient: { ...background.gradient, direction: e.target.value } })}
                            className="w-full px-4 py-3 rounded-xl text-sm font-bold bg-white outline-none border-2 border-transparent focus:border-[#8B4B6B] transition-all">
                            <option value="0deg">↑ Top to Bottom</option>
                            <option value="90deg">→ Left to Right</option>
                            <option value="135deg">↘ Diagonal</option>
                            <option value="45deg">↗ Anti-diagonal</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {bgTab === 'image' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                      <button onClick={() => fileInputRef.current?.click()}
                        className="w-full py-16 rounded-[32px] flex flex-col items-center gap-4 transition-all hover:bg-rose-50 bg-rose-50/30 border-2 border-dashed border-rose-200"
                        style={{ borderColor: '#D4A853' }}>
                        <span className="text-5xl">🖼️</span>
                        <span className="text-sm font-black uppercase tracking-widest text-[#8B4B6B]">
                          {background.image ? 'Replace Wallpaper' : 'Upload Atmosphere'}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold">Recommended: High Resolution, Under 5MB</span>
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgImageUpload} />
                      {imgError && <p className="text-red-500 text-[10px] mt-4 font-bold uppercase text-center">{imgError}</p>}

                      {background.image && (
                        <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
                          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white h-40">
                            <img src={background.image} alt="" className="w-full h-full object-cover" />
                            <button onClick={() => updateBackground({ image: null, type: 'solid' })}
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white text-lg flex items-center justify-center shadow-xl">
                              ×
                            </button>
                          </div>
                          
                          <div className="mt-8 px-6 py-4 bg-rose-50 rounded-2xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#B5718A]">Atmosphere Strength</span>
                              <span className="text-xs font-bold text-[#8B4B6B]">{Math.round((background.opacity || 1) * 100)}%</span>
                            </div>
                            <input type="range" min="10" max="100" value={(background.opacity || 1) * 100}
                              onChange={e => updateBackground({ opacity: parseInt(e.target.value) / 100 })}
                              className="w-full h-1.5 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-[#8B4B6B]" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'decorations' && (
              <div className="animate-slide-in-right">
                <header className="mb-12">
                  <h2 className="text-4xl font-playfair font-black text-[#2c1a22] mb-3">Embellishments</h2>
                  <p className="text-sm text-[#B5718A] font-medium leading-relaxed">
                    Add spiritual symbols, headers, and footers to complete your biodata.
                  </p>
                </header>

                {/* Header Section */}
                <div className="bg-white rounded-[32px] p-8 premium-shadow border border-rose-50 mb-8 animate-fade-in-scale">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-playfair font-black text-xl text-[#2c1a22]">Header Text</h4>
                    <button 
                      onClick={() => updateDecorations({ headerEnabled: !decorations.headerEnabled })}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        decorations.headerEnabled ? 'bg-[#8B4B6B] text-white shadow-lg' : 'bg-rose-50 text-[#8B4B6B]'
                      }`}>
                      {decorations.headerEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  
                  {decorations.headerEnabled && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                      <StyleControl label="Custom Header Text">
                        <input 
                          type="text" 
                          value={decorations.headerText}
                          onChange={e => updateDecorations({ headerText: e.target.value })}
                          className="w-full px-5 py-3 rounded-2xl bg-rose-50 outline-none text-sm font-medium border-2 border-transparent focus:border-[#8B4B6B] transition-all"
                        />
                      </StyleControl>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tip: Common headers include "|| Shree Ganeshaya Namah ||" or "|| Om ||"</p>
                    </div>
                  )}
                </div>

                {/* God Symbol Section */}
                <div className="bg-white rounded-[32px] p-8 premium-shadow border border-rose-50 mb-8 animate-fade-in-scale">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-playfair font-black text-xl text-[#2c1a22]">God Symbol / Icon</h4>
                    <button 
                      onClick={() => updateDecorations({ godSymbolEnabled: !decorations.godSymbolEnabled })}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        decorations.godSymbolEnabled ? 'bg-[#8B4B6B] text-white shadow-lg' : 'bg-rose-50 text-[#8B4B6B]'
                      }`}>
                      {decorations.godSymbolEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  
                  {decorations.godSymbolEnabled && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#B5718A] mb-4">Upload Symbol</p>
                          <button 
                            onClick={() => godSymbolInputRef.current?.click()}
                            className="w-full aspect-square rounded-3xl border-2 border-dashed border-rose-200 bg-rose-50 flex flex-col items-center justify-center gap-2 hover:border-[#8B4B6B] transition-all overflow-hidden"
                          >
                            {decorations.godSymbolUrl ? (
                              <img src={decorations.godSymbolUrl} alt="Symbol" className="w-full h-full object-contain p-4" />
                            ) : (
                              <>
                                <span className="text-3xl">🪔</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#8B4B6B]">Upload PNG</span>
                              </>
                            )}
                          </button>
                          <input 
                            ref={godSymbolInputRef} 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleGodSymbolUpload} 
                          />
                        </div>
                        
                        <div className="space-y-6">
                          <StyleControl label="Symbol Position">
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { id: 'top-left', label: 'Left' },
                                { id: 'top-center', label: 'Center' },
                                { id: 'top-right', label: 'Right' },
                              ].map(pos => (
                                <button 
                                  key={pos.id}
                                  onClick={() => updateDecorations({ godSymbolPosition: pos.id })}
                                  className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                                    decorations.godSymbolPosition === pos.id 
                                    ? 'bg-[#8B4B6B] text-white' 
                                    : 'bg-rose-50 text-[#8B4B6B]'
                                  }`}>
                                  {pos.label}
                                </button>
                              ))}
                            </div>
                          </StyleControl>
                          
                          <StyleControl label={`Symbol Size: ${decorations.godSymbolSize}px`}>
                             <input type="range" min="30" max="120" value={decorations.godSymbolSize}
                              onChange={e => updateDecorations({ godSymbolSize: parseInt(e.target.value) })}
                              className="w-full h-1.5 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-[#8B4B6B]" />
                          </StyleControl>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Section */}
                <div className="bg-white rounded-[32px] p-8 premium-shadow border border-rose-50 mb-8 animate-fade-in-scale">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-playfair font-black text-xl text-[#2c1a22]">Footer Text</h4>
                    <button 
                      onClick={() => updateDecorations({ footerEnabled: !decorations.footerEnabled })}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        decorations.footerEnabled ? 'bg-[#8B4B6B] text-white shadow-lg' : 'bg-rose-50 text-[#8B4B6B]'
                      }`}>
                      {decorations.footerEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  
                  {decorations.footerEnabled && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                      <StyleControl label="Custom Footer Text">
                        <input 
                          type="text" 
                          value={decorations.footerText}
                          onChange={e => updateDecorations({ footerText: e.target.value })}
                          className="w-full px-5 py-3 rounded-2xl bg-rose-50 outline-none text-sm font-medium border-2 border-transparent focus:border-[#8B4B6B] transition-all"
                        />
                      </StyleControl>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'order' && (
              <div className="animate-slide-in-right">
                <header className="mb-12">
                  <h2 className="text-4xl font-playfair font-black text-[#2c1a22] mb-3">Architect Layout</h2>
                  <p className="text-sm text-[#B5718A] font-medium leading-relaxed">
                    Arrange the hierarchy of your information by dragging sections.
                  </p>
                </header>
                <div className="max-w-xl">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                      {sections.map(section => (
                        <SortableSection key={section.id} section={section} />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Live Preview Area */}
        <aside className="hidden xl:block w-[450px] bg-[#f8f0f4] p-10 overflow-hidden relative flex-shrink-0">
          <div className="sticky top-0 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B5718A]">Masterpiece Preview</h3>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#8B4B6B]"></div>
                <div className="w-2 h-2 rounded-full bg-[#D4A853]"></div>
              </div>
            </div>

            <div className="flex-1 rounded-[32px] overflow-hidden premium-shadow bg-white border-8 border-white">
              <div className="h-full overflow-y-auto custom-scrollbar">
                <div className="p-4 flex justify-center bg-[#fdf8f9] min-h-full overflow-hidden">
                  <div className="bg-white shadow-2xl origin-top" style={{ width: '794px', transform: 'scale(0.45)' }}>
                    <TemplateRenderer biodata={currentBiodata} />
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/preview')}
              className="mt-8 w-full py-4 rounded-2xl glass-card text-[#8B4B6B] font-bold text-sm border-2 border-white hover:bg-white transition-all flex items-center justify-center gap-3">
              <span>Full Screen Preview</span>
              <span className="text-lg">↗</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
