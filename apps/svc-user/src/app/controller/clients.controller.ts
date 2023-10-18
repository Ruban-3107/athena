import { NextFunction, Request, Response } from 'express';
import { CreateClientsDto } from '../dto/clients.dto';
import { Clients } from '../interface/clients.interface';
import clientsService from '../service/clients.service';
import {
  responseCF,
  bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';
import { RequestWithUser } from '../interface/auth.interface';
import { User } from '../interface/users.interface';
  class ClientsController {
  public clientsService = new clientsService();

  public getClients = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllClientsData: Clients[] =
        await this.clientsService.findAllClients();
      const response = responseCF(
        bodyCF({
          val: findAllClientsData,
          code: '600',
          status: 'success',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      console.log(error);
      return res.json(response);
    }
  };

  public getClientById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const clientId = Number(req.params.id);
      const findOneClientData: Clients =
        await this.clientsService.findClientById(clientId);

      const response = responseCF(
        bodyCF({
          val: findOneClientData,
          code: '600',
          status: 'success',
        })
      );

      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          val: error,
          code: '611',
          status: 'error',
        })
      );

      return res.json(response);
    }
  };

  public createClient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const clientData: CreateClientsDto = req.body;
      const createClientData: Clients = await this.clientsService.createClient(
        clientData
      );
      const response = responseCF(
        bodyCF({
          val: createClientData,
          code: '600',
          status: 'success',
        })
      );

      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      console.log(error);

      return res.json(response);

      // res.status(404).json({ message: error.message, code: error.status, status: "error" });
      next(error);
    }
  };

  /**
   * Retrieves clients based on the provided filter and search criteria.
   * @param req - The request object containing filter and search parameters.
   * @param res - The response object to send the retrieved client data.
   * @param next - The next function to handle errors.
   * @returns The response containing the retrieved client data.
   */
  public getClientsBasedOnFilterAndSearch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Check if a search key is provided
      if (req.body.searchKey) {
        // Search for clients based on the provided search criteria
        const foundClientsData: Clients[] =
          await this.clientsService.searchClient(req.body);

        // Prepare the response with the found client data
        const response = responseCF(
          bodyCF({
            val: { clientData: foundClientsData },
            code: '600',
            status: 'success',
          })
        );

        // Return the response with the found client data
        return res.json(response);
      } else {
        // Retrieve and sort client data based on the provided filter criteria
        const sortClientData: Clients[] =
          await this.clientsService.clientPaginationData(req.body);

        // Prepare the response with the sorted client data
        const response = responseCF(
          bodyCF({
            val: { clientData: sortClientData },
            code: '601',
            status: 'success',
          })
        );

        // Return the response with the sorted client data
        return res.json(response);
      }
    } catch (error) {
      // Handle and return an error response if an error occurs
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );

      console.log(error);

      // Return the error response
      return res.json(response);
    }
  };

  public updateClient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const clientId = Number(req.params.id);
      const clientData: CreateClientsDto = req.body;
      
      const updateClientData: Clients = await this.clientsService.updateClient(
        clientId,
        clientData
      );
      const response = responseCF(
        bodyCF({
          val: updateClientData,
          code: '600',
          status: 'success',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          message: error.message,
          code: '611',
          status: 'error',
        })
      );
      console.log(error);
      return res.json(response);
    }
  };

  /**
   * Deletes one or multiple clients based on the provided client IDs and deletion type.
   * @param req - The request object containing the client IDs and deletion type.
   * @param res - The response object used to send the API response.
   * @param next - The next function used to pass the control to the next middleware.
   * @returns The response containing the deleted client data or an error message.
   */
  public deleteClient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const clientIdArray = req.params.id
        .slice(1, req.params.id.length - 1)
        .split(','); // id should be like this -> [123,124]
      const type = req.params.type;
      // Delete the client(s) based on the provided client IDs and deletion type
      const deleteClientData: Clients = await this.clientsService.deleteClient(
        clientIdArray,
        type
      );

      // Prepare the response
      const response = responseCF(
        bodyCF({
          val: { clientData: deleteClientData },
          code: '600',
          status: 'success',
          message: 'Corporate Group deleted successfully',
        })
      );
      return res.json(response);
    } catch (error) {
      // Handle any errors that occur during the deletion process
      const response = responseCF(
        bodyCF({ message: error.message, code: '611', status: 'error' })
      );
      return res.json(response);
    }
  };

  public getAllClients = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const clientData = await this.clientsService.getallclients(req.body.clients);
      const response = responseCF(
        bodyCF({
          code: '600',
          val: clientData,
          status: 'success',
          message: 'All Requested Users',
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          code: '611',
          status: 'error',
          message: error.message,
        })
      );
      console.log(error);
      return res.json(response);
    }
  };
}

export default ClientsController;
