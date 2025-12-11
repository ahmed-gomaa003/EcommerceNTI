export const pagination =
  (model, populateFields = "") =>
  async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      isDeleted: false,
      isActivated: true,
      stock: { $gt: 0 },
    };

    const sortOrder = {
      stock: -1,
      price: 1,
    };

    const [results, total] = await Promise.all([
      model
        .find(query)
        .populate(populateFields)
        .sort(sortOrder)
        .skip(skip)
        .limit(limit),

      model.countDocuments(query),
    ]);

    res.paginatedResult = {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalResult: total,
      results,
    };

    next();
  };
