import { Box } from "@mui/material";
import { fabric } from "fabric";
import TextSettings from "./TextSettings";
import ImageSettings from "./ImageSettings";
import DeleteButton from "./DeleteButton";

interface ObjectSettingsProps {
  selectedObject: fabric.Object;
}

const ObjectSettings = ({ selectedObject }: ObjectSettingsProps) => {
  return (
    <Box>
      {/* 🔥 Настройки текста */}
      {selectedObject instanceof fabric.Textbox && <TextSettings selectedObject={selectedObject} />}

      {/* 🎨 Настройки изображения */}
      {selectedObject instanceof fabric.Image && <ImageSettings selectedObject={selectedObject} />}

      {/* 🗑 Кнопка удаления */}
      <DeleteButton selectedObject={selectedObject} />
    </Box>
  );
};

export default ObjectSettings;
