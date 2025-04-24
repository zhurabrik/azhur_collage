import { useState } from "react";
import { List, ListItem, Typography, Paper, IconButton, TextField, Box } from "@mui/material";
import { useEditorStore } from "../store/useEditorStore";
import { fabric } from "fabric";
import { ArrowUpward, ArrowDownward, Edit } from "@mui/icons-material";

const LayersPanel = () => {
  const { canvas, layers, setLayers, selectedObject, setSelectedObject, setSkipLockedCheck } = useEditorStore();
  const [renamingLayer, setRenamingLayer] = useState<fabric.Object | null>(null);
  const [newName, setNewName] = useState("");

  // 🔹 Функция получения названия слоя
  const getLayerName = (layer: fabric.Object) => {
    if (layer instanceof fabric.Image && layer.name) return layer.name;
    if (layer instanceof fabric.Textbox) return layer.text?.length ? layer.text.slice(0, 20) + "..." : "Текст";
    return "Объект";
  };

  // 🔹 Выделение объекта через панель слоев (разрешаем выбор заблокированного)
  const selectLayer = (layer: fabric.Object) => {
    if (!canvas) return;
  
    useEditorStore.getState().setSkipLockedCheck(true); // ✅ разрешаем выбор даже если слой заблокирован
  
    // 🔁 Обновляем через requestAnimationFrame, чтобы дать времени сработать skipLockedCheck
    requestAnimationFrame(() => {
      canvas.setActiveObject(layer);
      useEditorStore.getState().setSelectedObject(layer);
      canvas.renderAll();
    });
  };
  

  const moveLayer = (index: number, direction: "up" | "down") => {
    if (!canvas) return;
    const newLayers = [...layers];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= layers.length) return;

    [newLayers[index], newLayers[targetIndex]] = [newLayers[targetIndex], newLayers[index]];

    newLayers.forEach((obj, i) => {
      canvas.moveTo(obj, layers.length - 1 - i);
    });

    setLayers(newLayers);
    canvas.renderAll();
  };

  const startRenaming = (layer: fabric.Object) => {
    if (!(layer instanceof fabric.Image)) return;
    setRenamingLayer(layer);
    setNewName(layer.name || "");
  };

  const confirmRename = () => {
    if (renamingLayer && newName.trim()) {
      renamingLayer.set("name", newName.trim());
      setRenamingLayer(null);
      setLayers([...layers]);
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
        {layers.map((layer, index) => {
          const isLocked = (layer as any).locked;

          return (
            <ListItem
              key={index}
              onClick={() => selectLayer(layer)}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                bgcolor: layer === selectedObject ? "#292929" : "transparent",
                "&:hover": { bgcolor: "#121212" },
                px: 0.5,
                py: 0.3,
                opacity: isLocked ? 0.6 : 1,
              }}
            >
              {/* Кнопки вверх/вниз */}
              <Box sx={{ display: "flex", gap: 0.3, mr: 1 }}>
                <IconButton
                  size="small"
                  sx={{ p: 0.2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLayer(index, "up");
                  }}
                  disabled={index === 0 || isLocked}
                >
                  <ArrowUpward fontSize="inherit" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ p: 0.2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLayer(index, "down");
                  }}
                  disabled={index === layers.length - 1 || isLocked}
                >
                  <ArrowDownward fontSize="inherit" />
                </IconButton>
              </Box>

              {/* Название слоя */}
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

              {/* Переименование только если слой не заблокирован */}
              {!isLocked && layer instanceof fabric.Image && (
                <IconButton
                  size="small"
                  sx={{ p: 0.2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    startRenaming(layer);
                  }}
                >
                  <Edit fontSize="inherit" />
                </IconButton>
              )}
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default LayersPanel;