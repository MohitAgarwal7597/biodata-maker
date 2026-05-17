import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBiodataStore } from '../store/biodataStore';
import TemplateRenderer from '../templates/TemplateRenderer';

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless elegance with ornate borders and traditional layout',
    color: '#8B4B6B',
    accent: '#D4A853',
    icon: '📜',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean contemporary design with bold typography',
    color: '#6B3553',
    accent: '#D4A853',
    icon: '✨',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Sophisticated two-column layout with dark sidebar',
    color: '#2c1a22',
    accent: '#D4A853',
    icon: '◻',
  },
  {
    id: 'traditional',
    name: 'Traditional',
    description: 'Vibrant Indian style with double borders and Om symbol',
    color: '#8B4B6B',
    accent: '#D4A853',
    icon: '🪔',
  },
  {
    id: 'photo',
    name: 'Photo Focused',
    description: 'Full-width photo header with an elegant gallery feel',
    color: '#4a2035',
    accent: '#D4A853',
    icon: '📸',
  },
];

const SAMPLE_BIODATA = {
  sections: [
    {
      id: 'personal', title: 'Personal Information', icon: '👤',
      fields: [
        { id: 'name', label: 'Full Name', value: 'Priya Sharma' },
        { id: 'dob', label: 'Date of Birth', value: '15 March 1997' },
        { id: 'height', label: 'Height', value: '5\'4"' },
        { id: 'complexion', label: 'Complexion', value: 'Fair' },
        { id: 'religion', label: 'Religion', value: 'Hindu' },
        { id: 'caste', label: 'Caste', value: 'Brahmin' },
      ],
    },
    {
      id: 'education', title: 'Education & Career', icon: '🎓',
      fields: [
        { id: 'qualification', label: 'Qualification', value: 'MBA Finance' },
        { id: 'occupation', label: 'Occupation', value: 'Finance Manager' },
        { id: 'income', label: 'Annual Income', value: '₹12 LPA' },
      ],
    },
    {
      id: 'family', title: 'Family Details', icon: '👨‍👩‍👧‍👦',
      fields: [
        { id: 'fathername', label: "Father's Name", value: 'Rajesh Sharma' },
        { id: 'mothername', label: "Mother's Name", value: 'Sunita Sharma' },
      ],
    },
    {
      id: 'contact', title: 'Contact Details', icon: '📞',
      fields: [
        { id: 'phone', label: 'Phone', value: '+91 98765 43210' },
        { id: 'city', label: 'City', value: 'Mumbai' },
      ],
    },
  ],
  style: {
    titleFont: 'Playfair Display', titleSize: 28, titleBold: true, titleItalic: false, titleColor: '#8B4B6B',
    sectionTitleFont: 'Playfair Display', sectionTitleSize: 16, sectionTitleBold: true, sectionTitleItalic: false, sectionTitleColor: '#8B4B6B',
    labelFont: 'Lato', labelSize: 13, labelBold: true, labelItalic: false, labelColor: '#5a3a4a',
    valueFont: 'Lato', valueSize: 13, valueBold: false, valueItalic: false, valueColor: '#333333',
  },
  background: { type: 'solid', color: '#ffffff', gradient: { from: '#fdf2f8', to: '#fff7ed', direction: '135deg' }, image: null },
  profile: { photo: null, shape: 'circle' },
};

export default function TemplateSelection() {
  const navigate = useNavigate();
  const { createBiodata, currentBiodata, setTemplate } = useBiodataStore();
  const [selected, setSelected] = useState(currentBiodata?.template || 'classic');
  const [previewTemplate, setPreviewTemplate] = useState(currentBiodata?.template || 'classic');

  const handleSelect = (id) => {
    setSelected(id);
    setPreviewTemplate(id);
  };

  const handleContinue = () => {
    if (currentBiodata) {
      setTemplate(selected);
    } else {
      createBiodata(selected);
    }
    navigate('/form');
  };

  const sampleBiodata = { ...SAMPLE_BIODATA, template: previewTemplate, id: 'preview' };

  return (
    <div className="min-h-screen bg-[#fdf8f9]">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 glass-card border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#8B4B6B] hover:bg-rose-100 transition-colors">
              ←
            </button>
            <div>
              <h1 className="font-playfair font-black text-xl text-[#2c1a22] tracking-tight">
                Select <span className="text-[#8B4B6B]">Template</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#B5718A] -mt-1">
                Choose your visual style
              </p>
            </div>
          </div>
          
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-rose-100 hover:shadow-rose-200 active:scale-95 text-white"
            style={{ background: 'linear-gradient(135deg, #8B4B6B, #6B3553)' }}>
            Continue with {TEMPLATES.find(t => t.id === selected)?.name} →
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="lg:w-96 flex-shrink-0 animate-slide-in-right">
            <div className="mb-8">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#B5718A] mb-2">Available Designs</h2>
              <p className="text-sm text-[#5a3a4a] font-medium">Click on a template to see a live preview.</p>
            </div>

            <div className="space-y-4">
              {TEMPLATES.map(t => (
                <div
                  key={t.id}
                  onClick={() => handleSelect(t.id)}
                  className="group flex flex-col rounded-3xl text-left transition-all duration-300 cursor-pointer overflow-hidden border-2"
                  style={{
                    background: selected === t.id ? '#fff' : 'transparent',
                    borderColor: selected === t.id ? '#8B4B6B' : 'rgba(139, 75, 107, 0.1)',
                    boxShadow: selected === t.id ? '0 20px 40px -12px rgba(139, 75, 107, 0.15)' : 'none',
                  }}>
                  <div className="flex items-center gap-4 p-5">
                    <div className="text-2xl w-12 h-12 flex items-center justify-center rounded-2xl flex-shrink-0 transition-all duration-300"
                      style={{ 
                        background: selected === t.id ? '#8B4B6B' : '#fff',
                        color: selected === t.id ? '#fff' : '#8B4B6B',
                        boxShadow: selected === t.id ? '0 8px 20px -6px rgba(139, 75, 107, 0.4)' : 'none'
                      }}>
                      <span>{t.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-playfair font-black text-lg transition-colors duration-300" 
                        style={{ color: selected === t.id ? '#8B4B6B' : '#2c1a22' }}>
                        {t.name}
                      </div>
                      <div className="text-xs mt-0.5 leading-relaxed font-medium text-[#B5718A]">
                        {t.description}
                      </div>
                    </div>
                    {selected === t.id && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 animate-in zoom-in duration-300 bg-[#8B4B6B] text-white text-[10px]">
                        ✓
                      </div>
                    )}
                  </div>
                  
                  {selected === t.id && (
                    <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleContinue(); }}
                        className="w-full py-3.5 rounded-2xl font-bold text-white text-[13px] transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-rose-100"
                        style={{ background: 'linear-gradient(135deg, #8B4B6B, #6B3553)' }}>
                        Select & Continue <span className="text-lg">→</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 min-w-0 animate-fade-in-scale">
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#B5718A]">Live Masterpiece Preview</h2>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#8B4B6B]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#D4A853]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#f5e6ed]"></div>
                </div>
              </div>

              <div className="rounded-[40px] overflow-hidden premium-shadow border-8 border-white bg-white">
                <div className="overflow-auto custom-scrollbar" style={{ maxHeight: '75vh' }}>
                  <div className="flex justify-center p-8 bg-[#fdf8f9]">
                    <div className="bg-white shadow-2xl" style={{ width: '794px', minHeight: '1123px' }}>
                      <TemplateRenderer biodata={sampleBiodata} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
