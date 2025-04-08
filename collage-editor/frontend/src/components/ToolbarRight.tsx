import { Box, Paper, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useEditorStore } from "../store/useEditorStore";
import { fabric } from "fabric";
import LayersPanel from "./LayersPanel";
import ObjectSettings from "./ObjectSettings";

const ToolbarRight = () => {
  const { canvas } = useEditorStore();
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  

  // 🔹 Следим за выделением объектов
  useEffect(() => {
    if (!canvas) return;

    const handleSelection = () => setSelectedObject(canvas.getActiveObject() || null);
    const clearSelection = () => setSelectedObject(null);

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", clearSelection);

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", clearSelection);
    };
  }, [canvas]);

  return (
    <Paper sx={{ width: 200, p: 2, display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* 🔹 Настройки активного объекта */}
      <Box sx={{ flex: 1, mb: 2 }}>
        {selectedObject ? (
          <ObjectSettings selectedObject={selectedObject} />
        ) : (
          <Typography variant="subtitle1" sx={{ textAlign: "center", color: "gray" }}>
            Выберите объект
          </Typography>
        )}
      </Box>

      {/* 🔹 Список слоев */}
      <Box sx={{ height: "50%", overflow: "auto" }}>
        <LayersPanel />
      </Box>
    </Paper>
  );
};

export default ToolbarRight;
