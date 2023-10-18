import { NextFunction, Request, Response } from 'express';
import { CreateRoleDto } from '../dto/roles.dto';
import { Role } from '../interface/roles.interface';
import roleService from '../service/roles.service';
import { RequestWithUser } from '../interface/auth.interface';
import {
  responseCF,
  bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';
class RolesController {
  public roleService = new roleService();

  public getRoles = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const rolesData = req.user;
      const findAllRolesData: Role[] = await this.roleService.findAllRole(rolesData);
      const response = responseCF(
        bodyCF({
          val: findAllRolesData,
          code: '600',
          status: 'success',
          message: `Get Roles Successfully`,
        })
      );
      return res.json(response)
    } catch (error) {
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '611',
          status: 'error',
          message: `${error.message},error in getting roles`,
        })
      );
      return res.json(response)
    }
  };

  public getRoleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId = Number(req.params.id);
      const findOneRoleData: Role = await this.roleService.findRoleById(roleId);
      const response = responseCF(
        bodyCF({
          val: findOneRoleData,
          code: '600',
          status: 'success',
          message: `Get Role Successfully`,
        })
      );
      return res.json(response)
    } catch (error) {
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '611',
          status: 'error',
          message: `${error.message},error in getting roles`,
        })
      );
      return res.json(response)
    }
  };

  public createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleData: CreateRoleDto = req.body;
      const createRoleData: Role = await this.roleService.createRole(roleData);
      const response = responseCF(
        bodyCF({
          val: createRoleData,
          code: '600',
          status: 'success',
          message: `Role Created Successfully`,
        })
      );
      return res.json(response);
    } catch (error) { 
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '611',
          status: 'error',
          message: `${error.message},error in creating role`,
        })
      );
      return res.json(response)
    }
  };

  public updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId = Number(req.params.id);
      const roleData: CreateRoleDto = req.body;
      const updateRoleData: Role = await this.roleService.updateRole(roleId, roleData);

      const response = responseCF(
        bodyCF({
          val: updateRoleData,
          code: '600',
          status: 'success',
          message: `Role Updated Successfully`,
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '611',
          status: 'error',
          message: `${error.message},error in updating role`,
        })
      );
      return res.json(response)
    }
  };
}

export default RolesController;
