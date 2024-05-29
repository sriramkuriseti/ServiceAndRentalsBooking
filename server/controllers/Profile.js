const profile = require("../models/Profile")
const user = require("../models/User")
const service = require("../models/Service")
const serviceProgress = require("../models/ServiceProgress")
const product  = require("../models/Product")
const productProgress = require("../models/ProductProgress")
const rent = require("../models/Service")
const rentProgress = require("../models/RentProgress")
const rentSlots = require("../models/RentSlots")
const serviceSlots = require("../models/ServiceSlots")

const { uploadImageToCloudinary } = require("../utils/ImageUploder")
const mongoose = require("mongoose")
// const { convertSecondsToDuration } = require("../utils/secToDuration")


//create profile 
const Profile = require("../models/Profile");
const User = require("../models/User");

// Method for updating a profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      gender = "",
      address = "",
      contactNumber=" ",
    } = req.body;
    const  id  = req.user.id;

    console.log(" user :",id);
    // Find the user by id
    const userDetails = await user.findById(id);
    console.log(" userDetails :",userDetails);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Find the profile by id
    const userProfile = await profile.findById(userDetails.additionalDetails);
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      });
    }

    // Update the user details
    const updatedUser = await user.findByIdAndUpdate(id, {
      firstName,
      lastName,
      contactNumber
    });
    await updatedUser.save();

    // Update the profile fields
    userProfile.dateOfBirth = dateOfBirth;
    userProfile.about = about;
    userProfile.gender = gender;
    userProfile.address = address;

    // Save the updated profile
    await userProfile.save();

    // Find the updated user details
    const updatedUserDetails = await user.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};



exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id
    console.log(id)
    const userExist = await user.findById( id )
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    console.log( " delete profile user :",userExist);

    //    // Delete Assosiated Profile with the User
    //    await profilerofile.findByIdAndDelete({
    //     _id: new mongoose.Types.ObjectId(user.additionalDetails),
    //   })
  

     // Delete associated profile
     await profile.findByIdAndDelete(userExist.additionalDetails);

    // Find all services provided by the user
    const services = await service.find({ serviceProvider: id });

    // Iterate over each service
    for (const service of services) {
      // Remove all slots associated with the service
      await serviceSlots.deleteMany({ serviceID : service._id });
      await serviceProgress.deleteMany({serviceID : service._id})
    }

     // Pull user from services
    await service.deleteMany({ serviceProvider : id })

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

     // Pull user from rents
     const products = await product.find({ productProvider: id });

     // Iterate over each service
     for (const product of products) {
       // Remove all slots associated with the service
      
       await productProgress.deleteMany({productID : product._id})
     }
 
      // Pull user from services
     await product.deleteMany({ serviceProvider : id })
 

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Find all services provided by the user
    const rents = await rent.find({ serviceProvider: id });

    // Iterate over each service
    for (const rent of rents) {
      // Remove all slots associated with the service
      await rentSlots.deleteMany({ rentID : rent._id });
      await rentProgress.deleteMany({rentID : rent._id})
    }

     // Pull user from services
    await rent.deleteMany({ rentProvider : id })


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

     // Delete user
     await user.findByIdAndDelete({ _id: id });


    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" })
  }
}


exports.getAllUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec();
    
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


exports.instructorDashboard = async (req, res) => {
  try {
    const Details = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnroled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
