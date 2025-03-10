import React, { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { BASE_URL } from "../../helper.js";
import { useTheme } from "../../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

// import styles from '../../styles/profile.css'
import { MdDelete } from "react-icons/md";
const PatientProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [patient, setPatient] = useState({});
  const email = router.query.email;
    const { theme, toggleTheme } = useTheme();
  // const curr_user = session.user.email;
  // console.log("this is the session info, ", session);
  useEffect(() => {
    if (router.isReady) {
      fetch(`${BASE_URL}/patientProfile/${email}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setPatient(data);
        });
    }
  }, [router.isReady]);

  const handleDelete = async (prescriptionId) => {
    const curr_user = session.user.email;
    fetch(
      `${BASE_URL}/deletePrescription`,
      {
        method: "PATCH",
        body: JSON.stringify({
          email, 
          prescriptionId,
          curr_user
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.deleted == true) {
          alert("Deleted prescription");
          router.reload(`/patientProfile/${email}`);
        }
        else
          alert("You cannot delete that prescription!");
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleEdit = async (prescriptionId) => {
    router.push(`/editPrescription/${email}/${prescriptionId}`);
  }

  if (patient === null) {
    return (
      <div className="bg-white flex flex-col w-full h-screen">
        <div className="flex justify-center">
          <img
            src="/doctor_team.png"
            style={{ width: "600px", height: "500px" }}
          ></img>
        </div>
        <div className="text-[#2f0563] font-bold justify-center flex text-5xl mt-6">
          Create Profile to track your Medical History!
        </div>
        <div className="flex justify-center mt-8 text-lg hover:scale-[1.01] duration-500">
          <Link
            href={`/patientCreate/${email}`}
            className="bg-red-500 text-white p-4 rounded-md"
          >
            Create Profile{" "}
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="w-full px-2 bg-white flex justify-between items-center">
          <div className="flex justify-between">
            {/* <div className="text-black uppercase p-5 text-lg font-medium mt-2">
              <a href="/">MY PROFILE</a>
            </div> */}
            <div className="text-4xl font-semibold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700 p-5">
              MediCare
            </div>
          </div>
          {session?.user.email === email ? (
            <>
              <div className="flex justify-center">
                <ul className="flex justify-between space-x-8 text-black uppercase p-5 mr-12">
                  <li className="text-lg font-medium ml-10">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="text-lg font-medium ml-10">
                    <Link href="/ListDoctors">Find Doctors</Link>
                  </li>
                  <li className="text-lg font-medium ml-10">
                    <Link href="/Messenger">chat consult</Link>
                  </li>
                  <li className="text-lg font-medium ml-10">
                    <a href={`/patientProfile/${session?.user?.email}`}>
                      Profile
                    </a>
                  </li>
                  <li className="text-lg font-medium ml-10">
                    <button onClick={() => signOut({ callbackUrl: "/" })}>
                      SIGN OUT
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <ul className="flex justify-between space-x-8 text-black uppercase p-5 mr-12">
                  <li className="text-lg font-medium ml-10">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="text-lg font-medium ml-10">
                    <Link href="/Messenger">PATIENTS</Link>
                  </li>
                  <li className="text-lg font-medium ml-10">
                    <button onClick={() => signOut({ callbackUrl: "/" })}>
                      SIGN OUT
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-100 w-full h-full">
          <div className="bg-white rounded-b-3xl h-full left-0 overflow-x-hidden pt-5 absolute top-[80px] w-[250px]">
            <div className="flex justify-center items-center flex-col">
              <div className="">
                <img
                  className=""
                  src={patient.picturePath}
                  style={{ width: "200px", height: "200px" }}
                ></img>
                <div className="text-black text-xl font-bold pt-5 text-center">
                  {patient.name}
                </div>
              </div>
              <div className="text-center mt-4 space-y-4">
                {session?.user?.email == email && (
                  <div className="text-white font-bold py-2 px-4 text-xl border-2 rounded-xl bg-blue-500 hover:bg-blue-700 text-center">
                    <Link href={`/patientUpdate/${patient.email}`}>
                      Edit Details
                    </Link>
                  </div>
                )}
                <div className="text-white font-bold py-2 px-4 text-xl border-2 rounded-xl bg-blue-500 hover:bg-blue-700 text-center">
                  <Link href={`/patientPrescription/${patient.email}`}>
                    Add Prescription
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-[29%] text-2xl px-10 w-[58%]">
            <h2 className="text-black pt-8 text-3xl font-sans mb-2.5 font-bold flex justify-center">
              Profile Details
            </h2>
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-500 pt-5 pb-5 pl-12 mb-5 mt-8">
              <div>
                <table className="border-none text-base h-[370px] w-[80%] text-black">
                  <tbody>
                    <tr>
                      <td className="font-semibold italic">Name</td>
                      <td>:</td>
                      <td>{patient.name}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold italic">Age</td>
                      <td>:</td>
                      <td>{patient.age} years</td>
                    </tr>
                    <tr>
                      <td className="font-semibold italic">Gender</td>
                      <td>:</td>
                      <td>{patient.gender}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold italic">Height</td>
                      <td>:</td>
                      <td>{patient.height}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold italic">Weight</td>
                      <td>:</td>
                      <td>{patient.weight}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold italic">Blood Group</td>
                      <td>:</td>
                      <td>{patient.bloodGroup}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold italic">Conditions</td>
                      <td>:</td>
                      <td>{patient.conditions}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-black text-3xl flex justify-center font-bold mt-8">
              Current Medications
            </div>
            {patient.prescriptions?.length > 0 ? (
              patient.prescriptions?.map((p) => (
                <div key={p._id} className="bg-white rounded-3xl border-red-400 pt-5 pl-12 mb-5 pb-5 mt-8">
                  <div className="relative flex flex-row items-start space-x-20">
                    <div>
                      <img src="/download.jpeg"></img>
                    </div>
                    <table className="border-none text-base h-[270px] w-[80%]] text-black">
                      <tbody>
                        <tr>
                          <td className="font-semibold">Date</td>
                          <td>:</td>
                          <td>{p.date}</td>
                        </tr>
                        <tr>
                          <td className="font-semibold">Medicine</td>
                          <td>:</td>
                          <td>{p.medicine}</td>
                        </tr>
                        <tr>
                          <td className="font-semibold">Duration</td>
                          <td>:</td>
                          <td>{p.duration}</td>
                        </tr>
                        <tr>
                          <td className="font-semibold">Amount</td>
                          <td>:</td>
                          <td>{p.amount}</td>
                        </tr>
                        <tr>
                      <td className="font-semibold">Status</td>
                      <td>:</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-lg font-bold ${
                            p.status === "active"
                              ? "bg-green-500 text-white"
                              : p.status === "pending"
                              ? "bg-yellow-500 text-black"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                      </tbody>
                    </table>
                    <div className="flex space-x-4 absolute top-5 right-5">
                      {p.doctor === session?.user?.email && (
                      <button className="inline-flex items-center px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md"
                        onClick={()=>handleDelete(p._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                      )}
                      {p.doctor === session?.user?.email && (
                      <button className="inline-flex items-center px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md"
                        onClick={() => handleEdit(p._id)}
                      >
                        Edit
                      </button>
                    )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
            <div className="bg-gray-100 flex justify-center p-8 h-[250px]">
              <div className="bg-white rounded-3xl p-6 w-[700px] flex justify-center text-black">
                No prescriptions found
              </div>
            </div>
            )}
          </div>
        </div>
      </>
    );
  }
};

export default PatientProfile;
