import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";

const theme = createTheme({
  palette: {
    mode: "dark", // Темная тема с серыми тонами
    primary: { main: "#4A90E2" }, // Голубые элементы
    secondary: { main: "#D32F2F" }, // Красный для опасных действий
    background: {
      default: "#121212", // Фон сайта (тёмно-серый)
      paper: "#1E1E1E", // Фон панелей
    },
    text: {
      primary: "#E0E0E0", // Светло-серый текст
      secondary: "#B0B0B0", // Серый текст
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Сбрасываем стандартные стили */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Отключаем стандартное масштабирование браузера
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && (event.key === "+" || event.key === "-")) {
    event.preventDefault();
  }
});