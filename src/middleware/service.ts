import { NextFunction, Request, Response } from "express";
import { ZodError, z } from "zod";
import { CustomError } from "../lib/error";
import { isUUID } from "../lib/general";

const createServiceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().int().positive("Price must be a positive integer"),
  showTime: z.number().int().positive().optional(),
  order: z.number().int().optional(),
  isPublic: z.boolean().optional(),
  shopId: z.string().uuid("Invalid Shop ID format").optional(),
});

// For updates, all fields are optional
const updateServiceSchema = createServiceSchema.partial();

// Type for validated data
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;

class ServiceMiddleware {
  async getService(req: Request, _: Response, next: NextFunction) {
    const { id } = req.params;
    if (!isUUID(id)) return next(new CustomError("Invalid service id", 400));
    next();
  }

  async createService(req: Request, _: Response, next: NextFunction) {
    try {
      // Validate and replace req.body with the parsed (and typed) data
      req.body = createServiceSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new CustomError(error.issues[0].message, 400));
      }
      next(error);
    }
  }

  async updateService(req: Request, _: Response, next: NextFunction) {
    const { id } = req.params;
    if (!isUUID(id)) return next(new CustomError("Invalid service id", 400));
    try {
      req.body = updateServiceSchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new CustomError(error.issues[0].message, 400));
      }
      next(error);
    }
  }

  async deleteService(req: Request, _: Response, next: NextFunction) {
    const { id } = req.params;
    if (!isUUID(id)) return next(new CustomError("Invalid service id", 400));
    next();
  }
}

export default new ServiceMiddleware();
