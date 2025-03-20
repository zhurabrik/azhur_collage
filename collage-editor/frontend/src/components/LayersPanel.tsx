import { Box, List, ListItem, Typography, Paper, IconButton } from "@mui/material";
import { useEditorStore } from "../store/useEditorStore";
import { fabric } from "fabric";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

const LayersPanel = () => {
  const { canvas, layers, setLayers, selectedObject } = useEditorStore();

  // 🔹 Функция получения названия слоя
  const getLayerName = (layer: fabric.Object) => {
    if (layer instanceof fabric.Image && layer.getSrc()) {
      return layer.getSrc().split("/").pop() || "Изображение"; // ✅ Имя файла
    }
    if (layer instanceof fabric.Textbox) {
      return layer.text?.length ? layer.text.slice(0, 20) + "..." : "Текст"; // ✅ Обрезка текста
    }
    return "Объект";
  };

  // 🔹 Функция перемещения слоя
  const moveLayer = (index: number, direction: "up" | "down") => {
    if (!canvas) return;
    const newLayers = [...layers];
  
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= layers.length) return; // 🔥 Проверяем границы
  
    // Меняем местами элементы в массиве
    const movedObject = newLayers[index];
    newLayers[index] = newLayers[targetIndex];
    newLayers[targetIndex] = movedObject;
  
    // 🔥 Обновляем позиции объектов в Fabric.js
    newLayers.forEach((obj, i) => {
      canvas.moveTo(obj, layers.length - 1 - i); // 📌 В Fabric.js верхний слой — с наибольшим индексом
    });
  
    setLayers(newLayers);
    canvas.renderAll();
  };
  

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%", // ✅ Автоматическая ширина
        p: 2,
        bgcolor: "background.paper",
        overflowY: "auto", // ✅ Скролл при переполнении
        maxHeight: "100%", // ✅ Не выходит за границы
      }}
    >
      <Typography variant="h6">📂 Слои</Typography>
      <List sx={{ maxHeight: "100%", overflow: "auto" }}>
        {layers.map((layer, index) => (
          <ListItem
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              bgcolor: layer === selectedObject ? "#d0f0ff" : "transparent", // ✅ Подсветка активного слоя
              "&:hover": { bgcolor: "#f0f0f0" },
            }}
          >
            {getLayerName(layer)}

            <Box>
              <IconButton size="small" onClick={() => moveLayer(index, "up")} disabled={index === 0}>
                <ArrowUpward fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => moveLayer(index, "down")} disabled={index === layers.length - 1}>
                <ArrowDownward fontSize="small" />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default LayersPanel;
