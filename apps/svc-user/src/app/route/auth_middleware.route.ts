import { NextFunction, Router } from 'express';
import { Routes } from '../interface/routes.interface';
import { authMiddleware, authMiddlewareForApi } from '../middleware/auth.middleware';

/**
 * This route should be used for authentication purposes on any other services
 */
class AuthMiddlewareRoute implements Routes {
  public path = '';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }
  /**
   * Initialize the routes for the authentication middleware
   */
  private initializeRoutes() {
    this.router.get(`${this.path}/getAuth`, authMiddlewareForApi);
  }
}

export default AuthMiddlewareRoute;
