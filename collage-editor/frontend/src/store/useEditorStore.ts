import { create } from "zustand";
import { fabric } from "fabric";

interface EditorStore {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  canvas: null,
  setCanvas: (canvas) => {
    console.log("🔄 setCanvas: ", canvas); // ✅ Логируем состояние холста
    set({ canvas });
  },
}));
