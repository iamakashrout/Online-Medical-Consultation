import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { BASE_URL } from "../helper.js";
import { FaStar } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";


const DoctorTable = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false); // New State
  const { theme, toggleTheme } = useTheme();
  const email = router.query.email;

  useEffect(() => {
    if (router.isReady) {
      fetch(`${BASE_URL}/search/${email}`)
        .then((res) => res.json())
        .then((data) => {
          setDoctor(data);
        });
    }
  }, [router.isReady, email]);

  useEffect(() => {
    const fetchDoctorReviews = async () => {
      try {
        const response = await fetch(`${BASE_URL}/rating/reviews/${email}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");

        const data = await response.json();
        console.log("Doctor Reviews:", data);
        setReviews(data);

        // Check if user has already reviewed
        if (session?.user?.email) {
          const userReview = data.find((rev) => rev.patientEmail === session.user.email);
          if (userReview) setHasReviewed(true);
        }
      } catch (error) {
        console.error("Error fetching doctor reviews:", error);
      }
    };

    if (email) {
      fetchDoctorReviews();
    }
  }, [email, session]);

  const handleReviewSubmit = async () => {
    if (!rating || !review.trim()) return alert("Please provide a rating and review!");

    const newReview = {
      patientEmail: session?.user?.email || "Anonymous",
      rating,
      feedback: review,
    };

    try {
      const response = await fetch(`${BASE_URL}/rating/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorEmail: email,
          patientEmail: session?.user?.email,
          rating,
          feedback: review,
        }),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (!response.ok) throw new Error(data.message || "Failed to submit review");

      setReviews((prev) => [...prev, newReview]); // Update reviews locally
      setRating(0);
      setReview("");
      setSubmitted(true);
      setHasReviewed(true); // Set hasReviewed to true after submission
    } catch (error) {
      console.error("Error submitting review:", error.message);
      alert("Failed to submit review. Check console for details.");
    }
  };

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <img src="/doctor_team.png" className="w-[600px] h-[500px]" />
        <h1 className="text-5xl font-bold text-[#2f0563] mt-6 text-center">
          Join us in bringing healthcare to all, register now!
        </h1>
        <Link
          href={`/doctorCreate/${email}`}
          className="mt-8 bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:scale-105 transition"
        >
          Register Now
        </Link>
      </div>
    );
  }

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
            <li className="text-lg font-medium"><button onClick={() => signOut()}>SIGN OUT</button></li>
          </ul>
          <button className="ml-5 p-2 text-lg rounded-full transition-all hover:scale-110" onClick={toggleTheme}>
            {theme === "dark" ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-10">
        {/* Doctor Profile */}
        <section className={`p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
          <h2 className="text-3xl font-semibold mb-4">Doctor Profile</h2>
          <table className="w-full border-collapse">
            <tbody className="text-lg">
              {Object.entries({
                Name: doctor.name,
                Age: `${doctor.age} years`,
                Email: doctor.email,
                Address: doctor.location,
                Speciality: doctor.domain,
                Qualifications: doctor.qualifications,
                Experience: `${doctor.experience} years`,
              }).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-300">
                  <td className="py-2 font-medium">{key}</td>
                  <td className="py-2">: {value}</td>
                </tr>
              ))}
              <tr>
                <td className="py-2 font-medium">Average Rating</td>
                <td className="py-2 flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <FaStar key={index} color={index < (doctor.averageRating || 0) ? "#FFD700" : "#ccc"} />
                  ))}
                  ({doctor.averageRating || "No ratings yet"})
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Review Submission */}
        <div>
          {hasReviewed ? (
            <div className={`p-4 rounded-md mt-8 text-center ${theme === "dark" ? "bg-green-700" : "bg-green-100"}`}>
              ✅ You have already reviewed the doctor!
            </div>
          ) : (
            <section className={`mt-8 p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
              <h2 className="text-3xl font-semibold mb-4">Rate and Review</h2>
              <div className="flex space-x-2">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    color={index < rating ? "#FFD700" : "#ccc"}
                    onClick={() => setRating(index + 1)}
                    className="cursor-pointer text-2xl"
                  />
                ))}
              </div>
              <textarea
                className={`w-full mt-3 p-2 border rounded ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"}`}
                placeholder="Write your review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              <button
                className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleReviewSubmit}
                disabled={submitted}
              >
                {submitted ? "Submitted" : "Submit Review"}
              </button>
            </section>
          )}
        </div>

        {/* Reviews Table */}
        <section className={`mt-8 p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
          <h2 className="text-3xl font-semibold mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                {reviews.map((review, index) => (
                  <tr key={index} className={`${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                    <td className="border border-gray-300 px-4 py-2">{`⭐`.repeat(review.rating)}</td>
                    <td className="border border-gray-300 px-4 py-2">{review.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No reviews yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default DoctorTable;
