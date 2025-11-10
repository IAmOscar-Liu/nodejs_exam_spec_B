import { and, count, eq, sql } from "drizzle-orm";

import * as schema from "../db/schema";
import db from "../lib/initDB";

export async function getService(
  serviceId: string
): Promise<schema.AppointmentService> {
  const [service] = await db
    .select()
    .from(schema.appointmentServiceTable)
    .where(
      and(
        eq(schema.appointmentServiceTable.isRemove, false),
        eq(schema.appointmentServiceTable.id, serviceId)
      )
    );
  return service;
}

export async function createService(
  serviceData: Omit<
    schema.NewAppointmentService,
    "id" | "isRemove" | "createdAt" | "updatedAt"
  >
) {
  const [newService] = await db
    .insert(schema.appointmentServiceTable)
    .values(serviceData)
    .returning();
  console.log("New service created:", newService.id);
  return newService;
}

export async function updateService(
  serviceId: string,
  serviceData: Omit<
    Partial<schema.AppointmentService>,
    "id" | "isRemove" | "createdAt" | "updatedAt"
  >
) {
  const [updatedService] = await db
    .update(schema.appointmentServiceTable)
    .set(serviceData)
    .where(
      and(
        eq(schema.appointmentServiceTable.isRemove, false),
        eq(schema.appointmentServiceTable.id, serviceId)
      )
    )
    .returning();
  console.log("Service updated:", updatedService.id);
  return updatedService;
}

export async function deleteService(serviceId: string) {
  const [deletedService] = await db
    .update(schema.appointmentServiceTable)
    .set({ isRemove: true })
    .where(eq(schema.appointmentServiceTable.id, serviceId))
    .returning();
  console.log("Service deleted:", deletedService.id);
  return deletedService;
}

export interface ListServiceParams {
  page?: number;
  limit?: number;
}

export async function listServices({
  page = 1,
  limit = 10,
}: ListServiceParams) {
  const offset = (page - 1) * limit;
  const totalResult = await db
    .select({ total: count() })
    .from(schema.appointmentServiceTable);

  const total = totalResult[0].total;
  const totalPages = Math.ceil(total / limit);

  const services = await db.query.appointmentServiceTable.findMany({
    offset,
    limit,
    orderBy: (services, { desc }) => [desc(services.createdAt)],
  });

  return {
    services,
    total,
    page,
    limit,
    totalPages,
  };
}
