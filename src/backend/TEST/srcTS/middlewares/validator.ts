import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult, matchedData } from 'express-validator';

// kiểm tra string đầu vào, đảm bảo không undefined hay null và không có dấu cách 2 bên
export async function checkSearchString(req: Request, res: Response, next: NextFunction) {
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