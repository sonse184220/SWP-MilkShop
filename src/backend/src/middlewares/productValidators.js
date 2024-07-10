import { body, param, query, validationResult, matchedData } from 'express-validator';

// kiểm tra id data đầu vào cho product
export async function checkProductId(req, res, next) {
    await param("id")
        .trim()
        .escape()
        .exists().withMessage("ID is required!")
        .notEmpty().withMessage("ID can not be blank!")
        .run(req);
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.params, matchedData(req));
    next();
};
export async function checkProductIdInQuery(req, res, next) {
    await query("productId")
        .trim()
        .escape()
        .exists().withMessage("ID is required!")
        .notEmpty().withMessage("ID can not be blank!")
        .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.params, matchedData(req));
    next();
}

// kiểm tra data đầu vào cho search product
export async function checkProductSearch(req, res, next) {
    await query("name")
        .default("")
        .trim()
        .escape()
        .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }

    Object.assign(req.query, matchedData(req));
    next();
}

// kiểm tra data đầu vào cho search product thuộc brand
export async function checkProductSearchBrand(req, res, next) {
    await query("id")
        .default("")
        .trim()
        .escape()
        .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }

    Object.assign(req.query, matchedData(req));
    next();
}

// kiểm tra data đầu vào để tạo feedback
export async function checkFeedbackData(req, res, next) {
    await body("rating")
        .trim()
        .escape()
        .exists().withMessage("Rating is required!")
        .notEmpty().withMessage("Rating can not be blank!")
        .isInt({ min: 1, max: 5, allow_leading_zeroes: false }).withMessage("Rating must be an integer and between 1 to 5!")
        .run(req);

    await body("content")
        .trim()
        .exists().withMessage("Feedback content is required!")
        .notEmpty().withMessage("Feedback content can not be blank!")
        .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.body, matchedData(req));
    next();
}

// kiểm tra id data đầu vào cho feedback
export async function checkFeedbackId(req, res, next) {
    await param("id")
        .trim()
        .escape()
        .exists().withMessage("FeedbackID is required!")
        .notEmpty().withMessage("FeedbackID can not be blank!")
        .isInt({ allow_leading_zeroes: false }).withMessage("FeedbackID must be a number!")
        .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.params, matchedData(req));
    next();
}

export async function checkFeedbackSearchInput(req, res, next) {
    await query("content")
    .default("")
    .trim()
    .run(req);

    await query("fuid")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .run(req);

    await query("fpid")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .run(req);

    const filterList = ["user", "product", "user&product"]
    await query("filter")
    .optional({ values: "falsy" })
    .trim()
    .toLowerCase()
    .isIn(filterList).withMessage(`Invalid filter input! filter can only be: ${filterList.join(", ")}`)
    .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.query, matchedData(req));
    next();
}

export const checkProductData = async (req, res, next) => {
    await body('BrandID')
        .exists().withMessage('BrandID is required')
        .notEmpty().withMessage('BrandID cannot be empty')
        .trim()
        .escape()
        .run(req);

    await body('Name')
        .exists().withMessage('Name is required')
        .notEmpty().withMessage('Name cannot be empty')
        .trim()
        .escape()
        .run(req);

    await body('Price')
        .exists().withMessage('Price is required')
        .isInt({ min: 0 }).withMessage('Price must be a positive integer')
        .run(req);

    await body('Expiration')
        .optional({ checkFalsy: true })
        .isISO8601().withMessage('Expiration date must be a valid date')
        .toDate()
        .run(req);

    await body('Quantity')
        .exists().withMessage('Quantity is required')
        .isInt({ min: 0 }).withMessage('Quantity must be a positive integer')
        .run(req);

    await body('Content')
        .optional({ checkFalsy: true })
        .trim()
        .escape()
        .run(req);

    await body('Status')
        .exists().withMessage('Status is required')
        .notEmpty().withMessage('Status cannot be empty')
        .trim()
        .escape()
        .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.body, matchedData(req));
    next();
};