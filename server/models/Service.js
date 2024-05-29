const mongoose = require("mongoose")

// Define the service schema
const serviceSchema = new mongoose.Schema({
  name: {
        type: String ,
        required:true
   },
  description: {
        type: String ,
        required:true
    },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
 ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
    required:true
  },
  status: {
		type: String,
		enum: ["Draft", "Published"],
	  },
  thumbnail: {
    type: String,
    required:true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "category",
  },
  slots: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref : "ServiceSlots",
    required:true
  },
],
  since: { type: Date, default: Date.now },
})

module.exports = mongoose.model("service", serviceSchema)