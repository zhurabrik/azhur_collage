import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import ToolbarLeft from "../components/ToolbarLeft";
import ToolbarRight from "../components/ToolbarRight";
import Canvas from "../components/Canvas";
import ZoomSlider from "../components/ZoomSlider";
import { layouts } from "../data/layouts";

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const layoutConfig = layouts.find((l) => l.id === id);
  const [zoom, setZoom] = useState(1);

  if (!layoutConfig) {
    return <Box p={4}>❌ Макет не найден</Box>;
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box display="flex" flex={1} minHeight={0}>
        <ToolbarLeft />

        <Box
          sx={{
            position: "absolute",
            left: 90,
            top: "15%",
            transform: "translateY(-50%)",
            zIndex: 10,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "8px",
            p: 1,
          }}
        >
          <ZoomSlider zoom={zoom} setZoom={setZoom} />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            overflow: "auto",
            minHeight: 0, // ✅ это важно
          }}
        >
          <Canvas layoutConfig={layoutConfig} zoom={zoom} />
        </Box>

        <ToolbarRight />
      </Box>
    </Box>
  );
};


export default Editor;
