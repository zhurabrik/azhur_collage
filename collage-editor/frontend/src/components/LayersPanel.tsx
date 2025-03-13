import { useEditorStore } from "../store/useEditorStore";
import { Box, Button, List, ListItem, Typography } from "@mui/material";
import { fabric } from "fabric";

const LayersPanel = () => {
  const { canvas } = useEditorStore();

  if (!canvas) return null;

  // Получаем список объектов в порядке слоев (снизу вверх)
  const objects = canvas.getObjects().slice().reverse();

  const moveUp = (obj: fabric.Object) => {
    canvas.bringForward(obj);
    canvas.renderAll();
  };

  const moveDown = (obj: fabric.Object) => {
    canvas.sendBackwards(obj);
    canvas.renderAll();
  };

  return (
    <Box sx={{ p: 2, borderTop: "1px solid #ddd", height: "50%", overflowY: "auto" }}>
      <Typography variant="h6">🔹 Слои</Typography>
      <List>
        {objects.map((obj, index) => (
          <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2">{obj.type || "Элемент"}</Typography>
            <Box>
              <Button size="small" onClick={() => moveUp(obj)}>🔼</Button>
              <Button size="small" onClick={() => moveDown(obj)}>🔽</Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default LayersPanel;
