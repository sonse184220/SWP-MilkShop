import { body, param, query, validationResult, matchedData } from 'express-validator';

export async function checkOrderId(req, res, next) {
    await param("id")
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