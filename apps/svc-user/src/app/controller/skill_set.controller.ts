import { NextFunction, Request, Response } from 'express';
import { CreateSkillSetDto } from '../dto/skill_set.dto';
import { SkillSet } from '../interface/skill_set.interface';
import skillSetService from '../service/skill_set.service';
import {
  responseCF,
  bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';
class SkillSetController {
  public skillSetService = new skillSetService();

  public getSkillSet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const findAllSkillSetData: SkillSet[] =
        await this.skillSetService.findAllSkillSet();
      const response = responseCF(
        bodyCF({
          val: findAllSkillSetData,
          code: '600',
          status: 'success',
          message: `Get Roles Successfully`,
        })
      );
      return res.json(response);
    } catch (error) {
      const response = responseCF(
        bodyCF({
          val: error,
          code: '600',
          status: 'success',
          message: `Get Roles Successfully`,
        })
      );
      return res.json(response);    }
  };

  public getSkillSetById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const skillSetId = Number(req.params.id);
      const findOneSkillSetData: SkillSet =
        await this.skillSetService.findSkillSetById(skillSetId);
      res
        .status(200)
        .json({
          data: findOneSkillSetData,
          message: 'findOne',
          status: 'success',
        });
    } catch (error) {
      res
        .status(404)
        .json({ message: error.message, code: error.status, status: 'error' });
    }
  };

  public createSkillSet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const skillSetData: CreateSkillSetDto = req.body;
      const createSkillSetData: SkillSet =
        await this.skillSetService.createSkillSet(skillSetData);
      res
        .status(201)
        .json({
          data: createSkillSetData,
          message: 'created',
          status: 'success',
        });
    } catch (error) {
      res
        .status(404)
        .json({ message: error.message, code: error.status, status: 'error' });
    }
  };

  public updateSkillSet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const skillSetId = Number(req.params.id);
      const skillSetData: CreateSkillSetDto = req.body;
      const updateSkillSetData: SkillSet =
        await this.skillSetService.updateSkillSet(skillSetId, skillSetData);
      res
        .status(200)
        .json({
          data: updateSkillSetData,
          message: 'updated',
          status: 'success',
        });
    } catch (error) {
      res
        .status(404)
        .json({ message: error.message, code: error.status, status: 'error' });
    }
  };

  public deleteSkillSet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const skillSetId = Number(req.params.id);
      const deleteSkillSetData: SkillSet =
        await this.skillSetService.deleteSkillSet(skillSetId);
      res
        .status(200)
        .json({
          data: deleteSkillSetData,
          message: 'deleted',
          status: 'success',
        });
    } catch (error) {
      res
        .status(404)
        .json({ message: error.message, code: error.status, status: 'error' });
    }
  };
}

export default SkillSetController;
