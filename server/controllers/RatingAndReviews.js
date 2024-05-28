
const RatingAndReview = require("../models/RatingAndReviews");
const Service = require("../models/Service");
const Product = require("../models/Product");
const Rent = require("../models/Rent");

exports.createRating = async (req, res) => {
    try {
      const { rating, review, type, itemID } = req.body;
      const userID = req.user.id;
  
      // Check if user has purchased, rented, or taken service
      let item;
      switch (type) {
        case 'service':
          item = await Service.findById(itemID);
          break;
        case 'product':
          item = await Product.findById(itemID);
          break;
        case 'rent':
          item = await Rent.findById(itemID);
          break;
        default:
          return res.status(400).json({ message: 'Invalid type specified' });
      }
  
      if (!item) {
        return res.status(400).json({ message: 'Item not found' });
      }
  
      // Check if user has already reviewed
      const existingReview = await RatingAndReview.findOne({ user: userID, type, ID: itemID });
      if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this item' });
      }
  
      // Create RatingAndReview instance
      const newRatingAndReview = new RatingAndReview({
        user: userID,
        rating,
        review,
        type,
        ID: itemID
      });
  
      // Save RatingAndReview instance
      await newRatingAndReview.save();
  
      // Push review to item schema
      item.ratingAndReviews.push(newRatingAndReview._id);
      await item.save();
  
      return res.status(201).json({ message: 'Rating and review added successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

exports.getAverageRating = async (req, res) => {
    try {
        const { type, ID } = req.body;

        // Check if the type is valid
        const validTypes = ["service", "product", "rent"];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid item type.',
            });
        }

        // Find all ratings and reviews for the item
        const ratingsAndReviews = await RatingAndReview.find({ type, ID });

        // Check if there are any ratings and reviews
        if (ratingsAndReviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No ratings and reviews found for the item.',
            });
        }

        // Calculate the average rating
        let totalRating = 0;
        for (const review of ratingsAndReviews) {
            totalRating += review.rating;
        }
        const averageRating = totalRating / ratingsAndReviews.length;

        return res.status(200).json({
            success: true,
            averageRating,
            message: 'Average rating calculated successfully.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to calculate average rating. Please try again.',
        });
    }
};

// Get all rating and reviews// controllers/ratingAndReview.js
exports.getAllRatingReview = async (req, res) => {
    try {
      const { type } = req.body;
  
      // Check if type is valid
      if (!["service", "product", "rent"].includes(type)) {
        return res.status(400).json({ message: 'Invalid type specified' });
      }
  
      // Get all the rating and reviews for the specified type
      const allReviews = await RatingAndReview.find({ type })
        .sort({ rating: "desc" })
        .populate({
          path: "user",
          select: "firstName lastName email image", // Specify the fields you want to populate from the "Profile" model
        })
        .populate({
          path: "ID",
          select: "name description", // Specify the fields you want to populate from the specified model (Service, Product, Rent)
        })
        .exec();
  
      res.status(200).json({
        success: true,
        data: allReviews,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve the rating and review",
        error: error.message,
      });
    }
  };
