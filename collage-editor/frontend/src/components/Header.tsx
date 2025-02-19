import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          🎨 CollageMaker
        </Typography>
        <Box>
          <Button component={Link} to="/profile" color="inherit">
            Личный кабинет
          </Button>
          <Button component={Link} to="/login" color="inherit">
            Войти
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
