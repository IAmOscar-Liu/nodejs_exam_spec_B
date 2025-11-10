import { Router } from "express";
import ServiceController from "../controller/service";
import ServiceMiddleware from "../middleware/service";
import isAuth from "../middleware/isAuth";

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     AppointmentService:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The service's unique identifier.
 *         name:
 *           type: string
 *           description: The name of the service.
 *         description:
 *           type: string
 *           description: A description of the service.
 *         price:
 *           type: integer
 *           description: The price of the service.
 *         showTime:
 *           type: integer
 *           description: The time to show for the service.
 *         order:
 *           type: integer
 *           description: The display order of the service.
 *         isPublic:
 *           type: boolean
 *           description: Whether the service is publicly visible.
 *         shopId:
 *           type: string
 *           format: uuid
 *           description: The ID of the shop this service belongs to.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the service was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the service was last updated.
 *
 *     CreateServiceInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the service.
 *         description:
 *           type: string
 *           description: A description of the service.
 *         price:
 *           type: integer
 *           description: The price of the service.
 *         showTime:
 *           type: integer
 *           description: The time to show for the service.
 *         order:
 *           type: integer
 *           description: The display order of the service.
 *         isPublic:
 *           type: boolean
 *           description: Whether the service is publicly visible.
 *         shopId:
 *           type: string
 *           format: uuid
 *           description: The ID of the shop this service belongs to.
 *
 *     UpdateServiceInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the service.
 *         description:
 *           type: string
 *           description: A description of the service.
 *         price:
 *           type: integer
 *           description: The price of the service.
 *         showTime:
 *           type: integer
 *           description: The time to show for the service.
 *         order:
 *           type: integer
 *           description: The display order of the service.
 *         isPublic:
 *           type: boolean
 *           description: Whether the service is publicly visible.
 *         shopId:
 *           type: string
 *           format: uuid
 *           description: The ID of the shop this service belongs to.
 */

/**
 * @swagger
 * /api/service/list:
 *   get:
 *     tags: [Service]
 *     summary: List all appointment services
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page.
 *     responses:
 *       200:
 *         description: A paginated list of services.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     services:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AppointmentService'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get("/list", ServiceController.listServices);

/**
 * @swagger
 * /api/service/{id}:
 *   get:
 *     tags: [Service]
 *     summary: Get a single service by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the service to retrieve.
 *     responses:
 *       200:
 *         description: The requested service.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentService'
 *       400:
 *         description: Invalid service ID format.
 *       404:
 *         description: Service not found.
 */
router.get("/:id", ServiceMiddleware.getService, ServiceController.getService);

/**
 * @swagger
 * /api/service:
 *   post:
 *     tags: [Service]
 *     summary: Create a new service
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceInput'
 *     responses:
 *       200:
 *         description: The created service.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentService'
 *       400:
 *         description: Bad Request - Invalid input data.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 */
router.post(
  "/",
  // isAuth,
  ServiceMiddleware.createService,
  ServiceController.createService
);

/**
 * @swagger
 * /api/service/{id}:
 *   put:
 *     tags: [Service]
 *     summary: Update an existing service
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the service to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateServiceInput'
 *     responses:
 *       200:
 *         description: The updated service.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentService'
 *       400:
 *         description: Bad Request - Invalid ID or input data.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       404:
 *         description: Service not found.
 */
router.put(
  "/:id",
  isAuth,
  ServiceMiddleware.updateService,
  ServiceController.updateService
);

/**
 * @swagger
 * /api/service/{id}:
 *   delete:
 *     tags: [Service]
 *     summary: Delete a service (soft delete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the service to delete.
 *     responses:
 *       200:
 *         description: The service that was marked as deleted.
 *       400:
 *         description: Invalid service ID format.
 *       401:
 *         description: Unauthorized - Token is missing or invalid.
 *       404:
 *         description: Service not found.
 */
router.delete(
  "/:id",
  isAuth,
  ServiceMiddleware.deleteService,
  ServiceController.deleteService
);

export default router;
