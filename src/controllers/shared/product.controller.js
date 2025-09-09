import { Category, Product } from "../../models/index.js";
import { queryBuilder } from "../../utils/queryBuilder.js";
import productValidation from "../../validations/product.validation.js";
export const createProduct = async (req, res) => {
  const parsed = productValidation.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.format() });
  }

  const mainImage = req.files?.mainImage?.[0]
    ? {
        url: req.files.mainImage[0].path,
        public_id: req.files.mainImage[0].filename,
      }
    : null;

  const images =
    req.files?.images?.map((file) => ({
      url: file.path,
      public_id: file.filename,
    })) || [];

  if (!mainImage) {
    return res
      .status(400)
      .json({ success: false, message: "Main image is required" });
  }

  const { title, category } = req.body;
  const existingCategory =
    (await Category.findOne({ name: category })) ||
    (await Category.create({ name: category }));

  const newProduct = {
    owner: req.user,
    ...parsed.data,
    category: existingCategory._id,
    mainImage,
    images,
  };

  await Product.create(newProduct);

  res.status(201).json({
    success: true,
    message: `✅ Product (${title}) created successfully`,
    data: newProduct,
  });
};
export const updateProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findOneById(id);
  if (!product) throw new Error("the product is not found!");
  const parsed = productValidation.safeParse(req.body);
  if (!parsed.success) throw new Error("Invalid Inputs!");
  const upProduct = parsed.data;
  await Product.findOneByIdAndUpdate(
    id,
    { $set: { ...upProduct } },
    { new: true }
  );
  res.status(200).json({ success: true, product_is_updated: upProduct });
};
export default createProduct;
