import { hash } from 'bcrypt';
import DB from '../database/index';
import { CreateRoleDto } from '../dto/roles.dto';
import { HttpException } from '@athena/shared/exceptions';
import { Role } from '../interface/roles.interface';
import { isEmpty } from '../util/util';
import { User } from '../interface/users.interface';
import { module_helpers } from '@athena/shared/common-functions';
import _ from 'lodash';

class RoleService {
  public users = DB.DBmodels.users;
  public roles = DB.DBmodels.roles;

  public async findAllRole(rolesData: User): Promise<Role[]> {
    const name: string =
      rolesData['dataValues'].userRoles[0]['dataValues'].name;
    const allRole: Role[] = await this.roles.findAll();
    let filteredRole;
    if (name == 'Admin') {
      const arr = ['Super Admin', 'Admin'];
      filteredRole = allRole.filter((data) => {
        return !arr.includes(data.name);
      });
    } else if (name == 'Super Admin') {
      filteredRole = allRole.filter((data) => {
        return data.name !== name;
      });
    }
    return filteredRole;
  }

  public async findRoleById(roleId: number): Promise<Role> {
    if (isEmpty(roleId)) throw new HttpException(400, 'RoleId is empty');

    const findRole: Role = await this.roles.findByPk(roleId);
    if (!findRole) throw new HttpException(409, "Role doesn't exist");

    return findRole;
  }

  public async createRole(roleData: CreateRoleDto): Promise<Role> {
    try {
      // Check if the role data is empty
      if (isEmpty(roleData)) throw new HttpException(400, 'Role Data is empty');
  
      // Check if a role with the same name already exists
      const findRole: Role = await this.roles.findOne({
        where: { name: roleData.name },
      });
      if (findRole)
        throw new HttpException(
          409,
          `This role ${roleData.name} already exists`
        );
  
      // Create the permission object for the role
      const finalPayload = await this.createPermissionObject(roleData);
  
      // Create the role with the final payload
      const createRoleData: Role = await this.roles.create(finalPayload);
  
      // Return the created role
      return createRoleData;
    } catch (error) {
      // Throw an HTTP exception with the appropriate status code and error message
      throw new HttpException(400, error.message);
    }
  }
  

  public async updateRole(
    roleId: number,
    roleData: CreateRoleDto
  ): Promise<Role> {
    if (isEmpty(roleData)) throw new HttpException(400, 'Role Data is empty');
    const findRole: Role = await this.roles.findByPk(roleId);
    if (!findRole) throw new HttpException(409, "Role doesn't exist");
    const finalPayload = await this.createPermissionObject(roleData);
    await this.roles.update(finalPayload, { where: { id: roleId } });
    const updateRole: Role = await this.roles.findByPk(roleId);
    return updateRole;
  }

  public async createPermissionObject(roleData: any): Promise<any> {
    try {
      // Initialize arrays and objects
      const modules = [];
      const finalArray = [];
      let finalPayload = {};
  
      // Check if roleData contains permissions
      if (roleData.permissions) {
        // Group permissions by module
        const groupedModules = _.groupBy(
          roleData.permissions,
          (module) => module['menu']
        );
  
        // Iterate over grouped modules
        for (const moduleName in groupedModules) {
          const arrayOfPermissions = [];
  
          // Collect permissions within each module
          for (const element of groupedModules[moduleName]) {
            arrayOfPermissions.push(element);
          }
  
          // Create module object with ordered permissions
          modules.push({
            title: moduleName,
            permissions: _.orderBy(arrayOfPermissions, ['mod_order'], ['asc']),
          });
        }
      }
  
      // Iterate over modules and construct final permission array
      for (const item of modules) {
        item.permissions.map((x) => {
          Object.values(module_helpers[item.title]).find((y) => {
            if (y['name'] === x.name) {
              const actionArr = [];
              const modArr = [];
  
              // Find existing permission object with same subject
              const z = finalArray.find((x) => {
                return x && x['subject'] === y['subject'];
              });
  
              // Update existing permission object or create new one
              if (z) {
                z['action'] = [...z['action'], y['action']];
                z['name'] = [...z['name'], y['name']];
              } else {
                actionArr.push(y['action']);
                modArr.push(y['name']);
  
                const obj = {
                  action: actionArr,
                  subject: y['subject'],
                  name: modArr,
                };
  
                finalArray.push(obj);
              }
            }
          });
        });
      }
  
      // Prepare final payload
      finalPayload = { ...roleData };
      delete finalPayload['permissions'];
      finalPayload['permissions'] = JSON.stringify(finalArray);
  
      // Return the final payload
      return finalPayload;
    } catch (error) {
      // Throw an HTTP exception with the appropriate status code and error message
      throw new HttpException(404, error.message);
    }
  }
  
}

export default RoleService;
