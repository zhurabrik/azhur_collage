import { Button } from "@mui/material";
import { ChangeEvent, useRef } from "react";
import { fabric } from "fabric";
import { useEditorStore } from "../store/useEditorStore";

const ImageSettings = ({ selectedObject }: { selectedObject: fabric.Image }) => {
  const { canvas } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReplaceImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        fabric.Image.fromURL(e.target?.result as string, (img) => {
          if (!img) return;
          img.set({ left: selectedObject.left, top: selectedObject.top });
          canvas.remove(selectedObject);
          canvas.add(img);
          canvas.renderAll();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => fileInputRef.current?.click()} fullWidth>
        🔄 Заменить изображение
      </Button>
      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleReplaceImage} />
    </>
  );
};

export default ImageSettings;
