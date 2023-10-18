import { HttpException } from '@athena/shared/exceptions';
import DB from '../database';
import { domainTechnology } from '../database/models/_domain_technology';

class AssessmentsService {
  public assessmentModel = DB.DBmodels.assessment;

  public async createAssessment(body: any) {
    try {
      const createAssessmentInDb = await this.assessmentModel.create({
        ...body,
      });
      return createAssessmentInDb;
    } catch (error) {
      console.log('error', error);
      throw new HttpException(401, error);
    }
  }

  public async getAllAssessment() {
    try {
      console.log('called:::::::::::');

      const getAll = await this.assessmentModel.findAll({
        include: [
          {
            model: domainTechnology,
            as: 'domainTechnology',
            attributes: ['name'],
          },
        ],
      });
      return getAll;
    } catch (error) {
      throw new HttpException(401, error);
    }
  }

  public async getByIdAssessment(id: any) {
    try {
      const findById = await this.assessmentModel.findByPk(id, {
        include: [
          {
            model: domainTechnology,
            as: 'domainTechnology',
            attributes: ['name'],
          },
        ],
      });

      if (findById) {
        return findById;
      }
    } catch (error) {
      throw new HttpException(401, error);
    }
  }

  public async updateAssessmentService(body: any) {
    try {
      const update = this.assessmentModel.update(
        { ...body },
        { where: { id: body['id'] } }
      );
      return update;
    } catch (error) {
      console.log('error', error);
      throw new HttpException(401, error);
    }
  }

  public async deleteAssessmentService(body: any) {
    try {
      const update_deleted_by = await this.assessmentModel.update(
        { deleted_by: body.deleted_by },
        { where: { id: body.ids } }
      );
      const deleteAssessment = await this.assessmentModel.destroy({
        where: { id: body.ids},
      });
      if (deleteAssessment) {
        return deleteAssessment;
      }
    } catch (err) {
      throw new HttpException(401, err);
    }
  }
}

export default AssessmentsService;
