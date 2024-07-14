const Category = require("../models/Category");
const User = require("../models/User");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    let { name, description , status } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    console.log("name :",name," Description :",description);
    if (!status || status === undefined) {
      status = "Draft"
    }
    const categoryDetails = await Category.create({
      name: name,
      description: description,
      status:status,
      services:[],
      product:[],
      rent:[]
    });
    console.log(categoryDetails);
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
      data:categoryDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the category ID is passed as a URL parameter
    let { name, description, status } = req.body;

    if (!name && !description && !status) {
      return res.status(400).json({
        success: false,
        message: "At least one field (name or description) must be provided",
      });
    }

    // Find the category by ID
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Update the category fields if provided
    if (name) category.name = name;
    if (description) category.description = description;
    if (status) category.status=status;

    // Save the updated category
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data :category, // Optionally include the updated category in the response
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
	  const category = await Category.findById(categoryId).populate("services");
	  if (!category) {
		return res.status(404).json({ success: false, message: "Category not found" });
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

  exports.getCategoryDetails = async (req,res ) => {
    try {
      const { id } = req.params
  
      // Get category details including services, products, and rents
      const selectedCategory = await Category.findById(id).populate("services products rents").exec();
      // Handle the case when the category is not found
      if (!selectedCategory) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }

      res.status(200).json({ success: true, data: selectedCategory });
    }
    catch (error) {
      console.log(" ERROR FETCHING CATEGORY DETAILS ");
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  
  // Category Page Details
  exports.getcategoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
  
      // Get category details including services, products, and rents
      const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "services",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .populate({
        path: "products",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .populate({
        path: "rents",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      }).exec();
  
      // Handle the case when the category is not found
      if (!selectedCategory) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }

      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
  };
  