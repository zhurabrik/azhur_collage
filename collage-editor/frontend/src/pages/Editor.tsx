import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import Canvas from "../components/Canvas";
import ToolbarLeft from "../components/ToolbarLeft";
import ToolbarRight from "../components/ToolbarRight";

const Editor = () => {
  const { id } = useParams();
  const layout = id || "vertical";

  return (
    <Box display="flex" height="100vh">
      <ToolbarLeft />
      <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center" bgcolor="background.default">
        <Canvas key={layout} layout={layout} />
      </Box>
      <ToolbarRight />
    </Box>
  );
};

export default Editor;
