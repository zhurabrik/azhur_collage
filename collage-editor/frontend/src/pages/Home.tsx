import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl mb-6">Создавайте коллажи легко!</h1>
      <Link to="/layouts">
        <button className="px-6 py-3 bg-blue-500 text-white rounded">Начать</button>
      </Link>
    </div>
  );
};

export default Home;
