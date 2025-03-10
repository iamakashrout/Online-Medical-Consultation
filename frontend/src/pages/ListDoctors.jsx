import React from "react";
import ListOFDoctors from "../components/ListOfDoctors";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const Doctor_Profile = () => {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <div className={`w-full h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-[#F0EFFF] text-black"}`}>
        <div className={`w-full px-2 flex justify-between items-center ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
          <div className="flex justify-between">
            <div className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700 p-5">
              MediCare
            </div>
          </div>
          <div className="flex items-center">
            <ul className="flex space-x-8 uppercase p-5 mr-12 font-sans">
              <li className="text-lg font-medium">
                <Link href="/">Home</Link>
              </li>
              <li className="text-lg font-medium">
                <Link href="/ListDoctors">Find Doctors</Link>
              </li>
              <li className="text-lg font-medium">
                <Link href="/Messenger">Chat Consult</Link>
              </li>
              <li className="text-lg font-medium">
                <Link href={`/patientProfile/${session?.user?.email}`}>Profile</Link>
              </li>
              <li className="text-lg font-medium">
                <button onClick={() => signOut({ callbackUrl: "/" })}>SIGN OUT</button>
              </li>
            </ul>
            {/* Dark Mode Toggle Button */}
            <button className="ml-5 p-2 text-lg rounded-full transition-all hover:scale-110" onClick={toggleTheme}>
              {theme === "dark" ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-gray-600" />
              )}
            </button>
          </div>
        </div>
        <div className="mt-12 flex justify-center items-center text-3xl font-bold uppercase">
          Doctors Across the World
        </div>
        <div className="bg-white mt-6">
          <ListOFDoctors />
        </div>
      </div>
    </>
  );
};

export default Doctor_Profile;