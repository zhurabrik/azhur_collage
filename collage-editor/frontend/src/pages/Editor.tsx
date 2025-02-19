import { Box, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import Canvas from "../components/Canvas";
import ToolbarLeft from "../components/ToolbarLeft";

const Editor = () => {
  const { id } = useParams();
  const layout = id || "vertical";

  return (
    <Box display="flex" height="100vh">
      <ToolbarLeft />
      <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center" bgcolor="background.default">
        <Canvas key={layout} layout={layout} />
      </Box>
      <Paper elevation={3} sx={{ width: 200, bgcolor: "background.paper", p: 2 }}>
        <h3>Настройки элемента</h3>
      </Paper>
    </Box>
  );
};

export default Editor;
