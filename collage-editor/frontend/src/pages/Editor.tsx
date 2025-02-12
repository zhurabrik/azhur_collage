import { useParams } from "react-router-dom";

const Editor = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-3xl mb-6">Редактор коллажа</h2>
      <p>Выбран макет: {id === "vertical" ? "Вертикальный" : "Горизонтальный"}</p>
      <div className="border p-10 bg-gray-300">🎨 Холст будет здесь</div>
    </div>
  );
};

export default Editor;
