const mongoose = require("mongoose");

const rentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        slots: [{
            type: mongoose.Schema.Types.ObjectId,
            ref : "RentSlots"
          }],
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
            ref: "category",
            required: true,
        },
        ratingAndReviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "RatingAndReview",
            },
        ],
       Since: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("rent", rentSchema);