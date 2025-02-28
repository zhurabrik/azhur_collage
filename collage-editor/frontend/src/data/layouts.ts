export interface LayoutConfig {
    id: string;
    name: string;
    width: number;
    height: number;
    background: string;
    images: { src: string; left: number; top: number; width: number }[];
    texts: { text: string; left: number; top: number; fontSize: number }[];
  }
  
  // 🔹 Список доступных макетов
  export const layouts: LayoutConfig[] = [
    {
      id: "vertical",
      name: "Вертикальный макет",
      width: 1080,
      height: 1920,
      background: "/layouts/vertical-bg.jpg",
      images: [
        { src: "/layouts/img1.jpg", left: 390, top: 700, width: 300 },
        { src: "/layouts/img2.jpg", left: 690, top: 700, width: 300 },
      ],
      texts: [
        { text: "Текст 1", left: 390, top: 1050, fontSize: 24 },
        { text: "Текст 2", left: 690, top: 1050, fontSize: 24 },
      ],
    },
    {
      id: "horizontal",
      name: "Горизонтальный макет",
      width: 1920,
      height: 1080,
      background: "/layouts/horizontal-bg.jpg",
      images: [
        { src: "/layouts/img1.jpg", left: 810, top: 390, width: 300 },
        { src: "/layouts/img2.jpg", left: 1110, top: 390, width: 300 },
      ],
      texts: [
        { text: "Текст 1", left: 810, top: 740, fontSize: 24 },
        { text: "Текст 2", left: 1110, top: 740, fontSize: 24 },
      ],
    },
  ];
  