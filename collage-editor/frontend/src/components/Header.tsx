import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link to="/" className="text-2xl font-bold">🎨 CollageMaker</Link>
      <nav>
        <Link to="/profile" className="mx-2">Личный кабинет</Link>
        <Link to="/login" className="mx-2">Войти</Link>
      </nav>
    </header>
  );
};

export default Header;
