import { handleServiceError } from "../lib/error";
import {
  createService,
  deleteService,
  getService,
  ListServiceParams,
  listServices,
  updateService,
} from "../repository/service";
import { ServiceResponse } from "../type/general";

class AppointmentService {
  async getService(
    serviceId: string
  ): Promise<ServiceResponse<Awaited<ReturnType<typeof getService>>>> {
    try {
      const service = await getService(serviceId);
      if (service) {
        return { success: true, data: service };
      } else {
        return {
          success: false,
          statusCode: 404,
          message: "Service not found",
        };
      }
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async listServices(
    params: ListServiceParams
  ): Promise<ServiceResponse<Awaited<ReturnType<typeof listServices>>>> {
    try {
      const services = await listServices(params);
      if (services) {
        return { success: true, data: services };
      } else {
        return {
          success: false,
          statusCode: 404,
          message: "Services not found",
        };
      }
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async createService(
    serviceData: Parameters<typeof createService>[0]
  ): Promise<ServiceResponse<Awaited<ReturnType<typeof createService>>>> {
    try {
      const service = await createService(serviceData);
      if (service) {
        return { success: true, data: service };
      } else {
        return {
          success: false,
          statusCode: 404,
          message: "Service creation failed",
        };
      }
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async updateService(
    serviceId: string,
    serviceData: Parameters<typeof updateService>[1]
  ): Promise<ServiceResponse<Awaited<ReturnType<typeof updateService>>>> {
    try {
      const service = await updateService(serviceId, serviceData);
      if (service) {
        return { success: true, data: service };
      } else {
        return {
          success: false,
          statusCode: 404,
          message: "Service update failed",
        };
      }
    } catch (error) {
      return handleServiceError(error);
    }
  }

  async deleteService(
    serviceId: string
  ): Promise<ServiceResponse<Awaited<ReturnType<typeof deleteService>>>> {
    try {
      const service = await deleteService(serviceId);
      if (service) {
        return { success: true, data: service };
      } else {
        return {
          success: false,
          statusCode: 404,
          message: "Service delete failed",
        };
      }
    } catch (error) {
      return handleServiceError(error);
    }
  }
}

export default new AppointmentService();
