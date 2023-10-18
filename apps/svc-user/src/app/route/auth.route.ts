import { NextFunction, Request, Response, Router } from 'express';
import AuthController from '../controller/auth.controller';
import { setPasswordDto, SignInDto, SignUpDto } from '../dto/auth.dto';
import { Routes } from '../interface/routes.interface';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '@athena/shared/middleware';

class AuthRoute implements Routes {
  public path = '';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    console.log('****auth route triggered****');
    /**
     * Route Name: SignUp
     * Path: http://localhost:3000/api/users/signUp
     * ReqBody: {
                    "email": "user@email.com",
                    "first_name": "user",
                    "last_name": "one",
                    "phone_number": "+91 7777777777"
                }    
     */
    this.router.post(
      `${this.path}/signUp`,
      validationMiddleware(SignUpDto, 'body'),
      this.authController.signUp
    );
    /**
     * Route Name: SignIn
     * Path: http://localhost:3000/api/users/signIn
     * ReqBody: {
                    "email": "user@mail.com", //can either be phone number or email
                    "password": "eulb8y-N"
                }
     */
    this.router.post(
      `${this.path}/signIn`,
      (req: Request, res: Response, next: NextFunction) => {
        next();
      },
      validationMiddleware(SignInDto, 'body'),
      this.authController.signIn
    );
    /**
     * Route Name: sendOtp
     * Path: http://localhost:3000/api/users/sendOtp
     * ReqBody: {
                  "input": "user@email.com"  
                }
     */
    this.router.post(`${this.path}/sendOtp`, this.authController.sendOtp);
    /**
     * Route Name: verifyOtp 
     * Path: http://localhost:3000/api/users/verifyOtp
     * ReqBody: {
                  "input":"user@email.com",
                  "otp":  2132
                }
     */
    this.router.post(`${this.path}/verifyOtp`, this.authController.verifyOtp);
    this.router.post(
      `${this.path}/verifyRefreshToken`,
      authMiddleware,
      this.authController.verifyRefreshToken
    );
    this.router.post(
      `${this.path}/validateToken`,
      this.authController.validateToken
    );
    /**
     * Route Name: forgotPassword 
     * Path: http://localhost:3000/api/users/forgotPassword
     * ReqBody: {
                    "email": "user@email.com"
                }
     */
    this.router.put(
      `${this.path}/forgotPassword`,
      this.authController.forgotPassword
    );
    /**
     * Route Name: resetPassword 
     * Path: http://localhost:3000/api/users/resetPassword
     * Comments: This is dependent on forgotPassword API
     * ReqBody: {
                    "token": "token retrieved from forgotPassword",
                    "confirmPassword": "******"
                }
     */
    this.router.post(
      `${this.path}/resetPassword`,
      this.authController.resetPassword
    );
    /**
     * Route Name: setPassword
     * Path: http://localhost:3000/api/users/setPassword
     * ReqBody: {
                    "old_password":"J3smSPTc",
                    "password": "Clem980509*",
                    "confirm_password": "Clem980509*"
                }
     */
    this.router.post(
      `${this.path}/setPassword`,
      authMiddleware,
      validationMiddleware(setPasswordDto, 'body'),
      this.authController.setPassword
    );
    this.router.post(
      `${this.path}/signOut`,
      authMiddleware,
      this.authController.signOut
    );
    this.router.post(
      `${this.path}/getTokenById`,
      this.authController.createTokenById
    );
  }
}

export default AuthRoute;
