import indexes from "../models/index.js";
import { queryBuilder } from "../utils/queryBuilder.js";

export const getAll = async (req, res) => {
  console.log(indexes);
  const [success, total, page, limit, results] = [0, 0, 0, 0];
  return res.status(200).json({ success, total, page, limit, results });
};
