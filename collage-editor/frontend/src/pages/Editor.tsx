import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import ToolbarLeft from "../components/ToolbarLeft";
import ToolbarRight from "../components/ToolbarRight";
import Canvas from "../components/Canvas";
import ZoomSlider from "../components/ZoomSlider";
import { layouts } from "../data/layouts";

const Editor = () => {
  const { id } = useParams<{ id: string }>(); // 🔹 Получаем id макета
  const layoutConfig = layouts.find((l) => l.id === id);

  const [zoom, setZoom] = useState(1);

  if (!layoutConfig) {
    return <Box>❌ Ошибка: Макет не найден!</Box>;
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">

      {/* 🔹 Основная рабочая зона */}
      <Box display="flex" flex={1} position="relative">
        {/* 🔹 Передаём `layoutConfig` в ToolbarLeft */}
        <ToolbarLeft layoutConfig={layoutConfig} /> 

        {/* 🔹 Фиксируем размеры рабочей зоны и добавляем скролл только внутри неё */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            display: "flex",
            overflow: "auto", // ✅ Только холст прокручивается, а не вся страница
            height: "calc(100vh - 60px)", // ✅ Высота экрана минус шапка
          }}
        >
          <ZoomSlider zoom={zoom} setZoom={setZoom} />
          <Canvas layoutConfig={layoutConfig} zoom={zoom} />
        </Box>

        <ToolbarRight />
      </Box>
    </Box>
  );
};

export default Editor;
