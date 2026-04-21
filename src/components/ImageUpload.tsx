import React, { useRef, useState } from "react";
import { Upload, X, Camera } from "lucide-react";
import { motion } from "motion/react";

interface ImageUploadProps {
  onImageAction: (base64: string) => void;
  currentImage?: string;
  label: string;
}

export const ImageUpload = ({ onImageAction, currentImage, label }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(currentImage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageAction(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-[10px] uppercase font-mono tracking-widest text-slate-500 ml-1">{label}</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative w-full h-40 bg-neutral-900 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-amber-500/50 transition-all group overflow-hidden"
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
