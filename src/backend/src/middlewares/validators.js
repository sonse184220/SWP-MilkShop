import { query, validationResult, matchedData } from 'express-validator';

// kiểm tra data đầu vào cho search product
export async function checkPSearchString(req, res, next) {
    await query("n")
        .customSanitizer((value) => {
        if (value === undefined || null) {
            value = "";
        }
        return value;
    })
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
