const Service = require("../models/Service");
const ServiceSlots = require("../models/ServiceSlots");

// Create Service Slots
exports.createServiceSlots = async (req, res) => {
    try {
        const { startDate, endDate, serviceId, startTime, endTime } = req.body;

        // Validate incoming data
        if (!startDate || !endDate || !serviceId || !startTime || !endTime) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Find the corresponding service item
        const serviceItem = await Service.findById(serviceId);
        if (!serviceItem) {
            return res.status(404).json({ message: 'Service item not found' });
        }

        // Create slots for each date between startDate and endDate
        let currentDate = new Date(startDate);
        const end = new Date(endDate);
        while (currentDate <= end) {
            // Create new service slot
            const newServiceSlot = new ServiceSlots({
                date: currentDate,
                service: serviceId,
                slot: {
                    startTime,
                    endTime,
                },
            });
  
            console.log(newServiceSlot);
            // Save the service slot to the database
            await newServiceSlot.save();

            // Add the service slot to the service item's slots array
            serviceItem.slots.push(newServiceSlot._id);

            // Move to the next date
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Save the updated service item
        await serviceItem.save();

        return res.status(201).json({ message: 'Service slots created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete Service Slots
exports.deleteServiceSlots = async (req, res) => {
    console.log("Entered ");
    try {
        const { id } = req.params; // Use slotId from request params

        // Find the corresponding service slot
        const serviceSlot = await ServiceSlots.findById(id);
        if (!serviceSlot) {
            return res.status(404).json({ message: 'Service slot not found' });
        }

        // Find the corresponding service item
        const serviceItem = await Service.findById(serviceSlot.service);
        if (!serviceItem) {
            return res.status(404).json({ message: 'Service item not found' });
        }

        // Remove the service slot from the database
        await ServiceSlots.findByIdAndDelete(id);

        // Remove the reference to the deleted service slot from the service item's slots array
        serviceItem.slots = serviceItem.slots.filter(slot => !slot.equals(id));

        // Save the updated service item
        await serviceItem.save();

        return res.status(200).json({ message: 'Service slot deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Update Service Slots
exports.updateServiceSlots = async (req, res) => {
    try {
        const { id } = req.params; // Use slotId from request params
        const { newStartTime, newEndTime } = req.body;

        // Find the corresponding service slot
        const serviceSlot = await ServiceSlots.findById(id);
        if (!serviceSlot) {
            return res.status(404).json({ message: 'Service slot not found' });
        }

        // Update the service slot with the new start time and end time
        serviceSlot.slot.startTime = newStartTime;
        serviceSlot.slot.endTime = newEndTime;
        await serviceSlot.save();

        return res.status(200).json({ message: 'Service slot updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Get all Slots of Service Item
exports.getSlotsOfServiceItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.body;

        // Validate incoming data
        if (!id || !startDate || !endDate) {
            return res.status(400).json({ message: 'Service ID, start date, and end date are required' });
        }

        // Find all service slots for the specified service item and date range
        const serviceSlots = await ServiceSlots.find({
            service: id,
            date: { $gte: startDate, $lte: endDate }
        });

        return res.status(200).json({ success: true, data: serviceSlots });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
