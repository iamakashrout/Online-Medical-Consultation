import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../redux/themeSlice";

export default function DarkModeToggle() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <button
      className={`p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
      onClick={() => dispatch(toggleDarkMode())}
    >
      {darkMode ? "🌙" : "☀️"}
    </button>
  );
}
