const { Category, Product } = require("../models/product");
const { request } = require("express");

async function insertCategory(name, parentId) {
  try {
    const category = new Category({
      name: name,
      parent: parentId,
    });

    const savedCategory = await category.save();
    if (savedCategory) {
      const product = await Product.findById(parentId);

      if (product) {
        const categoryIds = product.category;
        categoryIds.push(savedCategory._id); // add new category id to the category array

        const productUpdate = {
          ...product._doc,
          category: categoryIds, // replace the category array with updated categoryIds
          updatedAt: new Date(),
        };

        try {
          const response = await Product.updateOne(
            { _id: parentId },
            productUpdate
          );

          if (response) {
            return { message: "Successfully updated Product" };
          } else {
            return { error: "Internal server error" };
          }
        } catch (err) {
          console.log("errror", err);
          return { error: "Unable to update" };
        }
      } else {
        return { error: "Product not found" };
      }
    }
    console.log(`Created category: ${savedCategory.name}`);
    return savedCategory;
  } catch (error) {
    console.error(`Error creating category: ${error.message}`);
    throw error;
  }
}

const categoryInsert = async (req, res) => {
  const { name, parentId } = req.body;

  try {
    const savedCategory = await insertCategory(name, parentId);
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  categoryInsert,
};
