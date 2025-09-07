export const queryBuilder = async (Model, queryParams, defaultFilter = {}) => {
  let queryObj = { ...defaultFilter };

  // keyword search
  if (queryParams.keyword) {
    queryObj.$or = [
      { title: { $regex: queryParams.keyword, $options: "i" } },
      { description: { $regex: queryParams.keyword, $options: "i" } },
    ];
  }

  // category filter
  if (queryParams.category) {
    queryObj.category = queryParams.category;
  }

  // price filter
  if (queryParams.minPrice || queryParams.maxPrice) {
    queryObj.price = {};
    if (queryParams.minPrice)
      queryObj.price.$gte = Number(queryParams.minPrice);
    if (queryParams.maxPrice)
      queryObj.price.$lte = Number(queryParams.maxPrice);
  }

  // rating filter

  if (queryParams.minRating || queryParams.maxRating) {
    queryObj.averageRating = {};
    if (queryParams.minRating)
      queryObj.averageRating.$gte = Number(queryParams.minRating);
    if (queryParams.maxRating)
      queryObj.averageRating.$lte = Number(queryParams.maxRating);
  }

  // build query
  let query = Model.find(queryObj);

  // sort
  if (queryParams.sortBy) {
    const sortField = queryParams.sortBy;
    const sortOrder = queryParams.sortOrder === "desc" ? -1 : 1;
    query = query.sort({ [sortField]: sortOrder });
  }

  // pagination
  const page = Number(queryParams.page) || 1;
  const limit = Number(queryParams.limit) || 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit).lean();

  // =========================
  // 6️⃣ Dynamic Nested Populate
  // =========================

  if (queryParams.populate) {
    const populateFields = queryParams.populate.split(";").map((f) => f.trim());
    const populateMap = {};

    populateFields.forEach((field) => {
      const [pathPart, select] = field.split(":");
      const pathSegments = pathPart.split(".");
      let current = populateMap;
      pathSegments.forEach((seg, idx) => {
        if (!current[seg]) current[seg] = {};
        if (idx === pathSegments.length - 1) {
          current[seg]._select = select
            ? select.split(",").join(" ")
            : undefined;
        }
        current = current[seg];
      });
    });

    const convertToPopulateArray = (map, parentPath = "") => {
      return Object.entries(map).map(([key, value]) => {
        const fullPath = parentPath ? `${parentPath}.${key}` : key;
        const obj = { path: fullPath };
        if (value._select) obj.select = value._select;
        const children = Object.entries(value).filter(([k]) => k !== "_select");
        if (children.length > 0)
          obj.populate = convertToPopulateArray(value, fullPath);
        return obj;
      });
    };

    const populateArray = convertToPopulateArray(populateMap);
    populateArray.forEach((p) => (query = query.populate(p)));
  }

  //        =======================             =======================
  //        =======================             =======================
  //        =======================             =======================

  // execute db
  const results = await query;

  // execute total
  const total = await Model.countDocuments(queryObj);
  return { total, page, limit, results };
};
