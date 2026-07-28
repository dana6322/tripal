import type { Request, Response, NextFunction } from "express";
import type { AnySchema } from "yup";
import { ValidationError } from "../utils/errors";

type ValidationSchemas = {
  query?: AnySchema;
  body?: AnySchema;
  params?: AnySchema;
};

export const validate = (schemas: ValidationSchemas) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.query) {
        req.validatedQuery = await schemas.query.validate(req.query, {
          abortEarly: false,
          stripUnknown: true,
        });
      }
      if (schemas.body) {
        req.validatedBody = await schemas.body.validate(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });
      }
      if (schemas.params) {
        req.validatedParams = await schemas.params.validate(req.params, {
          abortEarly: false,
          stripUnknown: true,
        });
      }
      next();
    } catch {
      next(new ValidationError());
    }
  };
