import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BASE_URL } from "../../helper.js";
const EditForm = () => {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [domain, setDomain] = useState("");
  const [experience, setExperience] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState("");
  const router = useRouter();

  const updateDoctor = (e) => {
    const email = router.query.email;
    fetch(`${BASE_URL}/update/${email}`, {
      method: "POST",
      body: JSON.stringify({
        name: name,
        age: age,
        domain: domain,
        experience: experience,
        qualifications: qualifications,
        location: location,
        hours: hours,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Updated profile");
        router.push(`/find/${email}`);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-center">
      <div className=" bg-white px-16 py-10 border-2 w-1/2 mt-24 mb-24">
        <div className="font-semibold text-black flex justify-center items-center mb-6 text-lg">Edit your Profile</div>
        <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Name: </label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          name="name"
          style={{ color: "black" }}
        />
        </div>
        <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Age: </label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            setAge(e.target.value);
          }}
          type="number"
          name="age"
          style={{ color: "black" }}
        />
        </div>
        <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Domain: </label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            setDomain(e.target.value);
          }}
          type="text"
          name="domain"
          style={{ color: "black" }}
        />
       </div>
        <label className="block mb-2 text-sm font-medium text-gray-900">Experience: </label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            setExperience(e.target.value);
          }}
          type="number"
          name="experience"
          style={{ color: "black" }}
        />
        <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Qualifications: </label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            setQualifications(e.target.value);
          }}
          type="text"
          name="qualifications"
          style={{ color: "black" }}
        />
        </div>
        <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Location: </label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            setLocation(e.target.value);
          }}
          type="text"
          name="location"
          style={{ color: "black" }}
        />
        </div>
        <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">Available Hours: </label>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => {
            setHours(e.target.value);
          }}
          type="text"
          name="hours"
          style={{ color: "black" }}
        />
        </div>
        <div className="mb-6 flex items-center justify-center">
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          onClick={(e) => {
            updateDoctor(e);
          }}
          // style={{ backgroundColor: "white", color: "black" }}
        >
          Submit
        </button>
        </div>
      <div className="flex items-center justify-center">
      <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
        <Link href={`/find/${session?.user.email}`}>Show Profile</Link>
      </button>
      </div>
      </div>
      </div>
    </div>
  );
};

export default EditForm;
