import React, { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BASE_URL } from "../../helper.js";
import app from "../../firebase.js";
import { useTheme } from "../../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const PatientUpdateForm = () => {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [conditions, setConditions] = useState("");
  const [profilePic, setprofilePic] = useState(null);
  const router = useRouter();
  const email = router.query.email;
  const { theme, toggleTheme } = useTheme();
  
  // Fetch initial patient data from the backend
  useEffect(() => {
    if (email) {
      fetch(`${BASE_URL}/patientProfile/${email}`)
        .then((res) => res.json())
        .then((data) => {
          setName(data.name || "");
          setAge(data.age || "");
          setGender(data.gender || "");
          setHeight(data.height || "");
          setWeight(data.weight || "");
          setBloodGroup(data.bloodGroup || "");
          setConditions(data.conditions || "");
          setprofilePic(data.profilePic || "");
        })
        .catch((error) => console.error("Error fetching patient data:", error));
    }
  }, [email]);

  
  const patientUpdate=async(e)=>{
    const image=profilePic;
    if(!image)
    {
      fetch(`${BASE_URL}/patientUpdate/${email}`, {
              method: "POST",
              body: JSON.stringify({
                email: email,
        name: name || undefined,  
        age: age || undefined,
        gender: gender || undefined,
        height: height || undefined,
        weight: weight||undefined,
        bloodGroup: bloodGroup || undefined,
        conditions: conditions || undefined,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => res.json())
              .then((data) => {
                alert("Updated profile");
                 router.push(`/patientProfile/${email}`);
                console.log(data);
              })
              .catch((error) => {
                console.log(error);
              });
    }
    else{
    const fileName = new Date().getTime() + image.name;
        const storage = getStorage(app);
        const StorageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(StorageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.group(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              fetch(`${BASE_URL}/patientUpdate/${email}`, {
                method: "POST",
                body: JSON.stringify({
                  email: email,
        name: name || undefined,  
        age: age || undefined,
        gender: gender || undefined,
        height: height || undefined,
        weight: weight||undefined,
        bloodGroup: bloodGroup || undefined,
        conditions: conditions || undefined,
                  picturePath: downloadURL,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((res) => res.json())
                .then((data) => {
                  alert("Updated profile");
                   router.push(`/patientProfile/${email}`);
                  console.log(data);
                })
                .catch((error) => {
                  alert("Error");
                  console.log(error);
                });
            });
          }
        );
      }
    };
  
  

  
    return (
      <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
        {/* Navbar */}
        <header className={`w-full px-2 flex justify-between items-center ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} shadow-md py-4`}>
          <div className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700 p-5">
            MediCare
          </div>
          <div className="flex items-center">
            <ul className="flex space-x-8 uppercase p-5 font-sans">
              <li className="text-lg font-medium"><Link href="/">Home</Link></li>
              <li className="text-lg font-medium"><Link href="/ListDoctors">Find Doctors</Link></li>
              <li className="text-lg font-medium"><Link href="/Messenger">CHAT CONSULT</Link></li>
              <li className="text-lg font-medium"><Link href={`/patientProfile/${session?.user?.email}`}>Profile</Link></li>
              <li className="text-lg font-medium"><button onClick={signOut}>SIGN OUT</button></li>
            </ul>
            <button className="ml-5 p-2 text-lg rounded-full transition-all hover:scale-110" onClick={toggleTheme}>
              {theme === "dark" ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
            </button>
          </div>
        </header>
        
        {/* Profile Update Form */}
        <div className="flex items-center justify-center py-24">
          <div className={`px-16 py-10 border-2 w-1/2 ${theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"}`}>
            <div className="font-semibold flex justify-center items-center mb-6 text-lg">
              Edit your Profile
            </div>
  
            {/* Form Fields */}
            {[{ label: "Name", state: name, setter: setName, type: "text" },
              { label: "Age", state: age, setter: setAge, type: "number" },
              { label: "Gender", state: gender, setter: setGender, type: "text" },
              { label: "Height", state: height, setter: setHeight, type: "number" },
              { label: "Weight", state: weight, setter: setWeight, type: "number" },
              { label: "Blood Group", state: bloodGroup, setter: setBloodGroup, type: "text" },
              { label: "Conditions", state: conditions, setter: setConditions, type: "text" }].map((field, index) => (
                <div key={index} className="mb-6">
                  <label className="block mb-2 text-sm font-medium">{field.label}:</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={(e) => field.setter(e.target.value)}
                    value={field.state}
                    type={field.type}
                  />
                </div>
            ))}
  
            {/* Profile Picture Upload */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">Profile Picture:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePic(e.target.files[0])}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            {profilePic && (
              <div className="mb-6 flex justify-center">
                <img src={URL.createObjectURL(profilePic)} alt="Profile Preview" className="w-32 h-32 object-cover rounded-full" />
              </div>
            )}
  
            {/* Buttons */}
            <div className="mb-6 flex items-center justify-center">
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                onClick={(e) => patientUpdate(e)}
              >
                Edit Details
              </button>
            </div>
            <div className="flex items-center justify-center">
              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
                <Link href={`/patientProfile/${session?.user?.email}`}>Show Profile</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default PatientUpdateForm;
  