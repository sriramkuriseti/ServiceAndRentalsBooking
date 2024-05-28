const Rent = require("../models/Rent");
const RentSlots = require("../models/RentSlots");

// createslots

exports.createRentSlots = async (req, res) => {
    try {
        const { startDate, endDate, rentId, startTime, endTime } = req.body;

        // Validate incoming data
        if (!startDate || !endDate || !rentId || !startTime || !endTime) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Find the corresponding rent item
        const rentItem = await Rent.findById(rentId);
        if (!rentItem) {
            return res.status(404).json({ message: 'Rent item not found' });
        }

        // Create slots for each date between startDate and endDate
        let currentDate = new Date(startDate);
        const end = new Date(endDate);
        while (currentDate <= end) {
            // Create new rent slot
            const newRentSlot = new RentSlots({
                date: currentDate,
                rent: rentId,
                slot: {
                    startTime,
                    endTime,
                },
            });

            // Save the rent slot to the database
            await newRentSlot.save();

            // Add the rent slot to the rent item's slots array
            rentItem.slots.push(newRentSlot._id);

            // Move to the next date
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Save the updated rent item
        await rentItem.save();

        return res.status(201).json({ message: 'Rent slots created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// deleteslots
exports.deleteRentSlots = async (req, res) => {
    try {
        const { slotId } = req.params; // Use slotId from request params

        // Find the corresponding service slot
        const rentSlot = await RentSlots.findById(slotId);
        if (!rentSlot) {
            return res.status(404).json({ message: 'Rent slot not found' });
        }

        // Find the corresponding service item
        const rentItem = await Rent.findById(rentSlot.rent);
        if (!rentItem) {
            return res.status(404).json({ message: 'Rent item not found' });
        }

        // Remove the service slot from the database
        await RentSlots.findByIdAndDelete(slotId);

        // Remove the reference to the deleted service slot from the service item's slots array
        rentItem.slots = rentItem.slots.filter(slot => !slot.equals(slotId));

        // Save the updated service item
        await rentItem.save();

        return res.status(200).json({ message: 'Rent slot deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// updateslots
exports.updateRentSlots = async (req, res) => {
    try {
        const { slotId } = req.params; // Use slotId from request params
        const { newStartTime, newEndTime } = req.body;

        // Find the corresponding service slot
        const rentSlot = await RentSlots.findById(slotId);
        if (!rentSlot) {
            return res.status(404).json({ message: 'rent slot not found' });
        }

        // Update the service slot with the new start time and end time
        rentSlot.slot.startTime = newStartTime;
        rentSlot.slot.endTime = newEndTime;
        await rentSlot.save();

        return res.status(200).json({ message: 'Rent slot updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


// getsoltsofrentItem

exports.getSlotsOfRentItem = async (req, res) => {
    try {
        const { rentId } = req.params;
        const { startDate, endDate } = req.body;
        
        // Validate incoming data
        if (!rentId || !startDate || !endDate ) {
            return res.status(400).json({ message: 'Rent ID and date are required' });
        }

        // Find all rent slots for the specified rent item and date
        const rentSlots = await RentSlots.find({
             rent: rentId, 
             date: { $gte: startDate, $lte: endDate }
             });

        return res.status(200).json({ success: true, data: rentSlots });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};