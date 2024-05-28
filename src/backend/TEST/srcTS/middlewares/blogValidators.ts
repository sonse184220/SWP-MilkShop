import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult, matchedData, param } from 'express-validator';

// kiểm tra id data đầu vào cho blog
export async function checkBlogId(req: Request, res: Response, next: NextFunction) {
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
  
  // kiểm tra data đầu vào cho search blog
  export async function checkBlogSearch(req: Request, res: Response, next: NextFunction) {
    await query("n")
    .if((value) => {value == null})
    .customSanitizer(() => {return ""})
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