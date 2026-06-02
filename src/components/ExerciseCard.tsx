import React from "react";
import { motion } from "motion/react";
import { Heart, Rotate3D, Play, Info, Plus, Edit2, Trash2, Video } from "lucide-react";
import { LibraryExercise } from "../types";

interface ExerciseCardProps {
  exercise: LibraryExercise;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onPreview3D: (ex: LibraryExercise) => void;
  onPreviewVideo: (url: string) => void;
  onShowInfo: (ex: LibraryExercise) => void;
  onSelect: ((ex: LibraryExercise) => void) | undefined;
  isTrainerOrAdmin: boolean;
  onEdit: (ex: LibraryExercise) => void;
  onDelete: (id: string) => void;
}

const isEmbeddable = (url: string) => {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'));
};

const ExerciseCardComponent = ({
  exercise,
  index,
  isFavorite,
  onToggleFavorite,
  onPreview3D,
  onPreviewVideo,
  onShowInfo,
  onSelect,
  isTrainerOrAdmin,
  onEdit,
  onDelete,
}: ExerciseCardProps) => {

  return (
    <motion.div
      key={exercise.id}
      layout
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        opacity: { duration: 0.2, delay: (index % 12) * 0.04 },
        y: { type: "spring", stiffness: 350, damping: 20, delay: (index % 12) * 0.04 },
        layout: { type: "spring", stiffness: 350, damping: 25 },
        scale: { duration: 0.15 },
      }}
      className="bg-neutral-900/50 border border-white/5 rounded-2xl p-5 group hover:border-amber-500 transition-all flex flex-col gap-4 shadow-xl"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center flex-wrap gap-2">
            <h5 className="font-bold text-white uppercase text-sm tracking-tight">{exercise.name}</h5>
            <div className="flex gap-1.5 ml-auto md:ml-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(exercise.id);
                }}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  isFavorite
                    ? "bg-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white"
                    : "bg-white/5 text-slate-400 hover:bg-white hover:text-black"
                }`}
                title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
              >
                <Heart size={12} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview3D(exercise);
                }}
                className="p-1.5 bg-gold/10 text-gold rounded-lg hover:bg-gold hover:text-black transition-all group/3d cursor-pointer"
                title="Holograma 3D"
              >
                <Rotate3D size={12} className="group-hover/3d:animate-slow-spin" />
              </button>

              {exercise.videoUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewVideo(exercise.videoUrl);
                  }}
                  className="p-1.5 bg-amber-500/20 text-amber-500 rounded-lg hover:bg-amber-500 hover:text-black transition-all group/play cursor-pointer"
                  title="Ver vídeo de demonstração"
                >
                  <Play size={12} fill="currentColor" className="group-hover/play:scale-110 transition-transform" />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowInfo(exercise);
                }}
                className="p-1.5 bg-white/5 text-slate-400 rounded-lg hover:bg-white hover:text-black transition-all cursor-pointer"
                title="Ver dicas técnicas"
              >
                <Info size={12} />
              </button>
            </div>
            
            <span className={`text-[8px] font-black italic px-2 py-0.5 rounded-full ${
              exercise.difficulty === "Iniciante" ? "bg-green-500/10 text-green-500" :
              exercise.difficulty === "Intermediário" ? "bg-amber-500/10 text-amber-500" :
              "bg-rose-500/10 text-rose-500"
            }`}>
              {exercise.difficulty === "Avançado" ? "PRO ELITE" : exercise.difficulty}
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            {exercise.muscleGroup} • {exercise.equipment}
          </p>
        </div>

        {onSelect && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(exercise);
            }}
            className="p-3 bg-amber-500 text-black rounded-xl hover:bg-white transition-colors shadow-lg shrink-0 cursor-pointer"
            title="Adicionar ao Treino"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {exercise.videoUrl && !isEmbeddable(exercise.videoUrl) && (
        <div className="w-full h-44 bg-black/60 rounded-xl overflow-hidden relative border border-white/5 flex items-center justify-center">
          {exercise.videoUrl.toLowerCase().includes('.gif') || exercise.gifUrl ? (
            <img
              src={exercise.videoUrl}
              alt={exercise.name}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <video
              src={exercise.videoUrl}
              className="w-full h-full object-cover"
              preload="metadata"
              muted
              loop
              playsInline
              autoPlay
            />
          )}
          <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-[8px] font-mono font-bold text-amber-500 px-2 py-0.5 rounded uppercase tracking-wider">
            Animação Ativa
          </div>
        </div>
      )}

      <p
        className="text-xs text-slate-400 line-clamp-2 italic cursor-pointer hover:text-white transition-colors"
        onClick={() => onShowInfo(exercise)}
      >
        "{exercise.description || "Sem descrição disponível."}"
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 font-mono">
        <div className="flex items-center gap-2">
          <Video size={12} className="text-slate-600" />
          <span className="text-[9px] uppercase tracking-widest text-slate-500">Tutorial Disponível</span>
        </div>
        
        {isTrainerOrAdmin && (
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(exercise);
              }}
              className="text-white/40 hover:text-amber-500 transition-colors p-1"
              title="Editar"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(exercise.id);
              }}
              className="text-red-500/40 hover:text-red-500 transition-colors p-1"
              title="Excluir"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Use React.memo with a custom comparison or default comparison to dramatically cut down paint/re-render load!
export const ExerciseCard = React.memo(ExerciseCardComponent);
