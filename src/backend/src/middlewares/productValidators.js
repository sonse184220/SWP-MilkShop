import { param, query, validationResult, matchedData } from 'express-validator';

// kiểm tra id data đầu vào cho product
export async function checkProductId(req, res, next) {
    await param("id")
        .trim()
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
