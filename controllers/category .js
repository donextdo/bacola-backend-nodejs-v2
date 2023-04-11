const { Category, Product } = require("../models/product");
const { request } = require("express");

async function insertCategory(name, parentId) {
  try {
    const category = new Category({
      name: name,
      parent: parentId,
    });
    const savedCategory = await category.save();
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
