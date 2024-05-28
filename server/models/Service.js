const mongoose = require("mongoose")

// Define the service schema
const serviceSchema = new mongoose.Schema({
  serviceName: {
        type: String ,
        required:true
   },
  serviceDescription: {
        type: String ,
        required:true
    },
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  // whatYouWillLearn: {
  //   type: String,
  // },
  // instructions: {
  //   type: [String],
  // },
  location: {
        type: String,
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
  thumbnail: {
    type: String,
    
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