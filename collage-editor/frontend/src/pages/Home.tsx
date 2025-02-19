import { Button, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="grey.900" color="white">
      <Typography variant="h3" mb={4}>Создавайте стильные коллажи</Typography>
      <Button component={Link} to="/layouts" variant="contained" color="primary" size="large">
        Начать
      </Button>
    </Box>
  );
};

export default Home;
