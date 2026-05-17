import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImgAsBase64 } from '../utils/cropImage';

export default function PhotoCropper({ image, onCropComplete, onCancel, shape = 'circle' }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropAreaComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImgAsBase64(image, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between">
          <h3 className="font-playfair font-bold text-xl text-[#2c1a22]">Adjust Photo</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-2xl transition-colors">×</button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 min-h-[300px] md:min-h-[400px] bg-[#f8f0f4]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape={shape === 'circle' ? 'round' : 'rect'}
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropAreaComplete}
            onZoomChange={onZoomChange}
            style={{
              containerStyle: { background: '#f8f0f4' },
              cropAreaStyle: { border: '2px solid #D4A853' }
            }}
          />
        </div>

        {/* Controls */}
        <div className="p-6 bg-white">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#5a3a4a] uppercase tracking-wider">Zoom</span>
              <span className="text-xs text-[#8B4B6B]">{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => onZoomChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-[#8B4B6B]"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-all border-2 border-rose-100 text-[#8B4B6B] hover:bg-rose-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3.5 rounded-2xl font-semibold text-sm text-white transition-all shadow-lg hover:shadow-xl active:scale-95"
              style={{ background: 'linear-gradient(135deg, #8B4B6B, #6B3553)' }}
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
