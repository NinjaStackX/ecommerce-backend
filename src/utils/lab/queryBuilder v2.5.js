function isNumeric(value) {
  return !isNaN(value) && !isNaN(parseFloat(value));
}

export const queryBuilder = async (Model, query) => {
  let mongooseQuery = Model.find();

  // =========================
  // 1️⃣ Filtering + تحويل الأرقام
  // =========================
  const queryObj = { ...query };
  const excludeFields = [
    "page",
    "limit",
    "sort",
    "fields",
    "search",
    "populate",
  ];
  excludeFields.forEach((f) => delete queryObj[f]);
  console.log(queryObj);

  Object.keys(queryObj).forEach((key) => {
    if (isNumeric(queryObj[key])) {
      queryObj[key] = queryObj[key] * 1;
    }
  });
  const priceFilter = {};
  if (query.price?.gte) priceFilter.$gte = Number(query.price.gte);
  if (query.price?.lte) priceFilter.$lte = Number(query.price.lte);

  if (Object.keys(priceFilter).length > 0) {
    mongooseQuery = mongooseQuery.find({ price: priceFilter });
  }

  console.log(queryObj);
  // تحويل operators gte/gt/lte/lt
  let queryStr = JSON.stringify(queryObj);

  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  console.log(queryStr);
  const searchConditions = query.search
    ? {
        $or: [
          { name: { $regex: query.search, $options: "i" } },
          { title: { $regex: query.search, $options: "i" } },
        ],
      }
    : {};

  mongooseQuery = Model.find({
    ...priceFilter,
    ...JSON.parse(queryStr),
    ...searchConditions,
  });

  // // =========================
  // // 2️⃣ Search
  // // =========================
  // if (query.search) {
  //   mongooseQuery = mongooseQuery.find({
  //     $or: [
  //       { name: { $regex: query.search, $options: "i" } },
  //       { title: { $regex: query.search, $options: "i" } },
  //     ],
  //   });
  // }

  // =========================
  // 3️⃣ Sorting
  // =========================
  if (query.sort) {
    const sortBy = query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("-createdAt");
  }

  // =========================
  // 4️⃣ Field Limiting
  // =========================
  if (query.fields) {
    const fields = query.fields.split(",").join(" ");
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
  }

  // =========================
  // 5️⃣ Pagination
  // =========================
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  mongooseQuery = mongooseQuery.skip(skip).limit(limit);

  // =========================
  // 6️⃣ Dynamic Nested Populate
  // =========================
  if (query.populate) {
    const populateFields = query.populate.split(";").map((f) => f.trim());
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
    populateArray.forEach((p) => (mongooseQuery = mongooseQuery.populate(p)));
  }

  // =========================
  // 7️⃣ Execute Query
  // =========================
  const results = await mongooseQuery;
  // const total = await Model.countDocuments(JSON.parse(queryStr));
  const total = await Model.countDocuments({
    ...JSON.parse(queryStr),
    ...searchConditions,
  });

  return { results, total, page, limit };
};
