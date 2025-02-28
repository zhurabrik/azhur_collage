import { Box, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const LayoutSelection = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h3" mb={4}>Выберите макет</Typography>
      <Box display="flex" gap={4}>
        <Link to="/editor/vertical">
          <Paper elevation={3} sx={{ p: 2, width: 200, textAlign: "center", cursor: "pointer" }}>
            <Typography>📏 Вертикальный</Typography>
            <img src="/layouts/vertical-preview.png" alt="Вертикальный макет" width="100%" />
          </Paper>
        </Link>
        <Link to="/editor/horizontal">
          <Paper elevation={3} sx={{ p: 2, width: 200, textAlign: "center", cursor: "pointer" }}>
            <Typography>📏 Горизонтальный</Typography>
            <img src="/layouts/horizontal-preview.png" alt="Горизонтальный макет" width="100%" />
          </Paper>
        </Link>
      </Box>
    </Box>
  );
};

export default LayoutSelection;
