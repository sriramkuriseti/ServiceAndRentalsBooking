
// 2. User Management Endpoints:
//    - `/api/users/:userId` (GET): Get user details by user ID.
//    - `/api/users/:userId` (PUT): Update user details.
//    - `/api/users/:userId` (DELETE): Delete user account.


const express = require("express")
const router = express.Router()
const { auth, isInstructor } = require("../middleware/Auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  instructorDashboard,
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
//router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router


