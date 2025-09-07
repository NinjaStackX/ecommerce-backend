import { queryBuilder } from "../utils/queryBuilder.js";

export const getAll = async (req, res) => {
  const [indexes, all] = [
    [
      "audioLog",
      "category",
      "message",
      "order",
      "notification",
      "product",
      "user",
      "wishlist",
    ],
    req.query.all ? req.query.all.trim() : "",
  ];

  if (all.length < 1 || !indexes.includes(all))
    throw new Error("Invaild Query Inputs ");

  const { default: Modell } = await import(`../models/${all}.model.js`);
  const { total, page, limit, results } = await queryBuilder(Modell, req.query);
  res.status(200).json({ success: true, total, page, limit, [all]: results });
};
export const getAdminStats = async (req, res) => {};
export const deleteOrderAdmin = async (req, res) => {};
export const getAdminDetails = async (req, res) => {};
export const getSalesTrend = async (req, res) => {};
export const getAdminOverview = async (req, res) => {};
export const updateOrderStatus = async (req, res) => {};
export const getOrderByIdAdmin = async (req, res) => {};
