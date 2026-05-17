import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_SECTIONS = [
  {
    id: 'personal',
    title: 'Personal Information',
    icon: '👤',
    fields: [
      { id: 'name', label: 'Full Name', value: '', type: 'text' },
      { id: 'dob', label: 'Date of Birth', value: '', type: 'text' },
      { id: 'timeofbirth', label: 'Time of Birth', value: '', type: 'text' },
      { id: 'placeofbirth', label: 'Place of Birth', value: '', type: 'text' },
      { id: 'height', label: 'Height', value: '', type: 'text' },
      { id: 'weight', label: 'Weight', value: '', type: 'text' },
      { id: 'complexion', label: 'Complexion', value: '', type: 'text' },
      { id: 'bloodgroup', label: 'Blood Group', value: '', type: 'text' },
      { id: 'religion', label: 'Religion', value: '', type: 'text' },
      { id: 'caste', label: 'Caste', value: '', type: 'text' },
      { id: 'subcaste', label: 'Sub-caste', value: '', type: 'text' },
      { id: 'rashigotra', label: 'Rashi / Gotra', value: '', type: 'text' },
      { id: 'manglik', label: 'Manglik', value: '', type: 'text' },
      { id: 'language', label: 'Mother Tongue', value: '', type: 'text' },
    ],
  },
  {
    id: 'education',
    title: 'Education & Career',
    icon: '🎓',
    fields: [
      { id: 'qualification', label: 'Qualification', value: '', type: 'text' },
      { id: 'college', label: 'College / University', value: '', type: 'text' },
      { id: 'occupation', label: 'Occupation', value: '', type: 'text' },
      { id: 'employer', label: 'Employer / Company', value: '', type: 'text' },
      { id: 'income', label: 'Annual Income', value: '', type: 'text' },
      { id: 'worklocation', label: 'Work Location', value: '', type: 'text' },
    ],
  },
  {
    id: 'family',
    title: 'Family Details',
    icon: '👨‍👩‍👧‍👦',
    fields: [
      { id: 'fathername', label: "Father's Name", value: '', type: 'text' },
      { id: 'fatheroccupation', label: "Father's Occupation", value: '', type: 'text' },
      { id: 'mothername', label: "Mother's Name", value: '', type: 'text' },
      { id: 'motheroccupation', label: "Mother's Occupation", value: '', type: 'text' },
      { id: 'siblings', label: 'Siblings', value: '', type: 'text' },
      { id: 'familytype', label: 'Family Type', value: '', type: 'text' },
      { id: 'familystatus', label: 'Family Status', value: '', type: 'text' },
      { id: 'nativeplace', label: 'Native Place', value: '', type: 'text' },
    ],
  },
  {
    id: 'maternal_family',
    title: 'Maternal Family Details',
    icon: '🏘️',
    fields: [
      { id: 'maternal_fathername', label: "Maternal Uncle's Name", value: '', type: 'text' },
      { id: 'maternal_fatheroccupation', label: "Maternal Uncle's Occupation", value: '', type: 'text' },
      { id: 'maternal_mothername', label: "Maternal Aunt's Name", value: '', type: 'text' },
      { id: 'maternal_motheroccupation', label: "Maternal Aunt's Occupation", value: '', type: 'text' },
      { id: 'maternal_siblings', label: 'Siblings', value: '', type: 'text' },
      { id: 'maternal_familytype', label: 'Family Type', value: '', type: 'text' },
      { id: 'maternal_familystatus', label: 'Family Status', value: '', type: 'text' },
      { id: 'maternal_nativeplace', label: 'Native Place', value: '', type: 'text' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Details',
    icon: '📞',
    fields: [
      { id: 'address', label: 'Address', value: '', type: 'text' },
      { id: 'city', label: 'City', value: '', type: 'text' },
      { id: 'state', label: 'State', value: '', type: 'text' },
      { id: 'pincode', label: 'PIN Code', value: '', type: 'text' },
      { id: 'phone', label: 'Phone Number', value: '', type: 'text' },
      { id: 'email', label: 'Email', value: '', type: 'text' },
    ],
  },
  {
    id: 'additional',
    title: 'Additional Details',
    icon: '✨',
    fields: [
      { id: 'hobbies', label: 'Hobbies & Interests', value: '', type: 'text' },
      { id: 'languages', label: 'Languages Known', value: '', type: 'text' },
      { id: 'expectations', label: 'Partner Expectations', value: '', type: 'textarea' },
      { id: 'aboutme', label: 'About Me', value: '', type: 'textarea' },
    ],
  },
];

const DEFAULT_STYLE = {
  titleFont: 'Playfair Display',
  titleSize: 28,
  titleBold: true,
  titleItalic: false,
  titleColor: '#8B4B6B',

  sectionTitleFont: 'Playfair Display',
  sectionTitleSize: 16,
  sectionTitleBold: true,
  sectionTitleItalic: false,
  sectionTitleColor: '#8B4B6B',

  labelFont: 'Lato',
  labelSize: 13,
  labelBold: true,
  labelItalic: false,
  labelColor: '#5a3a4a',

  valueFont: 'Lato',
  valueSize: 13,
  valueBold: false,
  valueItalic: false,
  valueColor: '#333333',
};

const DEFAULT_BACKGROUND = {
  type: 'solid', // 'solid' | 'gradient' | 'image'
  color: '#ffffff',
  gradient: { from: '#fdf2f8', to: '#fff7ed', direction: '135deg' },
  image: null,
  opacity: 1,
};

const DEFAULT_PROFILE = {
  photo: null,
  shape: 'circle', // 'circle' | 'rounded' | 'square'
};

const DEFAULT_DECORATIONS = {
  headerEnabled: true,
  headerText: '✦ Shree Ganeshaya Namah ✦',
  footerEnabled: false,
  footerText: '✦ Thank You ✦',
  godSymbolEnabled: false,
  godSymbolUrl: null,
  godSymbolPosition: 'top-center', // 'top-left', 'top-center', 'top-right'
  godSymbolSize: 60,
};

const ensureAllSections = (sections) => {
  if (!sections) return JSON.parse(JSON.stringify(DEFAULT_SECTIONS));
  const existingIds = new Set(sections.map(s => s.id));
  const merged = [...sections];

  DEFAULT_SECTIONS.forEach(defaultSec => {
    if (!existingIds.has(defaultSec.id)) {
      // Find optimal insertion point (after 'family' or at the end)
      const familyIdx = merged.findIndex(s => s.id === 'family');
      if (familyIdx !== -1) {
        merged.splice(familyIdx + 1, 0, JSON.parse(JSON.stringify(defaultSec)));
      } else {
        merged.push(JSON.parse(JSON.stringify(defaultSec)));
      }
    }
  });
  return merged;
};

const createNewBiodata = (template = 'classic') => ({
  id: Date.now().toString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  template,
  sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)),
  style: { ...DEFAULT_STYLE },
  background: { ...DEFAULT_BACKGROUND },
  profile: { ...DEFAULT_PROFILE },
  decorations: { ...DEFAULT_DECORATIONS },
});

export const useBiodataStore = create(
  persist(
    (set, get) => ({
      savedBiodatas: [],
      currentBiodata: null,

      // Create new biodata
      createBiodata: (template) => {
        const newBiodata = createNewBiodata(template);
        set({ currentBiodata: newBiodata });
        return newBiodata.id;
      },

      // Load biodata for editing
      loadBiodata: (id) => {
        const { savedBiodatas } = get();
        const biodata = savedBiodatas.find(b => b.id === id);
        if (biodata) {
          const repaired = {
            ...JSON.parse(JSON.stringify(biodata)),
            sections: ensureAllSections(biodata.sections),
            decorations: biodata.decorations || { ...DEFAULT_DECORATIONS },
          };
          set({ currentBiodata: repaired });
        }
      },

      // Save current biodata
      saveBiodata: () => {
        const { currentBiodata, savedBiodatas } = get();
        if (!currentBiodata) return;
        const updated = { ...currentBiodata, updatedAt: new Date().toISOString() };
        const idx = savedBiodatas.findIndex(b => b.id === updated.id);
        let newList;
        if (idx >= 0) {
          newList = [...savedBiodatas];
          newList[idx] = updated;
        } else {
          newList = [updated, ...savedBiodatas];
        }
        set({ savedBiodatas: newList, currentBiodata: updated });
      },

      // Delete a biodata
      deleteBiodata: (id) => {
        set(s => ({ savedBiodatas: s.savedBiodatas.filter(b => b.id !== id) }));
      },

      // Duplicate a biodata
      duplicateBiodata: (id) => {
        const { savedBiodatas } = get();
        const src = savedBiodatas.find(b => b.id === id);
        if (!src) return;
        const copy = {
          ...JSON.parse(JSON.stringify(src)),
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set(s => ({ savedBiodatas: [copy, ...s.savedBiodatas] }));
      },

      // Update field value
      updateField: (sectionId, fieldId, value) => {
        set(s => {
          if (!s.currentBiodata) return s;
          const sections = s.currentBiodata.sections.map(sec =>
            sec.id === sectionId
              ? { ...sec, fields: sec.fields.map(f => f.id === fieldId ? { ...f, value } : f) }
              : sec
          );
          return { currentBiodata: { ...s.currentBiodata, sections } };
        });
      },

      // Add custom field
      addField: (sectionId, label) => {
        set(s => {
          if (!s.currentBiodata) return s;
          const newField = { id: `custom_${Date.now()}`, label, value: '', type: 'text', custom: true };
          const sections = s.currentBiodata.sections.map(sec =>
            sec.id === sectionId ? { ...sec, fields: [...sec.fields, newField] } : sec
          );
          return { currentBiodata: { ...s.currentBiodata, sections } };
        });
      },

      // Rename field
      renameField: (sectionId, fieldId, label) => {
        set(s => {
          if (!s.currentBiodata) return s;
          const sections = s.currentBiodata.sections.map(sec =>
            sec.id === sectionId
              ? { ...sec, fields: sec.fields.map(f => f.id === fieldId ? { ...f, label } : f) }
              : sec
          );
          return { currentBiodata: { ...s.currentBiodata, sections } };
        });
      },

      // Delete field
      deleteField: (sectionId, fieldId) => {
        set(s => {
          if (!s.currentBiodata) return s;
          const sections = s.currentBiodata.sections.map(sec =>
            sec.id === sectionId
              ? { ...sec, fields: sec.fields.filter(f => f.id !== fieldId) }
              : sec
          );
          return { currentBiodata: { ...s.currentBiodata, sections } };
        });
      },

      // Reorder fields
      reorderFields: (sectionId, newFieldsOrder) => {
        set(s => {
          if (!s.currentBiodata) return s;
          const sections = s.currentBiodata.sections.map(sec =>
            sec.id === sectionId
              ? { ...sec, fields: newFieldsOrder }
              : sec
          );
          return { currentBiodata: { ...s.currentBiodata, sections } };
        });
      },

      // Reorder sections
      reorderSections: (newOrder) => {
        set(s => {
          if (!s.currentBiodata) return s;
          return { currentBiodata: { ...s.currentBiodata, sections: newOrder } };
        });
      },

      // Update style
      updateStyle: (styleKey, value) => {
        set(s => {
          if (!s.currentBiodata) return s;
          return { currentBiodata: { ...s.currentBiodata, style: { ...s.currentBiodata.style, [styleKey]: value } } };
        });
      },

      // Update background
      updateBackground: (bgUpdate) => {
        set(s => {
          if (!s.currentBiodata) return s;
          return { currentBiodata: { ...s.currentBiodata, background: { ...s.currentBiodata.background, ...bgUpdate } } };
        });
      },

      // Update profile
      updateProfile: (profileUpdate) => {
        set(s => {
          if (!s.currentBiodata) return s;
          return { currentBiodata: { ...s.currentBiodata, profile: { ...s.currentBiodata.profile, ...profileUpdate } } };
        });
      },

      // Update decorations
      updateDecorations: (decorationUpdate) => {
        set(s => {
          if (!s.currentBiodata) return s;
          return { currentBiodata: { ...s.currentBiodata, decorations: { ...s.currentBiodata.decorations, ...decorationUpdate } } };
        });
      },

      // Set template
      setTemplate: (template) => {
        set(s => {
          if (!s.currentBiodata) return s;
          return {
            currentBiodata: {
              ...s.currentBiodata,
              template,
              sections: ensureAllSections(s.currentBiodata.sections)
            }
          };
        });
      },

      // Clear current
      clearCurrent: () => set({ currentBiodata: null }),
    }),
    {
      name: 'marriage-biodata-storage',
      partialize: (state) => ({ savedBiodatas: state.savedBiodatas }),
    }
  )
);
