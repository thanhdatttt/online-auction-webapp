import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ parentId: null })
      .populate({
         path: 'children',
         select: 'name slug'
      });

    res.status(200).json({
        message: "Categories retrieved successfully",
        categories: categories,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get categories list", err: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, parentId, description, image_url } = req.body;

    if (parentId) {
      const parentCategory = await Category.findById(parentId);
      if (!parentCategory) {
        return res.status(404).json({ message: "Parent category not found" });
      }
    }

    const category = new Category({
      name,
      parentId: parentId || null,
      description: description || null,
      image_url: image_url,
    });

    const savedCategory = await category.save();

    res.status(201).json({
        message: "Category created successfully",
        category: savedCategory
    });
  } catch (err) {
    // Handle Duplicate Name err (E11000)
    if (err.code === 11000) {
      return res.status(400).json({ message: "Category already exists" });
    }
    res.status(500).json({ message: "Failed to create category" , error: err.message });
  }
};