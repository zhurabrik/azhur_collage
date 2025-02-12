import { Link } from "react-router-dom";

const LayoutSelection = () => {
  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-3xl mb-6">Выберите макет</h2>
      <div className="flex gap-6">
        <Link to="/editor/vertical">
          <div className="p-4 border rounded cursor-pointer bg-gray-200">
            <p>📏 Вертикальный (1080x1920)</p>
          </div>
        </Link>
        <Link to="/editor/horizontal">
          <div className="p-4 border rounded cursor-pointer bg-gray-200">
            <p>📏 Горизонтальный (1920x1080)</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LayoutSelection;
