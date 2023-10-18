import DB from '../database/index';
import { CreateClientsDto } from '../dto/clients.dto';
//import { HttpException } from '@exceptions/HttpException';
import { HttpException } from '@athena/shared/exceptions';
import { Clients } from '../interface/clients.interface';
import { isEmpty } from '../util/util';
import { getPagination, getPagingData } from '../util/util';
import { Sequelize, where, Op } from 'sequelize';
import { User } from '../interface/users.interface';
class ClientsService {
  public clients = DB.DBmodels.clients;

  public async findAllClients(): Promise<Clients[]> {
    const allClients: Clients[] = await this.clients.findAll({
      include: 'clientUsers',
    });
    return allClients;
  }

  public async findClientById(clientId: number): Promise<Clients> {
    if (isEmpty(clientId)) throw new HttpException(400, 'clientId is empty');

    const findClient: Clients = await this.clients.findByPk(clientId, {
      include: 'clientUsers',
    });
    if (!findClient) throw new HttpException(409, "Client doesn't exist");

    return findClient;
  }

  public async createClient(clientData: CreateClientsDto): Promise<Clients> {
    if (isEmpty(clientData))
      throw new HttpException(400, 'clientData is empty');

    // Check if a client with the same corporate_group already exists
    const findClient: Clients = await this.clients.findOne({
      where: { corporate_group: clientData.corporate_group },
    });

    // Filter and find the primary contact from the contact_details array
    const contact = clientData.contact_details.filter((data) => {
      return data.is_primary == true;
    });

    // If a client with the same corporate_group already exists, throw an error
    if (findClient)
      throw new HttpException(
        409,
        `This corporate group ${clientData.corporate_group} already exists`
      );

    // Check if the primary email and secondary email are the same, if so, throw an error
    if (contact[0].primary_email === contact[0].secondary_email) {
      throw new HttpException(
        409,
        `primary email and secondary email shouldn't be the same`
      );
    }

    // Find the client with the highest group_id
    const clientObj: any = await this.clients.findOne({
      order: [['group_id', 'DESC']],
    });

    // Generate the new group_id based on the existing highest group_id
    const group_id = clientObj?.group_id == null ? '00001' : clientObj.group_id;
    const group_id1 = '' + clientObj?.group_id;
    let temp = '';

    // Extract the numeric part from the group_id
    for (let i = 0; i < group_id1.length; i++) {
      if (!isNaN(group_id.charAt(0))) {
        temp = temp + group_id[i];
      }
    }

    // Increment the numeric part of the group_id or reset it to 'A0001' if it reaches '99999'
    if (temp === '99999') {
      temp = 'A0001';
    } else {
      const a = parseInt(temp) + 1;
      const temp1 = '' + a;
      temp = group_id.substring(0, group_id.length - temp1.length) + temp1;
    }

    // Set additional properties for the new client
    clientData['group_id'] = temp;
    clientData['primary_email'] = contact[0].primary_email;
    clientData['primary_contact'] =
      `${contact[0].first_name} ${contact[0].last_name}`.toLowerCase();
    clientData['corporate_group'] = clientData.corporate_group
      .toLowerCase()
      .trim();
    clientData['company_name'] = clientData.company_name.toLowerCase().trim();

    // Create the new client record in the database
    const createClientData: Clients = await this.clients.create({
      ...clientData,
    });

    // Return the created client data
    return createClientData;
  }

/**
 * Searches for clients based on the provided search key, page number, and size.
 * @param req - The request object containing the search key, page number, and size.
 * @returns An array of found clients matching the search criteria.
 */
public async searchClient(req): Promise<Clients[]> {
  const { searchKey, pageNo, size } = req;
  const keyword = searchKey;
  const totalClients = await this.clients.count({
    where: {
      deleted_at: null,
    },
  });
  const limit = size;
  const offset = (pageNo - 1) * limit;
  if (keyword && pageNo && size) {
    // Perform a search query based on the keyword
    const response: any = await this.clients
      .findAndCountAll({
        where: {
          [Op.or]: [
            { corporate_group: { [Op.iLike]: `%${keyword}%` } },
            { company_name: { [Op.iLike]: `%${keyword}%` } },
            { primary_contact: { [Op.iLike]: `%${keyword}%` } },
            { primary_email: { [Op.iLike]: `%${keyword}%` } },
          ],
        },
        limit,
        offset,
        distinct: true,
      })
      .then((result) => {
        return result;
      });
    // Format the response data and return it
    const foundClients: any = getPagingData(
      response,
      pageNo,
      limit,
      response.count
    );
    return foundClients;
  } else {
    throw new HttpException(404, 'Either searchKey or pageNo or size is not found');
  }
}

/**
 * Retrieves paginated client data based on the provided request parameters.
 * @param req - The request object containing pagination parameters.
 * @returns An array of clients with pagination information.
 */
public async clientPaginationData(req: any): Promise<Clients[]> {
  // Define default filter parameters
  const defaultFilterParams = {
    company_name: 'all',
    corporate_group: 'DESC',
    primary_contact: 'DESC',
    pageNo: req.pageNo,
    size: req.size,
  };

  // Merge default parameters with the request parameters
  req = { ...defaultFilterParams, ...req };

  // Define a type for the where object
  type FilterObject = {
    company_name?: any;
  };

  // Create an empty object for manipulating the where attributes
  const where: FilterObject = {};

  // Add company_name to the where object if it is not set to 'all'
  if (req.company_name !== 'all') {
    where.company_name = req.company_name;
  }

  // Count the total number of clients based on the provided filters
  const totalClients = await this.clients.count({ where: where });

  // Set the pagination limit and offset
  const limit = req.size;
  const offset = (req.pageNo - 1) * limit;

  // Create an empty array for sorting order
  const order = [];

  // Add sorting order based on the provided parameters (corporate_group or primary_contact)
  if (req.corporate_group) {
    order.push([`corporate_group`, `${req.corporate_group}`]);
  } else if (req.primary_contact) {
    order.push([`primary_contact`, `${req.primary_contact}`]);
  }

  console.log('where', where, order, limit, offset);

  // Retrieve paginated client data from the database
  const response: any = await this.clients.findAndCountAll({
    where: where,
    order,
    limit,
    offset,
    distinct: true,
    include: 'clientUsers',
  });

  console.log('Response query:', response);

  // Get the required data in the proper format for pagination
  const allClients: any = getPagingData(
    response,
    req.pageNo,
    limit,
    response.count
  );

  return allClients;
}


  /**
   * Updates a client with the provided client ID and data.
   * @param clientId - The ID of the client to be updated.
   * @param clientData - The updated data for the client.
   * @returns The updated client data.
   */
  public async updateClient(
    clientId: number,
    clientData: CreateClientsDto
  ): Promise<Clients> {
    if (isEmpty(clientData))
      throw new HttpException(400, 'clientData is empty');
      console.log("////////////////",clientData,clientId)
    // Check if the client exists with the provided client ID
    const findClient: Clients = await this.clients.findByPk(clientId);
    if (!findClient) throw new HttpException(409, "Client doesn't exist");

    // Filter and find the primary contact from the contact_details array
    const contact = clientData.contact_details.filter((data) => {
      return data.is_primary == true;
    });

    // Set the primary email and primary contact fields based on the primary contact data
    clientData['primary_email'] = contact[0].primary_email;
    clientData['primary_contact'] =
      `${contact[0].first_name} ${contact[0].last_name}`.toLowerCase();

    // Normalize and trim the corporate_group and company_name fields
    clientData['corporate_group'] = clientData.corporate_group
      .toLowerCase()
      .trim();
    clientData['company_name'] = clientData.company_name.toLowerCase().trim();
    console.log("////////////////////", clientData)
    // Update the client with the provided data
    await this.clients.update({ ...clientData }, { where: { id: clientId } });

    // Retrieve and return the updated client data
    const updateClient: Clients = await this.clients.findByPk(clientId);
    return updateClient;
  }

  /**
   * Deletes one or multiple clients based on the provided client IDs and deletion type.
   * @param clientId - An array of client IDs to be deleted.
   * @param type - The deletion type ('disable', 'enable', or undefined for permanent deletion).
   * @returns The deleted client data or null.
   */
  public async deleteClient(
    clientId: string[],
    type: string
  ): Promise<Clients> {
    if (clientId.length == 0)
      throw new HttpException(400, 'please provide valid id');

    // Iterate over each client ID and perform the deletion operation
    for (const i in clientId) {
      const findClient: Clients = await this.clients.findByPk(clientId[i]);
      if (!findClient) throw new HttpException(404, "Client doesn't exist");

      // Perform different deletion operations based on the deletion type
      if (type && type == 'disable') {
        await this.clients.update(
          { is_active: false },
          { where: { id: clientId[i] } }
        );
      } else if (type && type == 'enable') {
        await this.clients.update(
          { is_active: true },
          { where: { id: clientId[i] } }
        );
      } else {
        await this.clients.destroy({ where: { id: clientId[i] } });
      }
    }

    return null; // No specific data to return after deletion
  }

  public async getallclients(clients: any): Promise<any> {
    try {
      const finalArray = [];
      clients.forEach((x) => {
        Object.values(x).forEach((y) => finalArray.push(y));
      });
      const findclients: Clients[] = await this.clients.findAll({
        where: { id: { [Op.in]: finalArray } },
      });
      const clientObj = {};
      clients.forEach((x) => {
        Object.entries(x).forEach(([key, value]) => {
          findclients.find((client) => {
            if (Number(client.id) === Number(value)) {
              clientObj[client.id] = client;
            }
          });
        });
      });
        return clientObj;
    } catch (error) {
      console.log('errorrrrr', error);
    }
  }
}

export default ClientsService;
