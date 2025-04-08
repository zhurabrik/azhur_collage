// LayoutSelection.tsx
import { Box, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { layouts } from "../data/layouts";

const LayoutSelection = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h3" mb={4}>Выберите макет</Typography>
      <Box display="flex" gap={4} flexWrap="wrap" justifyContent="center">
        {layouts.map((layout) => (
          <Link key={layout.id} to={`/editor/${layout.id}`} style={{ textDecoration: "none" }}>
            <Paper elevation={3} sx={{ p: 2, width: 220, textAlign: "center", cursor: "pointer" }}>
              <Typography fontWeight="bold">{layout.name}</Typography>
              <img src={layout.preview} alt={layout.name} width="100%" />
            </Paper>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default LayoutSelection;
