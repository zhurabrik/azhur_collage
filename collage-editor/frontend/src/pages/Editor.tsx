import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import ToolbarLeft from "../components/ToolbarLeft";
import ToolbarRight from "../components/ToolbarRight";
import Canvas from "../components/Canvas";
import ZoomSlider from "../components/ZoomSlider";
import { layouts } from "../data/layouts";

const Editor = () => {
  const { id } = useParams<{ id: string }>(); // Получаем ID макета
  const layoutConfig = layouts.find((l) => l.id === id);

  const [zoom, setZoom] = useState(1);

  if (!layoutConfig) {
    return <Box>❌ Ошибка: Макет не найден!</Box>;
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">

      {/* 🔹 Основная рабочая зона */}
      <Box display="flex" flex={1} position="relative">
        {/* 🔹 Левая панель инструментов */}
        <ToolbarLeft />

        {/* 🔹 Ползунок фиксирован на экране */}
        <Box
          sx={{
            position: "fixed", // 📌 Делаем его фиксированным
            left: 90, // Отступ от левой панели инструментов
            top: "17%", // По центру экрана
            transform: "translateY(-50%)",
            zIndex: 10, // Всегда сверху
            bgcolor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "8px",
            p: 1,
          }}
        >
          <ZoomSlider zoom={zoom} setZoom={setZoom} />
        </Box>

        {/* 🔹 Рабочая область */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            display: "flex",
            overflow: "auto", // ✅ Только холст прокручивается
            height: "100vh", // ✅ Высота экрана без скролла страницы
          }}
        >
          <Canvas layoutConfig={layoutConfig} zoom={zoom} />
        </Box>

        {/* 🔹 Правая панель инструментов */}
        <ToolbarRight />
      </Box>
    </Box>
  );
};

export default Editor;
