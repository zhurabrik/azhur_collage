import { create } from "zustand";
import { fabric } from "fabric";

interface EditorStore {
  canvas: fabric.Canvas | null;
  layers: fabric.Object[];
  selectedObject: fabric.Object | null;

  setCanvas: (canvas: fabric.Canvas | null) => void;
  setLayers: (layers: fabric.Object[]) => void;
  setSelectedObject: (object: fabric.Object | null) => void;

  // ✅ Добавляем пропущенные свойства
  skipLockedCheck: boolean;
  setSkipLockedCheck: (val: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  canvas: null,
  layers: [],
  selectedObject: null,

  setCanvas: (canvas) => {
    set({ canvas });

    if (canvas) {
      const updateLayers = () => set({ layers: [...canvas.getObjects()].reverse() });

      canvas.on("object:added", updateLayers);
      canvas.on("object:removed", updateLayers);
      canvas.on("object:modified", updateLayers);

      canvas.on("selection:created", (e) => set({ selectedObject: e.selected?.[0] || null }));
      canvas.on("selection:updated", (e) => set({ selectedObject: e.selected?.[0] || null }));
      canvas.on("selection:cleared", () => set({ selectedObject: null }));
    }
  },

  setLayers: (layers) => set({ layers }),
  setSelectedObject: (object) => set({ selectedObject: object }),

  // ✅ Реализация глобального флага для обхода блокировки
  skipLockedCheck: false,
  setSkipLockedCheck: (val: boolean) => set({ skipLockedCheck: val }),
}));
