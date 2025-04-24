import { Box, Typography, Slider, IconButton } from "@mui/material";
import { fabric } from "fabric";
import DeleteButton from "./DeleteButton";
import TextSettings from "./TextSettings";
import ImageSettings from "./ImageSettings";
import { Lock, LockOpen } from "@mui/icons-material";
import { useEditorStore } from "../store/useEditorStore";
import { useEffect, useState } from "react";

const ObjectSettings = ({ selectedObject }: { selectedObject: fabric.Object }) => {
  const { canvas } = useEditorStore();
  const [locked, setLocked] = useState(false);
  const [opacity, setOpacity] = useState(1);

  // 🧠 Подгружаем свойства объекта при его выделении
  useEffect(() => {
    setLocked((selectedObject as any).locked ?? false);
    setOpacity(selectedObject.opacity ?? 1);
  }, [selectedObject]);

  // 🔒 Переключение блокировки
  const toggleLock = () => {
    const newLocked = !locked;
  
    selectedObject.set({
      selectable: !newLocked,
      evented: !newLocked,
      hasControls: !newLocked,
      hasBorders: !newLocked,
      lockMovementX: newLocked,
      lockMovementY: newLocked,
      lockScalingX: newLocked,
      lockScalingY: newLocked,
      lockRotation: newLocked,
    });
  
    (selectedObject as any).locked = newLocked;
    setLocked(newLocked);
  
    if (canvas) {
      // 🔁 Обновим слои, чтобы обновились стрелки и заблокированность
      const newLayers = [...canvas.getObjects()].reverse();
      useEditorStore.getState().setLayers(newLayers); // <-- 🔥 обновляем
      canvas.renderAll();
    }
  };
  

  // 🎛 Прозрачность
  const handleOpacityChange = (_: Event, value: number | number[]) => {
    const val = Array.isArray(value) ? value[0] : value;
    selectedObject.set("opacity", val);
    setOpacity(val);
    canvas?.renderAll();
  };

  if ((selectedObject as any).locked) {
    return (
      <Box textAlign="center">
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          🔒 Объект заблокирован
        </Typography>
        <IconButton onClick={toggleLock}>
          <Lock />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box>
      {/* 🔒 Замок */}
      <Box display="flex" justifyContent="flex-end" mb={1}>
        <IconButton onClick={toggleLock}>
          {locked ? <Lock /> : <LockOpen />}
        </IconButton>
      </Box>

      {/* 🎯 Общая настройка прозрачности */}
      <Typography variant="caption" sx={{ mt: 1 }}>
        Прозрачность
      </Typography>
      <Slider
        min={0}
        max={1}
        step={0.01}
        value={opacity}
        onChange={handleOpacityChange}
      />

      {/* 🧠 Тип-специфические настройки */}
      {selectedObject instanceof fabric.Textbox && (
        <TextSettings selectedObject={selectedObject} />
      )}
      {selectedObject instanceof fabric.Image && (
        <ImageSettings selectedObject={selectedObject} />
      )}

      <DeleteButton selectedObject={selectedObject} />
    </Box>
  );
};

export default ObjectSettings;