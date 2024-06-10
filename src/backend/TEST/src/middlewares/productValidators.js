import { body, query, validationResult, matchedData, param } from 'express-validator';
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
}
// kiểm tra data đầu vào cho search product
export async function checkProductSearch(req, res, next) {
    await query("name")
        .default("")
        .trim()
        .escape()
        .run(req);
    await query("limit")
        .default("20")
        .isInt({ min: 1, allow_leading_zeroes: false }).withMessage("invalid limit input! limit must be an integer number and no less than 1")
        .trim()
        .escape()
        .run(req);
    await query("page")
        .default("1")
        .isInt({ min: 1, allow_leading_zeroes: false }).withMessage("invalid page input! page must be an integer number and no less than 1")
        .trim()
        .escape()
        .run(req);
    const sortList = ["newest", "oldest", "highest", "lowest"];
    await query("sort")
        .default("newest")
        .trim()
        .escape()
        .toLowerCase()
        .isIn(sortList).withMessage(`invalid sort input! sort can only be: ${sortList}`)
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
    await query("limit")
        .default("20")
        .isInt({ min: 1, allow_leading_zeroes: false }).withMessage("invalid limit input! limit must be an integer number and no less than 1")
        .trim()
        .escape()
        .run(req);
    await query("page")
        .default("1")
        .isInt({ min: 1, allow_leading_zeroes: false }).withMessage("invalid page input! page must be an integer number and no less than 1")
        .trim()
        .escape()
        .run(req);
    const sortList = ["newest", "oldest", "highest", "lowest"];
    await query("sort")
        .default("newest")
        .trim()
        .escape()
        .toLowerCase()
        .isIn(sortList).withMessage(`invalid sort input! sort can only be: ${sortList}`)
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
    await body("userId")
        .trim()
        .escape()
        .exists().withMessage("UserID is required!")
        .notEmpty().withMessage("UserID can not be blank!")
        .run(req);
    await body("rating")
        .trim()
        .escape()
        .exists().withMessage("Rating is required!")
        .notEmpty().withMessage("Rating can not be blank!")
        .isInt({ min: 1, max: 5, allow_leading_zeroes: false }).withMessage("Rating must be an integer and between 1 to 5!")
        .run(req);
    await body("content")
        .trim()
        .escape()
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
