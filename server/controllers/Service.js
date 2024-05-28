const Service = require('../models/Service');
const User = require('../models/User');
const Category = require('../models/Category');
const ServiceProgress= require('../models/ServiceProgress');
const Slot=require('../models/ServiceSlots');
const RatingAndReview= require('../models/RatingAndReviews');
const { uploadImageToCloudinary }= require('../utils/ImageUploder');
/* --------------PRODUCER SIDE ----------------*/
// 1. create service (post)
exports.createService = async (req, res) => {
    try {
        // Destructure fields from the request body
        const {
            name,
            description,
            location,
            price,
            category,
            // whatYouWillLearn,
            // instructions
        } = req.body;
        const userId = req.user.id;
        let thumbnailUrl="";

        // Check if all required fields are present
        if (
            !name ||
            !description ||
            !location ||
            !price ||
            !category //||
            // !whatYouWillLearn||
            // !instructions
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
        

        // Create the service
        const service = await Service.create({
            serviceName:name,
            serviceDescription:description,
            // whatYouWillLearn,
            // instructions,
            serviceProvider: userId,
            location,
            ratingAndReviews:[],
            price,
            thumbnail:thumbnailUrl,
            category,
            slots:[]
        });

        // Update the user's services array with the new service ID
        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { services: service._id } },
            { new: true }
        );

        // Update the category's services array with the new service ID
        await Category.findByIdAndUpdate(
            category,
            { $push: { services: service._id } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            service,
            message: 'Service created successfully.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Service creation failed. Please try again.',
        });
    }
};

// 2.update specific service (put)
exports.updateService = async (req, res) => {
    try {
        const { id } = req.params; // Get the service ID from params
        const updateFields = req.body; // Get the update fields from request body

        // Check if the service exists
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        // Check if user is trying to edit serviceProvider or ratingAndReviews
        if ('serviceProvider' in updateFields || 'ratingAndReviews' in updateFields) {
            return res.status(400).json({
                success: false,
                message: 'You are not allowed to edit the "serviceProvider" or "ratingAndReviews" fields',
            });
        }

        // gets the keys from the updatefields of json object
        const validFields = Object.keys(updateFields);
        //filters the allowed fields from service schema
        const allowedFields = Object.keys(Service.schema.paths).filter(
            field => field !== 'serviceProvider' && field !== 'ratingAndReviews'
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
                service.thumbnail=thumbnailImage.secure_url;
            }

        // Update the service
        Object.keys(updateFields).forEach(async field => {
            if (field === 'category') {
                // Remove the service ID from the previous category's services array
                await Category.findByIdAndUpdate(service.category, { $pull: { services: id } });

                // Update the service's category
                service.category = updateFields[field];

                // Add the service ID to the new category's services array
                await Category.findByIdAndUpdate(updateFields[field], { $push: { services: id } });
            } else if (field === 'slots') {
                // Append the new slots array to the existing array
                service.slots = service.slots.concat(updateFields[field]);
            } else {
                service[field] = updateFields[field];
            }
        });
        await service.save();

        return res.status(200).json({
            success: true,
            service,
            message: 'Service updated successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Service update failed. Please try again.',
        });
    }
};

// 3.Get all services
exports.getAllServices = async (req, res) => {
    try {
        // Find all rent items and populate all fields of reference
        const services = await Service.find({})
            .populate({
                path: 'serviceProvider',
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
            data: services,
            message: 'All services retrieved successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve services. Please try again.',
        });
    }
};


// 4. Get specific service details
exports.getServiceDetails = async (req, res) => {
    try {
        const { id } = req.params; // Get the service ID from params

        // Find the service by ID
        const result = await Service.findById(id);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }
        // Find the service by ID and populate all reference fields
        const service = await Service.findById(id)
        .populate({
            path: 'serviceProvider',
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

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        return res.status(200).json({
            success: true,
            service,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch service. Please try again.',
        });
    }
};

//5. Delete the specific service
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params; // Get the service ID from params

        // Find the service by ID
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        // Delete all slots associated with the service
        await Slot.deleteMany({ 'service': id });

        // Remove the service ID from the user's services array
        await User.updateMany({}, { $pull: { services: id } });

        // Remove the service ID from the category's services array
        await Category.updateMany({}, { $pull: { services: id } });

        // Delete all rating and reviews associated with the service
        await RatingAndReview.deleteMany({ 'ID': id });

        // Delete the service progress associated with the service
        await ServiceProgress.deleteMany({ 'serviceID': id });

        // Delete the service
        await Service.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'Service deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Service deletion failed. Please try again.',
        });
    }
};

//6. update Service Progress
exports.updateServiceProgress = async (req, res) => {
  try {
    const { id }= req.params;
    const { progress } = req.body; 

    // Find the rent progress document for the user and Item
    const serviceProgress = await ServiceProgress.findOne({  slotId:id });
    console.log(serviceProgress);
    if (!serviceProgress) {
      return res.status(404).json({ success: false, message: "Service progress not found" });
    }

   serviceProgress.orderinfo.push({
      status: progress,
      statusAt: Date.now(),
  });
    await serviceProgress.save();

    // Return the status information
    return res.status(200).json({
      success: true,
      data: serviceProgress,
      message:'service  status Updated successfully'
    });
  } catch (error) {
    console.error("Error checking Service status:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// Get a list of Course for a given Instructor
exports.getProviderServices = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const providerId = req.user.id
  
      // Find all courses belonging to the instructor
      const providerServices = await Service.find({
        serviceProvider : providerId,
      }).sort({ since: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: providerServices,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }

/* --------------CUSTOMER SIDE ----------------*/
// 7.Book service
exports.bookService = async (req, res) => {
    try {
      const { serviceId, slotId } = req.body;
      const userId = req.user.id;
  
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the service exists
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ success: false, message: "Service not found" });
      }
  
      // Check if the slot exists and is available
      const result = await Slot.findById(slotId);
      if (!result) {
        return res.status(400).json({ success: false, message: "Slot not found" });
      }
      if (result.slot.status !== "available") {
        return res.status(400).json({ success: false, message: "Slot not available" });
      }
  
      // Update slot status to booked and assign bookedBy
      result.slot.status = "booked";
      result.slot.bookedBy = userId;
      await result.save();
      
      console.log("slot after update :",result);
      //if service is not present in the user schema then add the service ref
      if (!user.services.includes(serviceId)) {
        user.services.push(serviceId);
        await user.save();
      }
  
      // Create service progress entry
      const serviceProgress = new ServiceProgress({
        serviceID: serviceId,
        userId: userId,
        slotId: slotId,
        orderinfo: [ {status: "Intiated"} ] // Assuming you want to set initial status to "Initiated"
      });
      await serviceProgress.save();
      console.log("service Progress :",serviceProgress);
      return res.status(200).json({ success: true, message: "Service booked successfully", service });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
//8.Check service Status
exports.checkServiceStatus = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have middleware to extract user ID from the request
    const { serviceId , slotId} = req.body; // Assuming the service ID is sent in the request body

    console.log(userId," ",serviceId," ",slotId);
    // Find the service progress document for the user and service
    const serviceProgress = await ServiceProgress.findOne({ serviceID:serviceId, userId,  slotId });

    if (!serviceProgress) {
      return res.status(404).json({ success: false, message: "Service progress not found" });
    }

    // Return the status information
    return res.status(200).json({
      success: true,
      data: serviceProgress.orderinfo,
    });
  } catch (error) {
    console.error("Error checking service status:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 9. Cancel service 
exports.cancelService = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have middleware to extract user ID from the request
    const { serviceId ,slotId } = req.body; // Assuming the service ID is sent in the request body

    console.log("user :",userId);
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Check if the service exists
    const service = await Service.findById(serviceId).populate('slots');
    if (!service) {
        return res.status(404).json({ message: 'Service not found' });
    }

  // Check if the service is in the user's services list
  if (!user.services.includes(serviceId)) {
      return res.status(400).json({ message: 'Service not serviced by user' });
  }
  
  // Check if the particular slot of the service is booked by the current user
  const result = service.slots.find(slot => slot._id.toString() === slotId);
  if (!result || result.slot.bookedBy.toString() !== userId) {
      return res.status(400).json({ message: 'Slot not booked by current user' });
  }
    // Check rent progress for order status
     const serviceProgress = await ServiceProgress.findOne({ serviceID: serviceId, slotId, userId });
     if (!serviceProgress || serviceProgress.orderinfo[0].status !== 'Intiated' || serviceProgress.slotId.toString() !== slotId) {
         return res.status(400).json({ message: 'Cannot cancel the Service' });
     }
    // Update the slot status to available in the rent item
    result.slot.status = 'available';
    result.slot.bookedBy= null;

    // Extract all slots that are unavailable and booked by the current user for the given service
    const userSlots = await Slot.find({ "slot.bookedBy": userId, "slot.status": "booked", "service": serviceId });

    // Remove the current user's given slotId from the obtained slots which were booked by the current user
    const remainingSlots = userSlots.filter(slot => slot._id.toString() !== slotId);
  
    // If after removing the given slot, the length of the remaining slots is zero, remove the service from the user schema
    if (remainingSlots.length === 0) {
      user.services = user.services.filter(id => id.toString() !== serviceId);
    }

    // Concatenate the cancelled item with the order info
    serviceProgress.orderinfo.push({
        status: "Cancelled",
        statusAt: Date.now(),
    });

    // Save the updated rent item, user, and rent progress
    await result.save();
    await user.save();
    await serviceProgress.save();

    return res.status(200).json({ message: 'Service cancelled successfully', service });
  } catch (error) {
    console.error("Error cancelling service:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//10 .get all booked service by the current user
exports.getAllBookedServices = async (req, res) => {
    const userId = req.user.id;

    try {
        // Find the user by ID and populate the services field
        const user = await User.findById(userId).populate({
            path: 'services',
            select: 'serviceName serviceDescription serviceProvider slots',
            populate: [
                {
                    path: 'serviceProvider',
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

        // Extract the service IDs from the user's services
        const serviceIds = user.services.map(service => service._id);

        // Find all service progress entries for the user's booked services
        const serviceProgress = await ServiceProgress.find({ userId });

        return res.status(200).json({ BookedServices: user.services, serviceProgress });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



// 11. get all users of the specific service
exports.getAllUsersOfService = async (req, res) => {
    const { serviceId } = req.params;

    try {
        // Find the service
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Populate users for each slot
        await Service.populate(service, {
            path: 'slots',
            populate: {
                path: 'slot.bookedBy',
                model: 'user',
                select: 'firstName lastName email contactNumber'
            }
        });

        // Extract unique user information from each slot
        const usersMap = new Map();
        service.slots.forEach(slot => {
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

//get services created by an user

  