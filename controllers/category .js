const Category = require("../models/category");
const { request } = require("express");

const insertCategory = async (req, res) => {
  const name = req.body.name;
  const slug = req.body.slug;
  const parentId = req.body.parentId;
  const subcategories = req.body.subcategories;

  const newCategory = new Category({
    name,
    slug,
    parentId,
    subcategories,
  });

  try {
    let response = await newCategory.save();
    if (parentId) {
      const parentCatergory = await Category.findById(parentId);
      parentCatergory.subcategories.push(newCategory);
      await parentCatergory.save();
    }
    if (response) {
      return res.status(201).send({ message: "New Catergory Insered" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};

const getSubCatergoryById = async (req, res) => {
  const parentId = req.params.id;

  Category.findById({ _id: parentId })
    .populate("subcategories")
    .exec()
    .then((category) => {
      return res.json(category.subcategories);
    })
    .catch((err) => {
      return res.json(err);
    });
};

const getParentCatergoryById = async (req, res) => {
  const parentId = req.params.id;
  try {
    let response = await Category.find({ _id: parentId });
    if (response) {
      return res.json(response);
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getParent = async (req, res) => {
  try {
    //const id = req.params.id;
    const category = await Category.find({ parentId: null }).populate(
      "subcategories"
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getCatergoryName = async (req, res) => {
  const ID = req.params.id;
  try {
    let response = await Category.find({ _id: ID }).select("name");
    if (response) {
      console.log("name", response);
      return res.json(response);
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  //categoryInsert,
  insertCategory,
  getSubCatergoryById,
  getParentCatergoryById,
  getParent,
  getCatergoryName,
};
