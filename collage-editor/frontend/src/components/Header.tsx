import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

const Header = () => {
  const isVisible = useAppStore((s) => s.isHeaderVisible);

  return (
    <Box
      sx={{
        height: isVisible ? 64 : 0,
        overflow: "hidden",
        transition: "height 0.3s ease",
      }}
    >
      <AppBar
        position="static"
        color="default"
        elevation={2}
        sx={{
          height: 64,
          display: isVisible ? "flex" : "none",
          justifyContent: "center",
        }}
      >
        <Toolbar>
          {/* 🔗 Кликабельный логотип — переход на главную */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              fontWeight: 600,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            🎨 CollageMaker
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button component={Link} to="/profile" color="inherit">
              Личный кабинет
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
