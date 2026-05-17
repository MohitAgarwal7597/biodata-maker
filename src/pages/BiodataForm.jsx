import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBiodataStore } from '../store/biodataStore';
import PhotoCropper from '../components/PhotoCropper';
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

function FormField({ field, sectionId, onUpdate, onRename, onDelete }) {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(field.label);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  const handleLabelSave = () => {
    onRename(sectionId, field.id, labelValue);
    setIsEditingLabel(false);
  };

  return (
    <div ref={setNodeRef} style={style} className="group flex flex-col gap-1.5 animate-fade-in-scale relative bg-white p-2 rounded-2xl border border-transparent hover:border-rose-100 transition-colors">
      <div className="flex items-center justify-between px-1">
        {isEditingLabel ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              value={labelValue}
              onChange={e => setLabelValue(e.target.value)}
              className="flex-1 text-[11px] font-black uppercase tracking-wider px-2 py-1 rounded bg-rose-50 border border-rose-200 outline-none"
              autoFocus
              onBlur={handleLabelSave}
              onKeyDown={e => e.key === 'Enter' && handleLabelSave()}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div {...attributes} {...listeners} className="text-gray-300 hover:text-[#D4A853] transition-colors cursor-grab p-1">
                ⠿
              </div>
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-[#B5718A]">
                {field.label}
              </label>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => setIsEditingLabel(true)} className="text-[10px] hover:text-[#8B4B6B]">✏️</button>
              {field.custom && (
                <button onClick={() => onDelete(sectionId, field.id)} className="text-[10px] hover:text-red-500">🗑️</button>
              )}
            </div>
          </div>
        )}
      </div>

      {field.type === 'textarea' ? (
        <textarea
          value={field.value}
          onChange={e => onUpdate(sectionId, field.id, e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all border-2 border-rose-50 bg-white focus:border-[#8B4B6B] focus:ring-4 focus:ring-rose-50 font-medium text-[#2c1a22]"
        />
      ) : (
        <input
          type="text"
          value={field.value}
          onChange={e => onUpdate(sectionId, field.id, e.target.value)}
          className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all border-2 border-rose-50 bg-white focus:border-[#8B4B6B] focus:ring-4 focus:ring-rose-50 font-medium text-[#2c1a22]"
        />
      )}
    </div>
  );
}

export default function BiodataForm() {
  const navigate = useNavigate();
  const { currentBiodata, updateField, addField, renameField, deleteField, updateProfile, saveBiodata, reorderFields } = useBiodataStore();
  const [activeSectionId, setActiveSectionId] = useState('personal');
  const [saved, setSaved] = useState(false);
  const [croppingImage, setCroppingImage] = useState(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const fileInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const activeSection = currentBiodata.sections.find(s => s.id === activeSectionId);
      const oldIdx = activeSection.fields.findIndex(f => f.id === active.id);
      const newIdx = activeSection.fields.findIndex(f => f.id === over.id);
      reorderFields(activeSectionId, arrayMove(activeSection.fields, oldIdx, newIdx));
    }
  };

  useEffect(() => {
    if (!currentBiodata) navigate('/home');
  }, [currentBiodata, navigate]);

  if (!currentBiodata) return null;

  const activeSection = currentBiodata.sections.find(s => s.id === activeSectionId);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCroppingImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveBiodata();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddField = () => {
    if (newFieldName.trim()) {
      addField(activeSectionId, newFieldName.trim());
      setNewFieldName('');
      setIsAddingField(false);
    }
  };

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
            <button onClick={() => navigate('/home')} className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#8B4B6B] hover:bg-rose-100 transition-colors">
              ←
            </button>
            <div>
              <h1 className="font-playfair font-black text-xl text-[#2c1a22] tracking-tight">
                Design <span className="text-[#8B4B6B]">Studio</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#B5718A] -mt-1">
                Editing: {getPersonNameDisplay(currentBiodata)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/templates')} className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#8B4B6B] bg-rose-50 hover:bg-rose-100 transition-all">
              🎨 Layouts
            </button>
            <button onClick={() => navigate('/editor')} className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#8B4B6B] bg-rose-50 hover:bg-rose-100 transition-all">
              🖋 Style
            </button>
            <button onClick={() => navigate('/preview')} className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#8B4B6B] bg-rose-50 hover:bg-rose-100 transition-all">
              👁 Preview
            </button>
            <div className="w-px h-6 bg-rose-100 mx-2"></div>
            <button onClick={handleSave}
              className="px-8 py-2.5 rounded-xl text-xs font-black transition-all shadow-xl shadow-rose-100 active:scale-95 text-white"
              style={{ background: saved ? '#D4A853' : 'linear-gradient(135deg, #8B4B6B, #6B3553)' }}>
              {saved ? '✓ Projects Saved' : '💾 Save Changes'}
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden max-w-[1600px] mx-auto w-full">
        {/* Left Sidebar Navigation */}
        <aside className="w-80 border-r border-rose-100 bg-white/50 backdrop-blur-md p-6 overflow-y-auto custom-scrollbar flex-shrink-0">
          <div className="mb-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B5718A] mb-6">Design Sections</h3>
            <div className="space-y-2">
              {currentBiodata.sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSectionId(section.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                    activeSectionId === section.id 
                    ? 'bg-[#8B4B6B] text-white shadow-xl shadow-rose-200' 
                    : 'hover:bg-rose-50 text-[#5a3a4a]'
                  }`}>
                  <span className={`text-xl transition-transform duration-300 ${activeSectionId === section.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {section.icon}
                  </span>
                  <span className="font-bold text-sm tracking-tight">{section.title}</span>
                  {activeSectionId === section.id && (
                    <div className="ml-auto w-1.5 h-6 bg-white/30 rounded-full animate-in fade-in duration-500"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-rose-50">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B5718A] mb-6">Profile Media</h3>
            <div className="bg-white rounded-[32px] p-6 premium-shadow border border-rose-50">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-square rounded-[24px] overflow-hidden cursor-pointer group bg-rose-50 border-2 border-dashed border-rose-200 hover:border-[#8B4B6B] transition-all"
              >
                {currentBiodata.profile.photo ? (
                  <>
                    <img src={currentBiodata.profile.photo} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-[#8B4B6B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">Change Photo</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40 group-hover:opacity-100">
                    <span className="text-3xl">📸</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Upload Photo</span>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />

              <div className="mt-6 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#B5718A]">Photo Frame</p>
                <div className="flex gap-2">
                  {['circle', 'rounded', 'square'].map(shape => (
                    <button 
                      key={shape}
                      onClick={() => updateProfile({ shape })}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                        currentBiodata.profile.shape === shape 
                        ? 'bg-[#8B4B6B] text-white' 
                        : 'bg-rose-50 text-[#8B4B6B]'
                      }`}>
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Main Form Area */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-white/30 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <header className="mb-12 animate-slide-in-right">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl">{activeSection?.icon}</span>
                <h2 className="text-4xl font-playfair font-black text-[#2c1a22]">{activeSection?.title}</h2>
              </div>
              <p className="text-sm text-[#B5718A] font-medium leading-relaxed max-w-xl">
                Fill in the details for this section. Your masterpiece updates instantly on the right.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 animate-fade-in-scale">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={activeSection?.fields.map(f => f.id) || []} strategy={verticalListSortingStrategy}>
                  {activeSection?.fields.map(field => (
                    <FormField
                      key={field.id}
                      field={field}
                      sectionId={activeSectionId}
                      onUpdate={updateField}
                      onRename={renameField}
                      onDelete={deleteField}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {/* Add Custom Field Card */}
              {isAddingField ? (
                <div className="col-span-full bg-white rounded-3xl p-6 premium-shadow border border-[#8B4B6B]/20 animate-in zoom-in duration-300">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8B4B6B] mb-4">Add Custom Property</h4>
                  <div className="flex gap-3">
                    <input
                      value={newFieldName}
                      onChange={e => setNewFieldName(e.target.value)}
                      placeholder="e.g. Gotra, Hobbies, etc."
                      className="flex-1 px-5 py-3 rounded-2xl bg-rose-50 outline-none text-sm font-medium border-2 border-transparent focus:border-[#8B4B6B] transition-all"
                      autoFocus
                      onKeyDown={e => e.key === 'Enter' && handleAddField()}
                    />
                    <button onClick={handleAddField} className="px-6 py-3 rounded-2xl bg-[#8B4B6B] text-white font-bold text-sm shadow-lg shadow-rose-100">Add</button>
                    <button onClick={() => setIsAddingField(false)} className="px-6 py-3 rounded-2xl bg-gray-100 text-gray-500 font-bold text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingField(true)}
                  className="col-span-full border-2 border-dashed border-rose-200 rounded-2xl py-8 flex flex-col items-center justify-center gap-2 hover:border-[#8B4B6B] hover:bg-white/50 transition-all group"
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform duration-300">✨</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B5718A]">Add Custom Field</span>
                </button>
              )}
            </div>

            <div className="mt-16 mb-20 flex items-center justify-between p-8 rounded-[40px] bg-gradient-to-br from-[#8B4B6B] to-[#6B3553] text-white shadow-2xl shadow-rose-200">
              <div>
                <h4 className="text-xl font-playfair font-bold">Section Complete?</h4>
                <p className="text-xs opacity-70 mt-1">Move to the next section or adjust your style.</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    const idx = currentBiodata.sections.findIndex(s => s.id === activeSectionId);
                    if (idx < currentBiodata.sections.length - 1) {
                      setActiveSectionId(currentBiodata.sections[idx + 1].id);
                      document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      navigate('/editor');
                    }
                  }}
                  className="px-8 py-3 rounded-2xl bg-white text-[#8B4B6B] font-black text-sm shadow-xl transition-all active:scale-95">
                  {currentBiodata.sections.findIndex(s => s.id === activeSectionId) === currentBiodata.sections.length - 1 ? 'Go to Style Studio →' : 'Next Section →'}
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Right Live Preview Area (Desktop Only) */}
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

      {/* Modals */}
      {croppingImage && (
        <PhotoCropper
          image={croppingImage}
          shape={currentBiodata.profile.shape}
          onCropComplete={(croppedImage) => {
            updateProfile({ photo: croppedImage });
            setCroppingImage(null);
          }}
          onCancel={() => setCroppingImage(null)}
        />
      )}
    </div>
  );
}
