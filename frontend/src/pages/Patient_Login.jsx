import React, { useState } from "react"; 
import { FaMoon, FaSun } from "react-icons/fa";
import Service1 from "../components/Patient_Service1";
import Service2 from "../components/Patient_Service2";
import Service3 from "../components/Patient_Service3";
import HelpChat from "@/components/HelpChat";
import HelpButton from "@/components/HelpButton";
import { signOut, useSession } from "next-auth/react";
import LoginPage from "../components/LoginPage.jsx";
import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";



const Patient_Login = () => {
  const { data: session } = useSession();
 const { theme, toggleTheme } = useTheme();

  const [showPopup, setShowPopup] = useState(false); 


  if (session) {
    return (
      <>
        <div className={`w-full h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-slate-50 text-black"}`}>
          {/* Navbar */}
          <div className={`w-full px-2 flex justify-between items-center ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} shadow-md py-4`}>
            <div className="flex">
              <div className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700 p-5">
                MediCare
              </div>
            </div>

            <div className="flex items-center">
              <ul className="flex space-x-8 uppercase p-5 font-sans">
                <li className="text-lg font-medium">
                  <Link href="/">Home</Link>
                </li>
                <li className="text-lg font-medium">
                  <Link href="/ListDoctors">Find Doctors</Link>
                </li>
                <li className="text-lg font-medium">
                  <Link href="/Messenger">CHAT CONSULT</Link>
                </li>
                <li className="text-lg font-medium">
                  <Link href={`/patientProfile/${session?.user?.email}`}>
                    Profile
                  </Link>
                </li>
                <li className="text-lg font-medium">
                  <button onClick={() => signOut()}>SIGN OUT</button>
                </li>
              </ul>

              {/* Dark Mode Toggle Button */}
              <button
                className="ml-5 p-2 text-lg rounded-full transition-all hover:scale-110"
                onClick={toggleTheme} // ✅ Fixed Here
              >
                {theme === "dark" ? (
                  <FaSun className="text-yellow-400" />
                ) : (
                  <FaMoon className="text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Services */}
          <Service1 />
          <Service2 />
          <Service3 />

          {/* Help Button / Popup (Fixed to Bottom-Right) */}
          <div className="fixed bottom-5 right-5 z-50">
            {showPopup ? (
              <HelpChat onClose={() => setShowPopup(false)} />
            ) : (
              <HelpButton onClick={() => setShowPopup(true)} />
            )}
          </div>
        </div>
      </>
    );
  } else {
    return <LoginPage />;
  }
};

export default Patient_Login;