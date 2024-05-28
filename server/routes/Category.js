// - `/api/categories` (GET): Get a list of all available categories.
// - `/api/categories/:categoryId` (GET): Get details of a specific category.
// - `/api/categories/:categoryId/services` (GET): Get services under a specific category.
// - `/api/categories/:categoryId/products` (GET): Get products under a specific category.
// - `/api/categories/:categoryId/rents` (GET): Get rent items under a specific category.

// Import the required modules
const express = require("express")
const router = express.Router()


// Categories Controllers Import
const {
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
  getServicesUnderCategory,
  getProductsUnderCategory,
  getRentsUnderCategory,
  getcategoryPageDetails,
} = require("../controllers/Category")

// Importing Middlewares
const { auth,  isAdmin } = require("../middleware/Auth")

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here

router.post("/createCategory", createCategory)
router.delete("/deleteCategory/:categoryId", auth,isAdmin,deleteCategory);
router.put("/updateCategory/:id", auth,isAdmin,updateCategory);

router.get("/getAllCategories", getAllCategories)

router.get("/getcategoryPageDetails/:categoryId", getcategoryPageDetails);

router.get("/getServicesUnderCategory/:categoryId", getServicesUnderCategory)
router.get("/getProductsUnderCategory/:categoryId", getProductsUnderCategory)
router.get("/getRentsUnderCategory/:categoryId", getRentsUnderCategory)

module.exports = router;
