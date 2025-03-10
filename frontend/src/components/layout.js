import { useSelector } from "react-redux";

export default function Layout({ children }) {
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <div className={darkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"}>
      {children}
    </div>
  );
}
