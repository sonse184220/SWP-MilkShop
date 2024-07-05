import { validationResult, matchedData, param } from 'express-validator';

// kiểm tra data đầu vào cho id của member
export async function checkUserId(req, res, next) {
    await param("userId")
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
