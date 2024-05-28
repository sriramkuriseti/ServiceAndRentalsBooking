// Import the required modules
const express = require("express")
const router = express.Router()


// Categories Controllers Import
const {
  createService,
  updateService,
  getAllServices,
  getServiceDetails,
  deleteService,
  updateServiceProgress,
  bookService,
  checkServiceStatus,
  cancelService,
  getAllBookedServices,
  getAllUsersOfService
} = require("../controllers/Service")

const {
  createServiceSlots,
  updateServiceSlots,
  deleteServiceSlots,
  getSlotsOfServiceItem
} = require("../controllers/ServiceSlots")


// Importing Middlewares
const { auth, isUser, isAdmin, isProvider } = require("../middleware/Auth")

// ********************************************************************************************************
//                                      provider routes 
// ********************************************************************************************************

router.post("/createService", auth, isProvider, createService)
router.put("/updateService/:id", auth, isProvider, updateService)
router.get("/getAllServices", getAllServices)
router.get("/getServiceDetails/:id", getServiceDetails)
router.delete("/deleteService/:id", auth, isProvider, deleteService)
router.put("/updateServiceProgress/:id", auth, isProvider, updateServiceProgress)

router.post("/createServiceSlots", auth, isProvider, createServiceSlots)
router.put("/updateServiceSlots/:id", auth, isProvider, updateServiceSlots)
router.delete("/deleteServiceSlots/:id", auth, isProvider, deleteServiceSlots)
router.get("/getSlotsOfService/:id", getSlotsOfServiceItem)
// ********************************************************************************************************
//                                      customer routes 
// ********************************************************************************************************

router.post("/bookService",auth,isUser, bookService)
router.put("/cancelService", auth,isUser, cancelService)
router.get("/checkServiceStatus", auth,isUser, checkServiceStatus)
router.get("/getAllBookedServices", auth, isUser, getAllBookedServices)
router.get("/getAllUsersOfService/:serviceId", auth,getAllUsersOfService)


module.exports = router