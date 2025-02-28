import { Box, Slider } from "@mui/material";

interface ZoomSliderProps {
  zoom: number;
  setZoom: (value: number) => void;
}

const ZoomSlider = ({ zoom, setZoom }: ZoomSliderProps) => {
  const handleChange = (_: Event, newValue: number | number[]) => {
    setZoom(newValue as number);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 10, // 🔹 Отступ сверху
        left: 10, // 🔹 Отступ слева (фиксируем в верхнем левом углу рабочей области)
        background: "rgba(255, 255, 255, 0.1)", // 🔹 Лёгкий фон, чтобы не сливался с холстом
        padding: "8px",
        borderRadius: "8px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
        zIndex: 10, // 🔹 Ползунок всегда сверху
      }}
    >
      <Slider
        orientation="vertical"
        value={zoom}
        min={0.5}
        max={3}
        step={0.1}
        onChange={handleChange}
        sx={{ height: 150 }}
      />
    </Box>
  );
};

export default ZoomSlider;
