import { Wishlist } from "../models";

export const getWishlist = async (req, res) => {
  const { total, page, limit, results } = await queryBuilder(
    Wishlist,
    req.query
  );

  res
    .status(200)
    .json({ success: true, total, page, limit, Wishlists: results });
};
export const toggleWishlist = async (req, res) => {};
export const getMyWishlist = async (req, res) => {};
