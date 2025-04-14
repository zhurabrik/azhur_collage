// src/data/layouts.ts
export type LayerType = "image" | "text";
export interface BaseLayer {
  type: LayerType;
  left: number;
  top: number;
  zIndex: number;
}

export interface ImageLayer extends BaseLayer {
  type: "image";
  src: string;
  width: number;
}

export interface TextLayer extends BaseLayer {
  type: "text";
  text: string;
  fontSize: number;
  fill?: string;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right" | "justify";
}

export type LayoutLayer = ImageLayer | TextLayer;

export interface LayoutConfig {
  id: string;
  name: string;
  preview: string;
  background: string;
  width: number;
  height: number;
  layers: LayoutLayer[];
}

export const layouts: LayoutConfig[] = [
  {
    id: "vertical",
    name: "Вертикальный макет",
    preview: "/layouts/vertical-preview.png",
    background: "/layouts/vertical-bg.jpg",
    width: 1080,
    height: 1920,
    layers: [
      {
        type: "image",
        src: "/layouts/img1.jpg",
        left: 100,
        top: 200,
        width: 300,
        zIndex: 1
      },
      {
        type: "image",
        src: "/layouts/img2.jpg",
        left: 680,
        top: 200,
        width: 300,
        zIndex: 2
      },
      {
        type: "text",
        text: "Заголовок",
        left: 100,
        top: 600,
        fontSize: 36,
        fill: "#000000",
        fontFamily: "Montserrat",
        textAlign: "left",
        zIndex: 3
      },
      {
        type: "text",
        text: "Описание блока справа",
        left: 680,
        top: 600,
        fontSize: 30,
        fill: "#444",
        fontFamily: "Open Sans",
        textAlign: "center",
        zIndex: 4
      }
    ]
  },
  {
    id: "horizontal",
    name: "Горизонтальный макет",
    preview: "/layouts/horizontal-preview.png",
    background: "/layouts/horizontal-bg.jpg",
    width: 1920,
    height: 1080,
    layers: [
      {
        type: "image",
        src: "/layouts/img1.jpg",
        left: 300,
        top: 100,
        width: 400,
        zIndex: 1
      },
      {
        type: "image",
        src: "/layouts/img2.jpg",
        left: 1100,
        top: 100,
        width: 400,
        zIndex: 2
      },
      {
        type: "text",
        text: "Левый текст",
        left: 300,
        top: 550,
        fontSize: 28,
        fill: "#222",
        fontFamily: "Roboto",
        textAlign: "left",
        zIndex: 3
      },
      {
        type: "text",
        text: "Правый текст",
        left: 1100,
        top: 550,
        fontSize: 28,
        fill: "#222",
        fontFamily: "Roboto",
        textAlign: "right",
        zIndex: 4
      }
    ]
  },
  {
    id: "cinema-poster",
    name: "Постер фильма",
    preview: "/layouts/poster-preview.png",
    background: "/layouts/poster-bg.jpg",
    width: 1080,
    height: 1920,
    layers: [
      {
        type: "image",
        src: "/layouts/poster-main.jpg",
        left: 90,
        top: 300,
        width: 900,
        zIndex: 2
      },
      {
        type: "text",
        text: "НАЗВАНИЕ ФИЛЬМА",
        left: 100,
        top: 100,
        fontSize: 48,
        fill: "#ffffff",
        fontFamily: "Cinzel",
        textAlign: "center",
        zIndex: 1
      },
      {
        type: "text",
        text: "В кино с 25 декабря",
        left: 100,
        top: 1250,
        fontSize: 28,
        fill: "#ccc",
        fontFamily: "Open Sans",
        textAlign: "center",
        zIndex: 3
      }
    ]
  }
];