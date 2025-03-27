import { Box, Button, Paper, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatAlignJustify } from "@mui/icons-material";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { fabric } from "fabric";
import LayersPanel from "./LayersPanel";

const ToolbarRight = () => {
  const { canvas } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right" | "justify">("left");

  // 🔹 Следим за выделением объектов на холсте
  useEffect(() => {
    if (!canvas) return;

    const handleSelection = () => {
      const activeObject = canvas.getActiveObject();
      setSelectedObject(activeObject || null);
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => setSelectedObject(null));

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", () => setSelectedObject(null));
    };
  }, [canvas]);

  // 🔹 Функция замены изображения
  const handleReplaceImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (!(selectedObject instanceof fabric.Image) || !canvas) return;
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) return;
        fabric.Image.fromURL(e.target.result as string, (img) => {
          if (!img || !img.width || !img.height) return;

          // 🔹 Устанавливаем новое изображение на место старого
          img.set({
            left: selectedObject.left,
            top: selectedObject.top,
            scaleX: selectedObject.scaleX,
            scaleY: selectedObject.scaleY,
            angle: selectedObject.angle,
          });

          canvas.remove(selectedObject);
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          setSelectedObject(img);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Функция удаления объекта
  const handleDeleteObject = () => {
    if (selectedObject && canvas) {
      canvas.remove(selectedObject);
      setSelectedObject(null);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  // 🔄 Обновляем состояние при изменении выделенного объекта
  useEffect(() => {
    if (selectedObject instanceof fabric.Textbox) {
      setTextAlign(selectedObject.textAlign as "left" | "center" | "right" | "justify");
    }
  }, [selectedObject]);

  // 🔹 Функция изменения выравнивания
  const changeTextAlignment = (_: React.MouseEvent<HTMLElement>, alignment: "left" | "center" | "right" | "justify") => {
    if (!alignment || !(selectedObject instanceof fabric.Textbox)) return;

    selectedObject.set("textAlign", alignment);
    setTextAlign(alignment); // Обновляем состояние
    canvas?.renderAll(); // Перерисовываем холст
  };

  return (
    <Paper
      sx={{
        width: 200,
        bgcolor: "background.paper",
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* 🔹 Верхняя часть — динамическая */}
      <Box sx={{ flex: 1, mb: 2 }}>
        {selectedObject ? (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              🔧 Настройки
            </Typography>

            {/* Если выделено изображение */}
            {selectedObject instanceof fabric.Image && (
              <>
                <Button variant="contained" color="primary" onClick={() => fileInputRef.current?.click()} fullWidth>
                  🔄 Заменить изображение
                </Button>
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleReplaceImage} />
              </>
            )}

            {/* 🔥 Отображаем кнопки только если выделен текстовый блок */}
            {selectedObject instanceof fabric.Textbox && (
              <Box sx={{ mb: 2 }}>
                <ToggleButtonGroup
                  value={textAlign}
                  exclusive
                  onChange={changeTextAlignment}
                  size="small"
                  fullWidth
                >
                  <ToggleButton value="left">
                    <FormatAlignLeft />
                  </ToggleButton>
                  <ToggleButton value="center">
                    <FormatAlignCenter />
                  </ToggleButton>
                  <ToggleButton value="right">
                    <FormatAlignRight />
                  </ToggleButton>
                  <ToggleButton value="justify">
                    <FormatAlignJustify />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            )}

            {/* Кнопка удаления для любого объекта */}
            <Button variant="contained" color="secondary" onClick={handleDeleteObject} fullWidth>
              🗑 Удалить
            </Button>
          </Box>
        ) : (
          <Typography variant="subtitle1" sx={{ textAlign: "center", color: "gray" }}>
            Выберите объект
          </Typography>
        )}
      </Box>

      {/* 🔹 Фиксированная высота списка слоев */}
      <Box sx={{ height: "50%", overflow: "auto" }}>
        <LayersPanel />
      </Box>
    </Paper>
  );
};

export default ToolbarRight;
