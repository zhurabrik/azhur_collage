import { useState } from "react";
import { useParams } from "react-router-dom"; // ✅ Добавили импорт useParams
import { Box } from "@mui/material";
import ToolbarLeft from "../components/ToolbarLeft";
import ToolbarRight from "../components/ToolbarRight";
import Canvas from "../components/Canvas";
import ZoomSlider from "../components/ZoomSlider";
import { layouts } from "../data/layouts";

const Editor = () => {
  const { id } = useParams<{ id: string }>(); // ✅ Получаем id макета из URL
  const layoutConfig = layouts.find((l) => l.id === id); // ✅ Ищем макет в списке

  const [zoom, setZoom] = useState(1); // ✅ Оставляем одну декларацию zoom

  if (!layoutConfig) {
    return <Box>❌ Ошибка: Макет не найден!</Box>;
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* 🔹 Шапка */}
      <Box sx={{ height: 60, bgcolor: "grey.800", display: "flex", alignItems: "center", px: 2 }}>
        <Box sx={{ color: "white", fontSize: 20 }}>🎨 {layoutConfig.name}</Box>
      </Box>

      {/* 🔹 Основная рабочая зона */}
      <Box display="flex" flex={1} position="relative">
        <ToolbarLeft />
        <Box sx={{ flex: 1, position: "relative", display: "flex" }}>
          <ZoomSlider zoom={zoom} setZoom={setZoom} />
          <Canvas layoutConfig={layoutConfig} zoom={zoom} />
        </Box>
        <ToolbarRight />
      </Box>
    </Box>
  );
};

export default Editor;
