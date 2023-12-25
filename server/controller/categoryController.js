import slugify from "slugify";
import CategoryModel from "../models/CategoryModel.js";


// category controller

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        success: false,
        message: "Name is required",
      });
    }
    let existingcategory = await CategoryModel.findOne({ name });
    if (existingcategory) {
      return res.status(200).send({
        success: false,
        message: "User already exist",
      });
    }
    const category = await new CategoryModel({
      name,
      slug: slugify(name),
    });
    category.save();
    res.status(200).send({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Category",
      error,
    });
  }
};

//Update category

export const UpdateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const updatecategory = await CategoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category Succesfuly Updated",
      updatecategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Update Failed",
      error,
    });
  }
};

// get all Category
export const getAllCategorycontroller = async (req, res) => {
  try {
    const category = await CategoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Category",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get singlecategory

export const getSinglecategorycontroller = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "single Category",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// delete category
export const deleteCategoryController = async(req, res) => {
  try {
    
    const {id}=req.params
    let deletecategory= await CategoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category Succesfuly Deleted",
      deletecategory,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
    
  }



};
