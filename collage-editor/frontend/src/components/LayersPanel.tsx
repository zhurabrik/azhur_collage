import { useState } from "react";
import { List, ListItem, Typography, Paper, IconButton, TextField, Box } from "@mui/material";
import { useEditorStore } from "../store/useEditorStore";
import { fabric } from "fabric";
import { ArrowUpward, ArrowDownward, Edit } from "@mui/icons-material";

const LayersPanel = () => {
  const { canvas, layers, setLayers, selectedObject } = useEditorStore();
  const [renamingLayer, setRenamingLayer] = useState<fabric.Object | null>(null);
  const [newName, setNewName] = useState("");

  // 🔹 Функция получения названия слоя
  const getLayerName = (layer: fabric.Object) => {
    if (layer instanceof fabric.Image && layer.name) {
      return layer.name; // ✅ Отображаем кастомное имя, если есть
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
    [newLayers[index], newLayers[targetIndex]] = [newLayers[targetIndex], newLayers[index]];

    // 🔥 Обновляем стек в Fabric.js
    newLayers.forEach((obj, i) => {
      canvas.moveTo(obj, layers.length - 1 - i);
    });

    setLayers(newLayers);
    canvas.renderAll();
  };

  // 🔹 Начать переименование слоя
  const startRenaming = (layer: fabric.Object) => {
    if (!(layer instanceof fabric.Image)) return;
    setRenamingLayer(layer);
    setNewName(layer.name || ""); // ✅ Используем текущее имя
  };

  // 🔹 Подтвердить новое имя
  const confirmRename = () => {
    if (renamingLayer && newName.trim()) {
      renamingLayer.set("name", newName.trim());
      setRenamingLayer(null);
      setLayers([...layers]); // ✅ Обновляем список слоев
      canvas?.renderAll();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        p: 1,
        bgcolor: "background.paper",
        overflowY: "auto",
        maxHeight: "100%",
      }}
    >
      <Typography variant="subtitle2" sx={{ textAlign: "center", fontSize: "0.8rem", mb: 1 }}>
        📂 Слои
      </Typography>
      <List sx={{ maxHeight: "100%", overflow: "auto", p: 0 }}>
        {layers.map((layer, index) => (
          <ListItem
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              bgcolor: layer === selectedObject ? "#292929" : "transparent",
              "&:hover": { bgcolor: "#121212" },
              px: 0.5,
              py: 0.3,
            }}
          >
            {/* 🔹 Кнопки перемещения слоев (влево) */}
            <Box sx={{ display: "flex", gap: 0.3, mr: 1 }}>
              <IconButton
                size="small"
                sx={{ p: 0.2 }}
                onClick={() => moveLayer(index, "up")}
                disabled={index === 0}
              >
                <ArrowUpward fontSize="inherit" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ p: 0.2 }}
                onClick={() => moveLayer(index, "down")}
                disabled={index === layers.length - 1}
              >
                <ArrowDownward fontSize="inherit" />
              </IconButton>
            </Box>

            {/* 🔹 Название слоя */}
            {renamingLayer === layer ? (
              <TextField
                variant="standard"
                size="small"
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={confirmRename}
                onKeyDown={(e) => e.key === "Enter" && confirmRename()}
                sx={{ flex: 1, fontSize: "0.75rem", mr: 1 }}
              />
            ) : (
              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: "0.75rem",
                }}
                title={getLayerName(layer)}
              >
                {getLayerName(layer)}
              </Typography>
            )}

            {/* 🔹 Кнопка переименования (справа) */}
            {layer instanceof fabric.Image && (
              <IconButton
                size="small"
                sx={{ p: 0.2 }}
                onClick={() => startRenaming(layer)}
              >
                <Edit fontSize="inherit" />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default LayersPanel;
