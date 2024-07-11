import { body, param, query, validationResult, matchedData } from 'express-validator';

export async function checkBrandId(req, res, next) {
    await param("brandId")
    .trim()
    .escape()
    .exists().withMessage("BrandID is required!")
    .notEmpty().withMessage("BrandID can not be blank!")
    .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.param, matchedData(req));
    next();
}

export async function checkBrandData(req, res, next) {
    await body("brandName")
    .trim()
    .exists().withMessage("Brand name is required!")
    .notEmpty().withMessage("Brand name can not be blank!")
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