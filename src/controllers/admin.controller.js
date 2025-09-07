import { queryBuilder } from "../utils/queryBuilder.js";
import { compare, hash } from "bcrypt";
import { createProduct } from "./shared/product.controller.js";
const indexes = [
  "audioLog",
  "product",
  "user",
  "auth",
  "wishlist",
  "category",
  "message",
  "order",
  "notification",
];

export const readAll = async (req, res) => {
  const type = req.query.type ? req.query.type.trim() : "";
  const myrestricts = indexes.slice(0);

  if (type.length < 1 || !myrestricts.includes(type))
    throw new Error("Invaild Query Inputs ");

  const { default: Model } = await import(`../models/${type}.model.js`);
  const { total, page, limit, results } = await queryBuilder(Model, req.query);
  res.status(200).json({ success: true, total, page, limit, [type]: results });
};
export const createAny = async (req, res) => {
  const type = req.query.type ? req.query.type.trim() : "";
  const myrestricts = indexes;
  if (type.length < 1 || !myrestricts.includes(type))
    throw new Error("Invaild Query Inputs ");

  const { default: create } = await import(`./shared/${type}.controller.js`);
  await create(req, res);
};

// export const getAdminStats = async (req, res) => {};
// export const deleteOrderAdmin = async (req, res) => {};
// export const getAdminDetails = async (req, res) => {};
// export const getSalesTrend = async (req, res) => {};
// export const getAdminOverview = async (req, res) => {};
// export const updateOrderStatus = async (req, res) => {};
// export const getOrderByIdAdmin = async (req, res) => {};
