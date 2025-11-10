import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  index,
} from "drizzle-orm/pg-core";

export const appointmentServiceTable = pgTable(
  "AppointmentServices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    showTime: integer("showTime"),
    order: integer("order").default(0),
    isRemove: boolean("isRemove").default(false),
    isPublic: boolean("isPublic").default(true),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .notNull()
      .defaultNow(),
    shopId: uuid("ShopId"), // Added based on the index creation
  },
  (table) => ({
    shopIdIndex: index("appointment_services__shop_id").on(table.shopId),
  })
);

export const userTable = pgTable("Users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Convenient TS types
export type AppointmentService = typeof appointmentServiceTable.$inferSelect;
export type NewAppointmentService = typeof appointmentServiceTable.$inferInsert;
export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;
