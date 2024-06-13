import { deepStrictEqual } from 'assert';
import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult, matchedData, param } from 'express-validator';
import { setDefaultAutoSelectFamily } from 'net';

// kiểm tra data đầu vào cho id của member
export async function checkMemberId(req: Request, res: Response, next: NextFunction) {
  await param("id")
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