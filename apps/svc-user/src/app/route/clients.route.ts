import { NextFunction, Router } from 'express';
import ClientsController from '../controller/clients.controller';
import { CreateClientsDto } from '../dto/clients.dto';
import { Routes } from '../interface/routes.interface';
import { validationMiddleware } from '@athena/shared/middleware';
import { authMiddleware } from '../middleware/auth.middleware';

class ClientsRoute implements Routes {
  public path = '/clients';
  public router = Router();
  public clientsController = new ClientsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // API endpoint to get all clients
    this.router.get(
      `${this.path}/getAllClients`,
      this.clientsController.getClients
    );
    // API endpoint to get a client by ID (requires authentication middleware)
    this.router.get(
      `${this.path}/:id(\\d+)`,
      authMiddleware,
      this.clientsController.getClientById
    );
    /**
     * Route Name: createClient
     * Path: http://localhost:3000/api/users/clients/createClient
     * ReqBody: {
                    "corporate_group": "ABC-Chennai",
                    "company_name": "ABC Company",
                    "contact_details": [
                        {
                        "first_name": "John",
                        "last_name": "Doe",
                        "primary_email": "john.doe@example.com",
                        "secondary_email": "johndoe@gmail.com",
                        "mobile_number": 9876543210,
                        "is_primary": true
                        },
                        {
                        "first_name": "Jane",
                        "last_name": "Smith",
                        "primary_email": "jane.smith@example.com",
                        "secondary_email": "janesmith@gmail.com",
                        "mobile_number": 8765432109,
                        "is_primary": false
                        }
                    ]
                }
     */
    this.router.post(
      `${this.path}/createClient`,
      authMiddleware,
      validationMiddleware(CreateClientsDto, 'body'),
      this.clientsController.createClient
    );
    /**
        Route Name: getClientsBasedOnFilterAndSearch
        Path: http://localhost:3000/api/users/clients/getClients
        Method: POST
        Description: Get clients based on filter and search criteria.
        Request Body:
        {
        "searchKey": "ABC", -> if this is not given it will return pagination
        "pageNo": 1,
        "size": 10
        }
    */
    this.router.post(
      `${this.path}/getClients`,
      authMiddleware,
      this.clientsController.getClientsBasedOnFilterAndSearch
    );
    /**
     * Route Name: updateClient
     * Path: http://localhost:3000/api/users/clients/updateClient/:id(\\d+)
     * ReqBody: {
                    "corporate_group": "ABC-Chennai",
                    "company_name": "ABC Company",
                    "contact_details": [
                        {
                        "first_name": "John",
                        "last_name": "Doe",
                        "primary_email": "john.doe@example.com",
                        "secondary_email": "johndoe@gmail.com",
                        "mobile_number": 9876543210,
                        "is_primary": true
                        },
                        {
                        "first_name": "Jane",
                        "last_name": "Smith",
                        "primary_email": "jane.smith@example.com",
                        "secondary_email": "janesmith@gmail.com",
                        "mobile_number": 8765432109,
                        "is_primary": false
                        }
                    ]
                }
     */
    this.router.put(
      `${this.path}/updateClient/:id(\\d+)`,
      validationMiddleware(CreateClientsDto, 'body', true),
      this.clientsController.updateClient
    );
    /**
        Route Name: deleteClient
        Path: http://localhost:3000/api/users/clients/deleteClient/:id/:type?
        Method: DELETE
        Parameters:
        id (number): The ID(s) of the client(s) to be deleted ([123,124]).
        type (string, optional): The deletion type ('disable', 'enable').
        Request Body: N/A
    */
    this.router.delete(
      `${this.path}/deleteClient/:id/:type?`,
      this.clientsController.deleteClient
    );

    this.router.post(`${this.path}/getclients/all`, authMiddleware, this.clientsController.getAllClients);
  }
}

export default ClientsRoute;
