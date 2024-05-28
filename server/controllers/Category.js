const Category = require("../models/Category");
const User = require("../models/User");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    console.log("name :",name," Description :",description);
    const categoryDetails = await Category.create({
      name: name,
      description: description,
      services:[],
      product:[],
      rent:[]
    });
    console.log(categoryDetails);
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find();
    res.status(200).json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get services under a specific category
exports.getServicesUnderCategory = async (req, res) => {
	try {
	  const { categoryId } = req.params;
    console.log(categoryId);
	  const category = await Category.findById(categoryId).populate("services");
	  if (!category) {
		return res.status(404).json({ success: false, message: "Category  services not found" });
	  }
	  res.status(200).json({ success: true, data: category.services });
	} catch (error) {
	  return res.status(500).json({ success: false, message: error.message });
	}
  };
  
  // Get products under a specific category
  exports.getProductsUnderCategory = async (req, res) => {
	try {
	  const { categoryId } = req.params;
	  const category = await Category.findById(categoryId).populate("products");
	  if (!category) {
		return res.status(404).json({ success: false, message: "Category not found" });
	  }
	  res.status(200).json({ success: true, data: category.products });
	} catch (error) {
	  return res.status(500).json({ success: false, message: error.message });
	}
  };
  
  // Get rent items under a specific category
  exports.getRentsUnderCategory = async (req, res) => {
	try {
	  const { categoryId } = req.params;
	  const category = await Category.findById(categoryId).populate("rents");
	  if (!category) {
		return res.status(404).json({ success: false, message: "Category not found" });
	  }
	  res.status(200).json({ success: true, data: category.rents });
	} catch (error) {
	  return res.status(500).json({ success: false, message: error.message });
	}
  };
  

// Category Page Details
exports.getcategoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.params;


    // Get category details including services, products, and rents with strictPopulate set to false
    const selectedCategory = await Category.findById(categoryId)
      .populate({ path: "services", strictPopulate: false })
      .populate({ path: "products", strictPopulate: false })
      .populate({ path: "rents", strictPopulate: false })
      .exec();

    // Handle the case when the category is not found
    if (!selectedCategory) {
      return res.status(404).json({ success: false, message: "Category s p r not found" });
    }

    // Get top-selling services, products, and rents across all categories
    const allCategories = await Category.find()
      .populate({ path: "services", strictPopulate: false })
      .populate({ path: "products", strictPopulate: false })
      .populate({ path: "rents", strictPopulate: false })
      .exec();

    const allServices = allCategories.flatMap((category) => category.services);
    const allProducts = allCategories.flatMap((category) => category.products);
    const allRents = allCategories.flatMap((category) => category.rents);

    const topSellingServices = allServices.sort((a, b) => b.sold - a.sold).slice(0, 10);
    const topSellingProducts = allProducts.sort((a, b) => b.sold - a.sold).slice(0, 10);
    const topSellingRents = allRents.sort((a, b) => b.sold - a.sold).slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        topSellingServices,
        topSellingProducts,
        topSellingRents,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find the category by ID and remove it
    const deletedCategory = await Category.findByIdAndRemove(categoryId);

    // If the category doesn't exist, return a 404 error
    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Return a success message
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// Update a category by its ID
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Find the category by ID and update it
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    // If the category doesn't exist, return a 404 error
    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Return the updated category
    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
