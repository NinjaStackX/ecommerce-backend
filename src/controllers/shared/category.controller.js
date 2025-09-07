import { Category } from "../../models/index.js";

export const createCategory = async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({
    name: name.toLowerCase(),
  });
  res.status(200).json({
    success: true,
    message: `create category : ${category.name} successfully!`,
  });
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("the category is not found");
  const nameCateDel = await Category.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: `The Categoty ${nameCateDel} deleted successfully!`,
  });
};
export const deleteAllCategories = async (req, res) => {
  const result = await Category.deleteMany({});
  res.status(200).json({
    success: true,
    message: `Completed delete Categories Successfully ,
    count: ${result.deletedCount} `,
  });
};

export default createCategory;
