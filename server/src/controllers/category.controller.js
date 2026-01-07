import Category from "../models/Category.js";
import Auction from "../models/Auction.js";

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

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentId, description, image_url } = req.body;
    // console.log(req.body);
    if (parentId && parentId === id) {
      return res.status(400).json({ message: "A category cannot be its own parent" });
    }

    if (parentId) {
      const parentCategory = await Category.findById(parentId);
      if (!parentCategory) {
        return res.status(404).json({ message: "Parent category not found" });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
        // If parentId is an empty string, set it to null (Top Level), otherwise use the value
        parentId: parentId || null, 
        description,
        image_url,
      },
      { new: true, runValidators: true } 
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
    
  } catch (err) {
    // Handle Duplicate Name err (E11000)
    if (err.code === 11000) {
      return res.status(400).json({ message: "Category name already exists" });
    }
    res.status(500).json({ message: "Failed to update category", error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 2. Check if any auctions are using this category
    // Based on Auction.js, the field is `product.categoryId`
    const auctionCount = await Auction.countDocuments({ "product.categoryId": id });

    if (auctionCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. It is used by ${auctionCount} auction(s).` 
      });
    }

    // 3. Check if category has subcategories (Children)
    // Deleting a parent would orphan the children
    const childrenCount = await Category.countDocuments({ parentId: id });
    if (childrenCount > 0) {
        return res.status(400).json({
            message: `Cannot delete category. It has ${childrenCount} subcategories. Delete them first.`
        });
    }

    // 4. Proceed to delete
    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete category", error: err.message });
  }
};