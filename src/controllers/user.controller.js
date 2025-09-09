const indexes = [
  "audioLog",
  "order",
  "auth",
  "message",
  "notification",
  "category",
  "product",
  "user",
  "wishlist",
];l
export const getItem(req,res)=>{
  const type = req.query.type
  if (!indexes.slice(4).includes(type))throw new Error("query is not valid!")
  const Model = await import(`../model/${type}.model.js`)
  const item= await Model.findOnebyId(req.params.id)
  if (!item) throw new Error("Item is not found!")
  res.status(200).json(item)
}
