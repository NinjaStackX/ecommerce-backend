import { queryBuilder } from "../utils/queryBuilder.js";
import { compare, hash } from "bcrypt";
const indexes = [
  "audioLog",
  "category",
  "message",
  "order",
  "notification",
  "product",
  "user",
  "auth",
  "wishlist",
];

export const readAll = async (req, res) => {
  const type = req.query.type ? req.query.type.trim() : "";
  const myrestricts = indexes.slice(1);

  if (type.length < 1 || !myrestricts.includes(type))
    throw new Error("Invaild Query Inputs ");

  const { default: Model } = await import(`../models/${type}.model.js`);
  const { total, page, limit, results } = await queryBuilder(Model, req.query);
  res.status(200).json({ success: true, total, page, limit, [type]: results });
};
export const createAny = async (req, res) => {
  const type = req.query.type ? req.query.type.trim() : "";
  const myrestricts = indexes.slice(1);

  if (type.length < 1 || !myrestricts.includes(type))
    throw new Error("Invaild Query Inputs ");

  const { default: ValiParse } = await import(
    `../validations/${type}.validation.js`
  );

  const items = req.body;
  const parsed = ValiParse.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invaild Inputs" });
  }

  switch (type) {
    case "user":
      const hashed = await hash(items.password, 12);
      const { default: Model } = await import(`../models/${type}.model.js`);
      const user = await Model.create({
        ...items,
        password: hashed,
      });
      break;
  }
  return res.status(200).json({
    success: true,
    message: `create ${type} : ${items.name} successfully`,
  });
};

// export const getAdminStats = async (req, res) => {};
// export const deleteOrderAdmin = async (req, res) => {};
// export const getAdminDetails = async (req, res) => {};
// export const getSalesTrend = async (req, res) => {};
// export const getAdminOverview = async (req, res) => {};
// export const updateOrderStatus = async (req, res) => {};
// export const getOrderByIdAdmin = async (req, res) => {};
