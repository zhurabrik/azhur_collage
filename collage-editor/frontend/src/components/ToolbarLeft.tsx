import { Box, Button, Paper } from "@mui/material";

const ToolbarLeft = () => {
  return (
    <Paper elevation={3} sx={{ width: 80, bgcolor: "background.paper", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Button variant="contained" color="primary">↩️</Button> {/* Отменить */}
      <Button variant="contained" color="primary">↪️</Button> {/* Вернуть */}
      <Button variant="contained" color="primary">🎨</Button> {/* Заменить фон */}
      <Button variant="contained" color="primary">🖼</Button> {/* Добавить изображение */}
      <Button variant="contained" color="primary">🔤</Button> {/* Добавить текст */}
      <Button variant="contained" color="primary">💾</Button> {/* Сохранить */}
      <Button variant="contained" color="primary">📤</Button> {/* Экспорт */}
    </Paper>
  );
};

export default ToolbarLeft;
