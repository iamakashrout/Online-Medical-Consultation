// const express = require("express");
// const Doctor = require("../models/doctorModel"); // Import Doctor model
// const Review = require("../models/reviewModel"); // Import Review model

// const router = express.Router();

// // Function to update average rating in Doctor model
// const updateAverageRating = async (doctorEmail) => {
//   try {
//     const result = await Review.aggregate([
//       { $match: { doctorEmail } },
//       { $group: { _id: null, avgRating: { $avg: "$rating" } } }
//     ]);

//     const avgRating = result.length ? result[0].avgRating.toFixed(1) : 0;

//     await Doctor.findOneAndUpdate({ email: doctorEmail }, { averageRating: avgRating });

//     return avgRating;
//   } catch (error) {
//     console.error("Error updating average rating:", error);
//     return null;
//   }
// };

// // Function to convert rating into stars
// const getStars = (rating) => "⭐".repeat(rating);

// // Add a review
// router.post("/rating", async (req, res) => {
//   const { doctorEmail, patientEmail, rating, feedback } = req.body;

//   try {
//     if (!doctorEmail || !patientEmail || !rating) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     if (rating < 1 || rating > 5) {
//       return res.status(400).json({ message: "Rating must be between 1 and 5" });
//     }

//     // Check if the patient has already reviewed this doctor
//     const existingReview = await Review.findOne({ doctorEmail, patientEmail });
//     if (existingReview) {
//       return res.status(400).json({ message: "You have already reviewed this doctor." });
//     }

//     // Save new review
//     const newReview = new Review({ doctorEmail, patientEmail, rating, feedback });
//     const savedReview = await newReview.save();

//     // Update and retrieve new average rating
//     const updatedAvgRating = await updateAverageRating(doctorEmail);

//     res.status(200).json({
//       ...savedReview._doc,
//       stars: getStars(rating),
//       updatedAvgRating
//     });
//   } catch (err) {
//     console.error("Error adding review:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// module.exports = router;
const express = require("express");
const Doctor = require("../models/doctorModel"); // Import Doctor model
const Review = require("../models/reviewModel"); // Import Review model

const router = express.Router();

// Function to update average rating in Doctor model
const updateAverageRating = async (doctorEmail) => {
  try {
    console.log("Updating average rating for:", doctorEmail);

    const result = await Review.aggregate([
      { $match: { doctorEmail: doctorEmail.toLowerCase() } }, // Ensure consistency
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    console.log("Aggregation result:", result);

    const avgRating = result.length ? parseFloat(result[0].avgRating.toFixed(1)) : 0;

    const doctor = await Doctor.findOneAndUpdate(
      { email: doctorEmail.toLowerCase() },
      { averageRating: avgRating },
      { new: true } // Ensures the updated document is returned
    );

    if (!doctor) {
      console.error("Doctor not found:", doctorEmail);
      return null;
    }

    console.log("Updated doctor average rating:", doctor.averageRating);
    return avgRating;
  } catch (error) {
    console.error("Error updating average rating:", error);
    return null;
  }
};

// Function to convert rating into stars
const getStars = (rating) => "⭐".repeat(Math.round(rating));

// Add a review
router.post("/rating", async (req, res) => {
  try {
    let { doctorEmail, patientEmail, rating, feedback } = req.body;

    console.log("Received review data:", req.body); // Debugging log

    if (!doctorEmail || !patientEmail || rating === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    doctorEmail = doctorEmail.toLowerCase();
    patientEmail = patientEmail.toLowerCase();
    rating = Number(rating);

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
    }

    // Check if the patient has already reviewed this doctor
    const existingReview = await Review.findOne({ doctorEmail, patientEmail });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this doctor." });
    }

    // Save new review
    const newReview = new Review({ doctorEmail, patientEmail, rating, feedback });
    const savedReview = await newReview.save();

    console.log("Saved review:", savedReview); // Debugging log

    // Update and retrieve new average rating
    const updatedAvgRating = await updateAverageRating(doctorEmail);

    res.status(200).json({
      ...savedReview._doc,
      stars: getStars(rating),
      updatedAvgRating
    });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/reviews/:doctorEmail", async (req, res) => {
    try {
      const  doctorEmail  = req.params.doctorEmail;
      
  
      if (!doctorEmail) {
        return res.status(400).json({ message: "Doctor email is required" });
      }
  
      console.log("Fetching reviews for doctor:", doctorEmail);
  
      const reviews = await Review.find({ doctorEmail: doctorEmail.toLowerCase() });
  
      res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });

  router.get("/reviews/:doctorEmail/:userEmail", async (req, res) => {
    try {
        const { doctorEmail, userEmail } = req.params;

        if (!doctorEmail || !userEmail) {
            return res.status(400).json({ message: "Doctor email and user email are required" });
        }

        console.log("Checking review for doctor:", doctorEmail, "by user:", userEmail);

        const existingReview = await Review.findOne({
            doctorEmail: doctorEmail.toLowerCase(),
            userEmail: userEmail.toLowerCase(),
        });

        if (existingReview) {
            return res.status(200).json({ reviewed: true });
        } else {
            return res.status(200).json({ reviewed: false });
        }
    } catch (error) {
        console.error("Error checking review:", error);
        res.status(500).json({ message: "Error checking review" });
    }
});

module.exports = router;
