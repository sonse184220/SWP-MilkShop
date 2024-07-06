import { body, param, query, validationResult, matchedData } from 'express-validator';

export async function checkOrderId(req, res, next) {
    await param("orderId")
        .trim()
        .escape()
        .exists().withMessage("OrderID is required!")
        .notEmpty().withMessage("OrderID can not be blank!")
        .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.params, matchedData(req));
    next();
}

export async function checkOrderInputStatus(req, res, next) {
    const statusList = ["Waiting", "Cancelled", "Shipping", "Done"];

    await body("status")
    .trim()
    .escape()
    .exists().withMessage("Status is required!")
    .notEmpty().withMessage("Status can not be blank!")
    .isIn(statusList).withMessage(`Invalid status input! status can only be: ${statusList.join(", ")}`)
    .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.params, matchedData(req));
    next();
}