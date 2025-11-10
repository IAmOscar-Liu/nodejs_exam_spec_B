import { Request, Response } from "express";
import { sendJsonResponse } from "../lib/general"; // Assuming this is a utility function
import appointService from "../service/service";

class ServiceController {
  async getService(req: Request, res: Response) {
    const { id } = req.params;
    const result = await appointService.getService(id);
    sendJsonResponse(res, result);
  }

  async listServices(req: Request, res: Response) {
    const { page, limit } = req.query;
    const result = await appointService.listServices({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    sendJsonResponse(res, result);
  }

  async createService(req: Request, res: Response) {
    const serviceData = req.body;
    const result = await appointService.createService(serviceData);
    sendJsonResponse(res, result);
  }

  async updateService(req: Request, res: Response) {
    const { id } = req.params;
    const serviceData = req.body;
    const result = await appointService.updateService(id, serviceData);
    sendJsonResponse(res, result);
  }

  async deleteService(req: Request, res: Response) {
    const { id } = req.params;
    const result = await appointService.deleteService(id);
    sendJsonResponse(res, result);
  }
}

export default new ServiceController();
