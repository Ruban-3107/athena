import { Router } from 'express';
import ProviderController from '../controller/certifications_provider.controller';
import {
  CreateCertificationsProviderDto,
  UpdateCertificationsProviderDto,
} from '../dto/certifications_provider.dto';
import { Routes } from '../interface/routes.interface';
import { validationMiddleware } from '@athena/shared/middleware';
import CertificationProviderController from '../controller/certifications_provider.controller';

class CertificationProviderRoute implements Routes {
  public path = '/certification_providers';
  public router = Router();
  public certificationProviderController =
    new CertificationProviderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * Route Name: getProvider
     * Path: http://localhost:3000/api/certificationProviders
     * Method: GET
     * Description: Retrieves a list of certification providers.
     */

    this.router.get(
      `${this.path}`,
      this.certificationProviderController.getProvider
    );

    /**
     * Route Name: getProviderById
     * Path: http://localhost:3000/api/certificationProviders/:id
     * Method: GET
     * Description: Retrieves a specific certification provider by its ID.
     * Params:
     *   - id: A numeric ID representing the certification provider.
     */

    this.router.get(
      `${this.path}/:id(\\d+)`,
      this.certificationProviderController.getProviderById
    );

    /**
     * Route Name: createCertificationProvider
     * Path: http://localhost:3000/api/certificationProviders/createCertificationProvider
     * Method: POST
     * Description: Creates a new certification provider.
     * ReqBody: {
     *   "logo": "example_logo",
     *   "label": "example_label",
     *   "value": "example_value"
     * }
     * Middleware:
     *   - validationMiddleware: Validates the request body using the CreateCertificationsProviderDto class.
     */

    this.router.post(
      `${this.path}`,
      validationMiddleware(CreateCertificationsProviderDto, 'body'),
      this.certificationProviderController.createCertificationProvider
    );

    /**
     * Route Name: updateProvider
     * Path: http://localhost:3000/api/certificationProviders/:id
     * Method: PUT
     * Description: Updates an existing certification provider by its ID.
     * Params:
     *   - id: A numeric ID representing the certification provider to be updated.
     * ReqBody: {
     *   "logo": "example_logo",
     *   "label": "example_label",
     *   "value": "example_value"
     * }
     * Middleware:
     *   - validationMiddleware: Validates the request body using the UpdateCertificationsProviderDto class.
     */

    this.router.put(
      `${this.path}/:id(\\d+)`,
      validationMiddleware(UpdateCertificationsProviderDto, 'body', true),
      this.certificationProviderController.updateProvider
    );

    /**
     * Route Name: deleteProvider
     * Path: http://localhost:3000/api/certificationProviders/deleteCertificationProvider/:id
     * Method: DELETE
     * Description: Deletes a specific certification provider by its ID.
     * Params:
     *   - id: A numeric ID representing the certification provider to be deleted.
     */

    this.router.delete(
      `${this.path}/deleteCertificationProvider/:id(\\d+)`,
      this.certificationProviderController.deleteProvider
    );
  }
}

export default CertificationProviderRoute;
