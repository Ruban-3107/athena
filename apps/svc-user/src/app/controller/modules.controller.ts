import { NextFunction, Request, Response } from 'express';
import { CreateModuleDto } from '../dto/modules.dto';
import { module } from '../interface/modules.interface';
import ModuleService from '../service/modules.service';
import {
  responseCF,
  bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';

class ModulesController {
  public ModuleService = new ModuleService();

  public getModules = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllModulesData: module[] =
        await this.ModuleService.findAllModule();
      if (findAllModulesData.length) {
        const response = responseCF(
          bodyCF({
            val: findAllModulesData,
            code: '600',
            status: 'success',
            message: `Get modules Successfully`,
          })
        );
        return res.json(response);
      } else {
        const response = responseCF(
          bodyCF({
            val: 'error',
            code: '611',
            status: 'error',
            message: `No modules found`,
          })
        );
        return res.json(response);
      }
    } catch (error) {
      const response = responseCF(
        bodyCF({
          val: 'error',
          code: '625',
          status: 'error',
          message: `${error.message},error in get modules`,
        })
      );
      return res.json(response);
    }
  };
}

export default ModulesController;
