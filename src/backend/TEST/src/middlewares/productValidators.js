import { query, validationResult, matchedData, param } from 'express-validator';
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
    await query("n")
        .if((value) => { value == null; })
        .customSanitizer(() => { return ""; })
        .run(req);
    await query("n")
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
