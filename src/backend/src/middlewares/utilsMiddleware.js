import { body, param, query, validationResult, matchedData } from 'express-validator';

export async function checkPaginationQuery(req, res, next) {
    await query("limit")
        .default("20")
        .isInt({ min: 1, allow_leading_zeroes: false }).withMessage("Invalid limit input! limit must be an integer number and no less than 1")
        .trim()
        .escape()
        .run(req);

    await query("page")
        .default("1")
        .isInt({ min: 1, allow_leading_zeroes: false }).withMessage("Invalid page input! page must be an integer number and no less than 1")
        .trim()
        .escape()
        .run(req);

    const sortList = ["newest", "oldest", "highest", "lowest"];
    await query("sort")
        .default("newest")
        .trim()
        .escape()
        .toLowerCase()
        .isIn(sortList).withMessage(`Invalid sort input! sort can only be: ${sortList}`)
        .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    
    Object.assign(req.query, matchedData(req));
    next();
}