import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Core capture function - renders the element at full resolution.
 * The element must be visible in the DOM (not display:none).
 * We use a hidden off-screen container for clean capture.
 */
const captureElement = async (elementId, bgColor = '#ffffff') => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element #${elementId} not found`);

  const canvas = await html2canvas(element, {
    scale: 2,                  // 2× for crisp output
    useCORS: true,
    allowTaint: true,
    backgroundColor: bgColor,
    logging: false,
    // Fix: explicitly set dimensions so transform:scale wrappers don't confuse it
    width: element.scrollWidth,
    height: element.scrollHeight,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  return canvas;
};

export const exportAsPDF = async (elementId, filename = 'biodata') => {
  try {
    const canvas = await captureElement(elementId, '#ffffff');
    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // A4 dimensions: 210 × 297 mm — fill completely, no margins
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    pdf.save(`${filename}.pdf`);
  } catch (err) {
    console.error('PDF export error:', err);
    throw err;
  }
};

const downloadCanvas = (canvas, filename, mimeType, quality) => {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        resolve();
      },
      mimeType,
      quality
    );
  });
};

export const exportAsPNG = async (elementId, filename = 'biodata') => {
  try {
    const canvas = await captureElement(elementId, '#ffffff');
    await downloadCanvas(canvas, `${filename}.png`, 'image/png', 1.0);
  } catch (err) {
    console.error('PNG export error:', err);
    throw err;
  }
};

export const exportAsJPG = async (elementId, filename = 'biodata') => {
  try {
    const canvas = await captureElement(elementId, '#ffffff');
    await downloadCanvas(canvas, `${filename}.jpg`, 'image/jpeg', 0.95);
  } catch (err) {
    console.error('JPG export error:', err);
    throw err;
  }
};

export const getPersonName = (biodata) => {
  if (!biodata) return 'Untitled';
  const personalSection = biodata.sections?.find(s => s.id === 'personal');
  const nameField = personalSection?.fields?.find(f => f.id === 'name');
  return nameField?.value || 'Untitled Biodata';
};

export const formatDate = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};
