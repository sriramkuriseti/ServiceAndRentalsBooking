const express = require("express");
const router = express.Router();
const { auth, isUser, isAdmin, isProvider } = require("../middleware/Auth");

const {
    createRentProduct,
    updateRentProduct,
    getAllRentItems,
    getRentItemDetails,
    deleteRentItem,
    updateRentProgress,
    bookRentItem,
    cancelRentItem,
    returnRentItem,
    getRentItemProgress,
    getBookedRentedItems,
    getAllUsersOfRentItem
} = require('../controllers/Rent');

const {
  createRentSlots,
  updateRentSlots,
  deleteRentSlots,
  getSlotsOfRentItem
} = require("../controllers/RentSlots")

/* ---------------- ROUTES for RENT ------------*/

router.post("/createRentProduct", auth, isProvider, createRentProduct);
router.put("/updateRentProduct/:id", auth, isProvider, updateRentProduct);
router.get("/getAllRentItems", getAllRentItems);
router.get("/getRentItemDetails/:id", getRentItemDetails);
router.delete("/deleteRentItem/:id", auth, isProvider, deleteRentItem);
router.put("/updateRentProgress/:id", auth, isProvider, updateRentProgress);


router.post("/createRentSlots", auth, isProvider, createRentSlots)
router.put("/updateRentSlots/:slotId", auth, isProvider, updateRentSlots)
router.delete("/deleteRentSlots/:slotId", auth, isProvider, deleteRentSlots)
router.get("/getSlotsOfRentItem/:rentId", getSlotsOfRentItem)

/* ---------------- CUSTOMER SIDE --------------- */

router.post("/bookRentItem", auth, isUser, bookRentItem);
router.put("/cancelRentItem", auth, isUser, cancelRentItem);
router.put("/returnRentItem", auth, isUser, returnRentItem);
router.get("/getRentItemProgress", auth, isUser, getRentItemProgress);
router.get("/getBookedRentedItems", auth, isUser, getBookedRentedItems);
router.get("/getAllUsersOfRentItem/:rentId", auth, getAllUsersOfRentItem);

module.exports = router;