import routerUser from "./user.js";
import routerMovie from "./movie.js";

/**
 * @swagger
 * components:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 */

/**
 * @swagger
 * security:
 *  bearerAuth: []
 */

export { routerUser, routerMovie };
