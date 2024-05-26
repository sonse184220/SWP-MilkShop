import { query, validationResult, matchedData } from 'express-validator';
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
