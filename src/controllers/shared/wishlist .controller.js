import Wishlist from "../../models/wishlist.model.js";

export const toggleWishlist = async (req, res) => {
  const userId = req.user._id;
  const productId = req.params.productId;

  // 1. جيب الـ wishlist تبع المستخدم أو أنشئ وحدة جديدة
  let wishlist =
    (await Wishlist.findOne({ owner: userId })) ||
    (await Wishlist.create({ owner: userId, products: [] }));

  // 2. تحقق إذا المنتج موجود
  const alreadyInWishlist = wishlist.products.some(
    (id) => id.toString() === productId.toString()
  );

  if (alreadyInWishlist) {
    // حذف المنتج
    const index = wishlist.products.findIndex(
      (id) => id.toString() === productId.toString()
    );

    if (index !== -1) {
      wishlist.products.splice(index, 1); // هيك حذفنا عنصر واحد بس
      await wishlist.save();
    }
    return res.status(200).json({ message: "Removed from wishlist" });
  } else {
    // إضافة المنتج
    wishlist.products.push(productId);
    await wishlist.save();
    return res.status(200).json({ message: "Added to wishlist" });
  }
};
