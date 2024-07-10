import { body, param, query, validationResult, matchedData } from 'express-validator';

export async function checkPaginationQueryForUserReport(req, res, next) {
    await query("limit")
    .default("30")
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

    const sortList = ["newest", "oldest", "recent", "past"];
    await query("sort")
    .default("newest")
    .trim()
    .escape()
    .toLowerCase()
    .isIn(sortList).withMessage(`Invalid sort input! sort can only be: ${sortList.join(", ")}`)
    .run(req);

    const statusList = ["open", "closed"];
    await query("status")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .toLowerCase()
    .isIn(statusList).withMessage(`Invalid status input! status can only be: ${statusList.join(", ")}`)
    .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    
    Object.assign(req.query, matchedData(req));
    next();
}

export async function checkUserReportSubmitData(req, res, next) {
    const typeList = ["order", "preorder"]
    await body("orderType")
    .trim()
    .escape()
    .exists().withMessage("Order type is required!")
    .notEmpty().withMessage("Order type can not be blank!")
    .isIn(typeList).withMessage(`Order type must either be: ${typeList.join(", ")}`)
    .run(req);

    await body("orderId")
    .if((value, {req}) => {req.body.orderType === "order"})
    .trim()
    .escape()
    .exists().withMessage("OrderID is required!")
    .notEmpty().withMessage("OrderID can not be blank!")
    .run(req);

    await body("preorderId")
    .if((value, {req}) => {req.body.orderType === "preorderId"})
    .trim()
    .escape()
    .exists().withMessage("PreorderID is required!")
    .notEmpty().withMessage("PreorderID can not be blank!")
    .run(req);

    await body("title")
    .trim()
    .exists().withMessage("Title is required!")
    .notEmpty().withMessage("Title can not be blank!")
    .run(req);

    await body("content")
    .trim()
    .exists().withMessage("Content is required!")
    .notEmpty().withMessage("Content can not be blank!")
    .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.body, matchedData(req));
    next();
}