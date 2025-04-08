// src/data/layouts.ts
export interface LayoutImage {
  src: string;
  left: number;
  top: number;
  width: number;
}

export interface LayoutText {
  text: string;
  left: number;
  top: number;
  fontSize: number;
  fill?: string;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right" | "justify";
}

export interface LayoutConfig {
  id: string;
  name: string;
  preview: string;
  background: string;
  width: number;
  height: number;
  images: LayoutImage[];
  texts: LayoutText[];
}

export const layouts: LayoutConfig[] = [
  {
    id: "vertical",
    name: "Вертикальный макет",
    preview: "/layouts/vertical-preview.png",
    background: "/layouts/vertical-bg.jpg",
    width: 1080,
    height: 1920,
    images: [
      { src: "/layouts/img1.jpg", left: 100, top: 200, width: 300 },
      { src: "/layouts/img2.jpg", left: 680, top: 200, width: 300 }
    ],
    texts: [
      {
        text: "Заголовок",
        left: 100,
        top: 600,
        fontSize: 36,
        fill: "#000000",
        fontFamily: "Montserrat",
        textAlign: "left"
      },
      {
        text: "Описание блока справа",
        left: 680,
        top: 600,
        fontSize: 30,
        fill: "#444",
        fontFamily: "Open Sans",
        textAlign: "center"
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
    images: [
      { src: "/layouts/img1.jpg", left: 300, top: 100, width: 400 },
      { src: "/layouts/img2.jpg", left: 1100, top: 100, width: 400 }
    ],
    texts: [
      {
        text: "Левый текст",
        left: 300,
        top: 550,
        fontSize: 28,
        fill: "#222",
        fontFamily: "Roboto",
        textAlign: "left"
      },
      {
        text: "Правый текст",
        left: 1100,
        top: 550,
        fontSize: 28,
        fill: "#222",
        fontFamily: "Roboto",
        textAlign: "right"
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
    images: [
      { src: "/layouts/poster-main.jpg", left: 90, top: 300, width: 900 }
    ],
    texts: [
      {
        text: "НАЗВАНИЕ ФИЛЬМА",
        left: 100,
        top: 100,
        fontSize: 48,
        fill: "#ffffff",
        fontFamily: "Cinzel",
        textAlign: "center"
      },
      {
        text: "В кино с 25 декабря",
        left: 100,
        top: 1250,
        fontSize: 28,
        fill: "#ccc",
        fontFamily: "Open Sans",
        textAlign: "center"
      }
    ]
  }
];
