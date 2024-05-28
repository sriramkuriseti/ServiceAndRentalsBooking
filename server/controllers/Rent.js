const Category = require('../models/Category');
const Rent = require('../models/Rent'); // Corrected import
const User = require('../models/User');
const RentProgress=require("../models/RentProgress");
const Slots=require('../models/RentSlots');
const RentSlots = require('../models/RentSlots');
const RatingAndReview= require('../models/RatingAndReviews');
const { uploadImageToCloudinary }= require('../utils/ImageUploder');

/* --------------PRODUCER SIDE ----------------*/
//1. create rent
exports.createRentProduct = async (req, res) => {
    try {
        // Destructure fields from the request body
        const {
            name,
            description,
            slotprice,
            category
        } = req.body;
        const userId = req.user.id;
        let thumbnailUrl="";

        // Check if all required fields are present
        if (
            !name ||
            !description ||
            !slotprice ||
            !category 
        ) {
            return res.status(400).json({
                success: false,
                message: 'All required fields are not provided.',
            });
        }
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Upload the Thumbnail to Cloudinary
		if(req.files)
            {
                const thumbnail = req.files.thumbnailImage;
                const thumbnailImage = await uploadImageToCloudinary(
                    thumbnail,
                    process.env.FOLDER_NAME
                );
                console.log(thumbnailImage);
                thumbnailUrl=thumbnailImage.secure_url;
            }
        // Create the product
        const product = await Rent.create({
            name,
            description,
            provider: userId,
            slotprice,
            slots:[],
            thumbnail:thumbnailUrl,
            category,
            ratingAndReviews:[]
        });

        // Update the user's products array with the new product ID
        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { rents: product._id } },
            { new: true }
        );

        // Update the category's products array with the new product ID
        await Category.findByIdAndUpdate(
            category,
            { $push: { rents: product._id } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            product,
            message: 'Product created successfully.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Product creation failed. Please try again.',
        });
    }
};

// 2. Update rent
exports.updateRentProduct = async (req, res) => {
    try {
        const { id } = req.params; // Get the product ID from params
        const updateFields = req.body; // Get the update fields from request body

        // Check if the product exists
        const product = await Rent.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'rent Item not found',
            });
        }
        
        // Check if user is trying to edit provider
        if ('provider' in updateFields || 'ratingAndReviews' in updateFields) {
            return res.status(400).json({
                success: false,
                message: 'You are not allowed to edit the "provider || rating and reviews" field',
            });
        }

        // gets the keys from the updatefields of json object
        const validFields = Object.keys(updateFields);
        //filters the allowed fields from service schema
        const allowedFields = Object.keys(Rent.schema.paths).filter(
            field => field !== 'provider' && field !== 'ratingAndReviews'
        );

        //checks if every update filed is in allowed fields
        //if any one of the update field is not in the allowed fields it will be false
        const isValidOperation = validFields.every(field => allowedFields.includes(field));
        if (!isValidOperation) {
            return res.status(400).json({
                success: false,
                message: 'Invalid update fields',
            });
        }

        if(req.files)
            {
                const thumbnail=req.files.thumbnailImage;
                const thumbnailImage = await uploadImageToCloudinary(
                    thumbnail,
                    process.env.FOLDER_NAME
                );
                product.thumbnail=thumbnailImage.secure_url;
            }
        // Update the product
        Object.keys(updateFields).forEach(async field => {
            if (field === 'category') {
                // Remove the product ID from the previous category's products array
                await Category.findByIdAndUpdate(product.category, { $pull: { rents: id } });

                // Update the product's category
                product.category = updateFields[field];

                // Add the product ID to the new category's products array
                await Category.findByIdAndUpdate(updateFields[field], { $push: { rents: id } });
            } else if (field === 'slots') {
                // Append the new slots array to the existing array
                product.slots = product.slots.concat(updateFields[field]);
            }
            else {
                product[field] = updateFields[field];
            }
        });
        await product.save();

        return res.status(200).json({
            success: true,
            product,
            message: 'Rent Item updated successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'rent Item update failed. Please try again.',
        });
    }
};

// 3. Get all available rent items 
exports.getAllRentItems = async (req, res) => {
    try {
        // Find all rent items and populate all fields of reference
        const rentItems = await Rent.find({})
            .populate({
                path: 'provider',
                select: 'firstName lastName email contactNumber',
            })
            .populate({
                path: 'category',
                select: 'name description',
            })
            .populate({
                path: 'ratingAndReviews',
                select: 'user rating review',
                populate: {
                    path: 'user',
                    select: 'firstName lastName email',
                },
            })
            .populate({
                path: 'slots',
                select: 'date slot',
                populate: {
                    path: 'slot.bookedBy',
                    select: 'firstName lastName email',
                },
            })
            .exec();

        return res.status(200).json({
            success: true,
            data: rentItems,
            message: 'All rent items retrieved successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve rent items. Please try again.',
        });
    }
};

// 4. Get specific rent 
exports.getRentItemDetails = async (req, res) => {
    try {
        const { id } = req.params;

         // Check if the rentItem exists
        const rent = await Rent.findById(id);
        if (!rent) {
            return res.status(404).json({
                success: false,
                message: "Rent item  not found" 
            });
        }

        const rentItems = await Rent.findById(id)
            .populate({
                path: 'provider',
                select: 'firstName lastName email contactNumber',
            })
            .populate({
                path: 'category',
                select: 'name description',
            })
            .populate({
                path: 'ratingAndReviews',
                select: 'user rating review',
                populate: {
                    path: 'user',
                    select: 'firstName lastName email',
                },
            })
            .populate({
                path: 'slots',
                select: 'date slot',
                populate: {
                    path: 'slot.bookedBy',
                    select: 'firstName lastName email',
                },
            })
            .exec();

        return res.status(200).json({
            success: true,
            data: rentItems,
            message: 'All rent items retrieved successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve rent items. Please try again.',
        });
    }
};

// 5. Delete specific rent Item
exports.deleteRentItem = async (req, res) => {
    try {
        const { id } = req.params; // Get the rent item ID from params

        // Find the rent item by ID
        const rentItem = await Rent.findById(id);
        if (!rentItem) {
            return res.status(404).json({
                success: false,
                message: 'Rent item not found',
            });
        }

        // Delete all slots associated with the rent item
        await Slots.deleteMany({ 'rent': id });

        // Remove the rent item ID from the provider's rents array
        await User.updateMany({}, { $pull: { rents: id } });

        // Remove the rent item ID from the category's rents array
        await Category.updateMany({}, { $pull: { rents: id } });

        // Delete all rating and reviews associated with the rent item
        await RatingAndReview.deleteMany({ 'ID': id });

        // Delete the Rent progress associated with the RentItem
        await RentProgress.deleteMany({ 'rentID': id });

        // Delete the rent item
        await Rent.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'Rent item deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Rent item deletion failed. Please try again.',
        });
    }
};

//6. Update Rent progress
exports.updateRentProgress = async (req, res) => {
    try {
      const id = req.params.id;
      const {  progress } = req.body; 
  
      // Find the rent progress document for the user and Item
      const rentProgress = await RentProgress.findOne({ slotId: id });
      if (!rentProgress) {
        return res.status(404).json({ success: false, message: "Rent progress not found" });
      }

     rentProgress.orderinfo.push({
        status: progress,
        statusAt: Date.now(),
    });
      await rentProgress.save();

      // Return the status information
      return res.status(200).json({
        success: true,
        data: rentProgress,
        message:'Rent Item status Updated successfully'
      });
    } catch (error) {
      console.error("Error checking rent Item status:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/* --------------CUSTOMER SIDE ----------------*/

//7. book rent item
exports.bookRentItem = async (req, res) => {
    try {
      const { itemId, slotId } = req.body;
      const userId = req.user.id;
  
      // Check if the rentItem exists
      const RentItem = await Rent.findById(itemId);
      if (!RentItem) {
        return res.status(404).json({ success: false, message: "Rent Item not found" });
      }
  
      // Check if the slot is available
      const result = await Slots.findById(slotId);
      if (!result || result.slot.status !== "available") {
        return res.status(400).json({ success: false, message: "Slot not available" });
      }
  
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Update slot status to booked and assign bookedBy
      result.slot.status = "booked";
      result.slot.bookedBy = userId;
      await result.save();

      //If rentItem is not present in the user Schema then add
      if (!user.rents.includes(itemId)) {
        user.rents.push(itemId);
        await user.save();
      }

        // Create service progress entry
        const rentProgress = new RentProgress({
            rentID: itemId,
            userId: userId,
            slotId:slotId,
            orderinfo: [{ status: "Slot Confirmed" ,statusAt: Date.now() }] // Assuming you want to set initial status to "Initiated"
        });
        await rentProgress.save();

    return res.status(200).json({ success: true, message: "Rent Item booked successfully", RentItem });
    } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
    }
};

//8. cancel rent item
exports.cancelRentItem = async (req, res) => {
    const { itemId, slotId } = req.body;
    const userId = req.user.id;

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the rent item exists
        const rentItem = await Rent.findById(itemId).populate('slots');
        if (!rentItem) {
            return res.status(404).json({ message: 'Rent Item not found' });
        }

        // Check if the item is in the user's rents list
        if (!user.rents.includes(itemId)) {
            return res.status(400).json({ message: 'Rent Item not rented by user' });
        }

        // Check if the particular slot of the rent item is booked by the current user
        const slot = rentItem.slots.find(slot => slot._id.toString() === slotId);
        console.log("slot:",slot);
        if (!slot || slot.slot.bookedBy.toString() !== userId) {
            return res.status(400).json({ message: 'Slot not rented by current user' });
        }

        // Check rent progress for order status
        const rentProgress = await RentProgress.findOne({ rentID: itemId, slotId, userId});
        if (!rentProgress || rentProgress.orderinfo[0].status !== 'Slot Confirmed' || rentProgress.slotId.toString() !== slotId) {
            return res.status(400).json({ message: 'Cannot cancel the Rent Item' });
        }

        // Update the slot status to available in the rent item
        slot.slot.status = 'available';
        slot.slot.bookedBy= null;

        // Extract all slots that are unavailable and booked by the current user for the given service
        const userSlots = await RentSlots.find({ "slot.bookedBy": userId, "slot.status": "booked", "rent": itemId });

        // Remove the current user's given slotId from the obtained slots which were booked by the current user
        const remainingSlots = userSlots.filter(slot => slot._id.toString() !== slotId);
    
        // If after removing the given slot, the length of the remaining slots is zero, remove the service from the user schema
        if (remainingSlots.length === 0) {
           user.rents = user.rents.filter(id => id.toString() !== itemId);
        }

        // Concatenate the cancelled item with the order info
        rentProgress.orderinfo.push({
            status: "Cancelled",
            statusAt: Date.now(),
        });

        // Save the updated rent item, user, and rent progress
        await slot.save();
        await user.save();
        await rentProgress.save();

        return res.status(200).json({ message: 'Rent Item cancelled successfully', rentItem });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

//9. return rent item
exports.returnRentItem = async (req, res) => {
    const { itemId, slotId } = req.body;
    const userId = req.user.id;
    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the rent item exists
        const rentItem = await Rent.findById(itemId).populate('slots');
        if (!rentItem) {
            return res.status(404).json({ message: 'Rent Item not found' });
        }

        // Check if the item is in the user's rents list
        if (!user.rents.includes(itemId)) {
            return res.status(400).json({ message: 'Rent Item not rented by user' });
        }

        // Check if the particular slot of the rent item is booked by the current user
        const slot = rentItem.slots.find(slot => slot._id.toString() === slotId);
        if (!slot || slot.slot.bookedBy.toString() !== userId) {
            return res.status(400).json({ message: 'Slot not rented by current user' });
        }

        // Check rent progress for order status
        const rentProgress = await RentProgress.findOne({ rentID: itemId, slotId, userId});

        if (!rentProgress || rentProgress.orderinfo[rentProgress.orderinfo.length-1].status !== 'Rent Completed' || rentProgress.slotId.toString() !== slotId) {
            return res.status(400).json({ message: 'Cannot return the Rent Item' });
        }

        // Update the slot status to available in the rent item
        slot.slot.status = 'available';
        slot.slot.bookedBy= null;
        
        // Extract all slots that are unavailable and booked by the current user for the given service
        const userSlots = await RentSlots.find({ "slot.bookedBy": userId, "slot.status": "booked", "rent": itemId });

        // Remove the current user's given slotId from the obtained slots which were booked by the current user
        const remainingSlots = userSlots.filter(slot => slot._id.toString() !== slotId);
    
        // If after removing the given slot, the length of the remaining slots is zero, remove the service from the user schema
        if (remainingSlots.length === 0) {
           user.rents = user.rents.filter(id => id.toString() !== itemId);
        }

        // Concatenate the cancelled item with the order info
        rentProgress.orderinfo.push({
            status: "Returned",
            statusAt: Date.now(),
        });

        // Save the updated rent item, user, and rent progress
        await slot.save();
        await user.save();
        await rentProgress.save();

        return res.status(200).json({ message: 'Rent Item returned successfully', rentItem });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

//10.get Rent progress
exports.getRentItemProgress = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming you have middleware to extract user ID from the request
      const { itemId, slotId } = req.body; // Assuming the service ID is sent in the request body
  
      // Find the service progress document for the user and service
      const productProgress = await RentProgress.findOne({rentID:itemId ,userId , slotId });
  
      if (!productProgress) {
        return res.status(404).json({ success: false, message: "Product progress not found" });
      }
  
      // Return the status information
      return res.status(200).json({
        success: true,
        data: productProgress.orderinfo,
      });
    } catch (error) {
      console.error("Error checking Product status:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

//11. get all rent Items rented by the current user
exports.getBookedRentedItems = async (req, res) => {
    const userId = req.user.id;

    try {
        // Find the user by ID and populate the rents field
        const user = await User.findById(userId).populate({
            path: 'rents',
            select: 'name description provider slots',
            populate: [
                {
                    path: 'provider',
                    select: 'firstName lastName email contactNumber'
                },
                {
                    path: 'slots',
                    match: { 'slot.bookedBy': userId },
                    populate: {
                        path: 'slot.bookedBy',
                        select: 'firstName lastName email contactNumber'
                    }
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract the rent IDs from the user's rents
        const rentIds = user.rents.map(rent => rent._id);

        // Find all rent progress entries for the user's rented items
        const rentProgress = await RentProgress.find({ userId });

        return res.status(200).json({ rentedItems: user.rents, rentProgress });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


//12. get all the users of the specific Rent Item
exports.getAllUsersOfRentItem = async (req, res) => {
    const { rentId } = req.params;

    try {
        // Find the rent item
        const rentItem = await Rent.findById(rentId);
        if (!rentItem) {
            return res.status(404).json({ message: 'Rent Item not found' });
        }

        // Populate users for each slot
        await rentItem.populate({
            path: 'slots',
            populate: {
                path: 'slot.bookedBy',
                model: 'user',
                select: 'firstName lastName email contactNumber'
            }
        });

        const usersMap = new Map();
        rentItem.slots.forEach(slot => {
                if (slot.slot.bookedBy) {
                    usersMap.set(slot.slot.bookedBy._id.toString(), slot.slot.bookedBy);
                }

        });
        const users = Array.from(usersMap.values());

        return res.status(200).json({ users });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
// 7. Rent Item Endpoints:
//    - /api/rents (GET): Get a list of all available rent items.
//    - /api/rents/:rentId (GET): Get details of a specific rent item.
//    - /api/rents (POST): Create a new rent item.
//    - /api/rents/:rentId (PUT): Update details of a specific rent item.
//    - /api/rents/:rentId (DELETE): Delete a specific rent item.