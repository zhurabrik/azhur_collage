import { useEffect, useState } from "react";
import { Box, MenuItem, Select, ToggleButton, ToggleButtonGroup, SelectChangeEvent } from "@mui/material";
import { FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatAlignJustify } from "@mui/icons-material";
import { fabric } from "fabric";
import { useEditorStore } from "../store/useEditorStore";

// 📌 Доступные шрифты
const fontOptions = [
  // ✅ Стандартные системные шрифты
  "Arial", "Verdana", "Times New Roman", "Georgia", "Courier New", "Trebuchet MS", "Comic Sans MS",

  // 🌍 Популярные Google Fonts
  "Roboto", "Open Sans", "Montserrat", "Lato", "Nunito", "Poppins", "Raleway", "Oswald", "Merriweather",

  // 🖋 Красивые рукописные
  "Pacifico", "Lobster", "Dancing Script", "Caveat", "Sacramento", "Great Vibes", "Shadows Into Light",

  // 🔥 Экзотика
  "Press Start 2P", "Creepster", "Fredericka the Great", "Permanent Marker", "Bungee Shade", "Special Elite",
  "VT323", "Indie Flower", "Zen Dots",

  // 🎨 Креатив
  "Alfa Slab One", "Abril Fatface", "Playfair Display", "Cinzel", "Black Ops One", "Russo One"
];

const systemFonts = [
  "Arial", "Verdana", "Times New Roman", "Georgia", "Courier New", "Trebuchet MS", "Comic Sans MS"
];

const TextSettings = ({ selectedObject }: { selectedObject: fabric.Textbox }) => {
  const { canvas } = useEditorStore();
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right" | "justify">("left");
  const [readyFonts, setReadyFonts] = useState<string[]>([]);
  const [fontColor, setFontColor] = useState("#000000");

  // 🎯 Font preloader (для preview)
  const FontPreloader = ({ fonts }: { fonts: string[] }) => (
    <div style={{ position: "absolute", opacity: 0, pointerEvents: "none", zIndex: -9999 }}>
      {fonts.map((font) => (
        <p key={font} style={{ fontFamily: font, fontSize: "12px" }}>
          Loading preview...
        </p>
      ))}
    </div>
  );

  // ⬇️ preload шрифтов для отображения в списке
  const preloadFonts = async () => {
    const webFonts = fontOptions.filter(font => !systemFonts.includes(font));
    const alreadyLoaded = new Set<string>(readyFonts);

    for (const fontName of webFonts) {
      if (alreadyLoaded.has(fontName)) continue;

      const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}&display=swap`;
      if (!document.querySelector(`link[href="${fontUrl}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = fontUrl;
        document.head.appendChild(link);
      }

      for (let i = 0; i < 8; i++) {
        await new Promise((r) => setTimeout(r, 100));
        if (document.fonts.check(`1em "${fontName}"`)) {
          setReadyFonts(prev => [...new Set([...prev, fontName])]);
          break;
        }
      }
    }
  };

  // 🔄 Один раз грузим все шрифты
  useEffect(() => {
    preloadFonts();
  }, []);

  // 🧠 Подгружаем данные из объекта
  useEffect(() => {
    if (selectedObject instanceof fabric.Textbox) {
      setFontFamily(selectedObject.fontFamily || "Roboto");
      setTextAlign(selectedObject.textAlign as any);
      if (typeof selectedObject.fill === "string") {
        const color = selectedObject.fill;
        const isShortHex = /^#([0-9a-fA-F]{3})$/.test(color);
      
        const fullHex = isShortHex
          ? "#" + color.slice(1).split("").map(c => c + c).join("")
          : color;
      
        setFontColor(fullHex);
      }
    }
  }, [selectedObject]);

  // 🚀 Выбор шрифта
  const loadFont = async (fontName: string) => {
    if (systemFonts.includes(fontName)) return;

    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}&display=swap`;
    if (!document.querySelector(`link[href="${fontUrl}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = fontUrl;
      document.head.appendChild(link);
    }

    for (let i = 0; i < 8; i++) {
      await new Promise((r) => setTimeout(r, 100));
      if (document.fonts.check(`1em "${fontName}"`)) {
        setReadyFonts(prev => [...new Set([...prev, fontName])]);
        break;
      }
    }
  };

  const changeFont = async (event: SelectChangeEvent<string>) => {
    if (!(selectedObject instanceof fabric.Textbox) || !canvas) return;

    const newFont = event.target.value;
    await loadFont(newFont);

    selectedObject.set("fontFamily", newFont);
    canvas.requestRenderAll();
    setFontFamily(newFont);
  };

  const changeAlignment = (_: React.MouseEvent<HTMLElement>, alignment: string) => {
    if (!alignment) return;
    selectedObject.set("textAlign", alignment);
    setTextAlign(alignment as any);
    canvas?.renderAll();
  };

  // 🎨 Изменение цвета
  const changeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    if (!(selectedObject instanceof fabric.Textbox) || !canvas) return;

    selectedObject.set("fill", color);
    canvas.requestRenderAll();
    setFontColor(color);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Select value={fontFamily} onChange={changeFont} fullWidth size="small">
        {fontOptions.map((font) => (
          <MenuItem
            key={font}
            value={font}
            sx={{
              fontFamily: readyFonts.includes(font) || systemFonts.includes(font) ? font : "inherit",
              fontStyle: readyFonts.includes(font) || systemFonts.includes(font) ? "normal" : "italic",
              opacity: readyFonts.includes(font) || systemFonts.includes(font) ? 1 : 0.6
            }}
          >
            {font}
          </MenuItem>
        ))}
      </Select>

      <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}>
        <label htmlFor="font-color-picker" style={{ marginRight: 8 }}>🎨 Цвет:</label>
        <input
          type="color"
          id="font-color-picker"
          value={fontColor}
          onChange={changeColor}
          style={{ width: 36, height: 36, border: "none", background: "none", cursor: "pointer" }}
        />
      </Box>

      <ToggleButtonGroup value={textAlign} exclusive onChange={changeAlignment} size="small" fullWidth>
        <ToggleButton value="left"><FormatAlignLeft /></ToggleButton>
        <ToggleButton value="center"><FormatAlignCenter /></ToggleButton>
        <ToggleButton value="right"><FormatAlignRight /></ToggleButton>
        <ToggleButton value="justify"><FormatAlignJustify /></ToggleButton>
      </ToggleButtonGroup>

      <FontPreloader fonts={fontOptions} />
    </Box>
  );
};

export default TextSettings;
