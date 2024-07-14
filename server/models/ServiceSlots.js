const mongoose = require("mongoose");
const serviceSlotsSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "service"
    },
    slot: {
        startTime: { type: String, required: true, match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/ }, // 24-hour format
        endTime: { type: String, required: true, match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/ }, // 24-hour format
        bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        status: {
            type: String,
            enum: ["available", "booked"],
            default: "available"
        },
        progress: {  type: String,
            enum: ["Not Intiated","Intiated","InProgress","Completed","Cancelled"],
            default : "Not Intiated"
        },
    }
});


module.exports = mongoose.model("ServiceSlots", serviceSlotsSchema);
