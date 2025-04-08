import { Button } from "@mui/material";
import { fabric } from "fabric";
import { useEditorStore } from "../store/useEditorStore";

const DeleteButton = ({ selectedObject }: { selectedObject: fabric.Object }) => {
  const { canvas } = useEditorStore();

  const handleDeleteObject = () => {
    if (!canvas) return;
    canvas.remove(selectedObject);
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleDeleteObject} fullWidth>
      🗑 Удалить
    </Button>
  );
};

export default DeleteButton;
