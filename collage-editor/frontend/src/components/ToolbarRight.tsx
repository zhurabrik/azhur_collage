import { Box, Button, Paper } from "@mui/material";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { fabric } from "fabric";

const ToolbarRight = () => {
  const { canvas } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<fabric.Image | null>(null);

  // 🔹 Следим за выделением объектов на холсте
  useEffect(() => {
    if (!canvas) return;

    const handleSelection = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject instanceof fabric.Image) {
        setSelectedImage(activeObject);
      } else {
        setSelectedImage(null);
      }
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => setSelectedImage(null));

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", () => setSelectedImage(null));
    };
  }, [canvas]);

  // 🔹 Функция замены изображения
  const handleReplaceImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (!selectedImage || !canvas) return;
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) return;
        fabric.Image.fromURL(e.target.result as string, (img) => {
          if (!img || !img.width || !img.height) return;

          // 🔹 Устанавливаем новое изображение на место старого
          img.set({
            left: selectedImage.left,
            top: selectedImage.top,
            scaleX: selectedImage.scaleX,
            scaleY: selectedImage.scaleY,
            angle: selectedImage.angle,
          });

          canvas.remove(selectedImage);
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          setSelectedImage(img);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Функция удаления изображения
  const handleDeleteImage = () => {
    if (selectedImage && canvas) {
      canvas.remove(selectedImage);
      setSelectedImage(null);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  return (
    selectedImage && (
      <Paper elevation={3} sx={{ width: 200, bgcolor: "background.paper", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>📌 Настройки изображения</Box>
        {/* 🔹 Кнопка замены изображения */}
        <Button variant="contained" color="primary" onClick={() => fileInputRef.current?.click()}>
          🔄 Заменить
        </Button>
        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleReplaceImage} />

        {/* 🔹 Кнопка удаления изображения */}
        <Button variant="contained" color="secondary" onClick={handleDeleteImage}>
          🗑 Удалить
        </Button>
      </Paper>
    )
  );
};

export default ToolbarRight;
