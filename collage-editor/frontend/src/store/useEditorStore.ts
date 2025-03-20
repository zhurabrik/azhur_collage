import { create } from "zustand";
import { fabric } from "fabric";

interface EditorStore {
  canvas: fabric.Canvas | null;
  layers: fabric.Object[];
  selectedObject: fabric.Object | null; // ✅ Выделенный объект
  setCanvas: (canvas: fabric.Canvas | null) => void;
  setLayers: (layers: fabric.Object[]) => void;
  setSelectedObject: (object: fabric.Object | null) => void; // ✅ Функция обновления выделенного объекта
}

export const useEditorStore = create<EditorStore>((set) => ({
  canvas: null,
  layers: [],
  selectedObject: null, // ✅ По умолчанию ничего не выделено
  setCanvas: (canvas) => {
    console.log("🔄 setCanvas: ", canvas);
    set({ canvas });

    if (canvas) {
      // ✅ Автообновление списка слоев при изменениях на холсте
      const updateLayers = () => set({ layers: [...canvas.getObjects()].reverse() });

      canvas.on("object:added", updateLayers);
      canvas.on("object:removed", updateLayers);
      canvas.on("object:modified", updateLayers);

      // ✅ Автообновление выделенного объекта
      canvas.on("selection:created", (e) => set({ selectedObject: e.selected?.[0] || null }));
      canvas.on("selection:updated", (e) => set({ selectedObject: e.selected?.[0] || null }));
      canvas.on("selection:cleared", () => set({ selectedObject: null }));
    }
  },
  setLayers: (layers) => {
    console.log("📂 Обновление слоев: ", layers);
    set({ layers });
  },
  setSelectedObject: (object) => {
    console.log("🔍 Выделен объект: ", object);
    set({ selectedObject: object });
  },
}));
