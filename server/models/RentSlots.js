const mongoose = require("mongoose");

const rentSlotsSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    rent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "rent"
    },
    slot: {
        startTime: { type: String, required: true, match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/ }, // 24-hour format
        endTime: { type: String, required: true, match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/ }, 
        bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        status: {
            type: String,
            enum: ["available", "booked"],
            default: "available"
        }
    }
});

module.exports = mongoose.model("RentSlots", rentSlotsSchema);
