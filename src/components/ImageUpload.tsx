import React, { useRef, useState } from "react";
import { Upload, X, Camera } from "lucide-react";
import { motion } from "motion/react";

interface ImageUploadProps {
  onImageAction: (base64: string) => void;
  currentImage?: string;
  label: string;
  className?: string;
}

export const ImageUpload = ({ onImageAction, currentImage, label, className }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(currentImage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setPreview(dataUrl);
          onImageAction(dataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">{label}</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full ${className || 'h-40'} bg-neutral-900 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 transition-all group overflow-hidden`}
      >
        {preview ? (
          <>
            <img src={preview} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt="Preview" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Camera className="text-white" size={32} />
               <span className="text-white font-black italic ml-2 uppercase">Alterar Foto</span>
            </div>
          </>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto text-slate-600 mb-2" size={32} />
            <p className="text-[10px] text-slate-500 uppercase tracking-widest px-6">Arraste ou clique para enviar</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*" 
        />
      </div>
    </div>
  );
};
