// import { Configuration, OpenAIApi } from 'openai';
// const configuration = new Configuration({
//   apiKey: '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',
// });
// eslint-disable-next-line @nx/enforce-module-boundaries
import DB from '../database/index';
// import { Client } from '@elastic/elasticsearch';
// import { CreateBotQuestionsAnswersDto } from '@dtos/bot_questions_answers.dto';
// const openai = new OpenAIApi(configuration);
// eslint-disable-next-line @nx/enforce-module-boundaries
import { HttpException } from '../../../../../libs/shared/exceptions/src/index';
import { Op } from 'sequelize';
import { DomainTechnology } from '../interface/domain_technology.interface';
// import { Client } from '@elastic/elasticsearch';

class DomainTechnologyService {
  // ...
  public domainTechnology = DB.DBmodels.domainTechnology;
  public async getDomainTechnology(data: string): Promise<DomainTechnology[]> {
    try {
      // console.log(data, '---eewd');
      if (!data) {
        throw new HttpException(400, 'cat is empty');
      }
      const domainTechnologyData: DomainTechnology[] =
        await this.domainTechnology.findAll({ where: { blob_category: data } });
      // console.log(domainTechnologyData, '----ggggg-----');
      if (!domainTechnologyData) {
        throw new HttpException(404, 'Category not found');
      }
      return domainTechnologyData;
    } catch (error) {
      throw new HttpException(409, error);
    }
  }
  public async createDomainTechnology(
    createDomainTechnologyData
  ): Promise<DomainTechnology> {
    try {
      const createDomainTechnology: DomainTechnology =
        await this.domainTechnology.create({ ...createDomainTechnologyData });
      return createDomainTechnology;
    } catch (error) {
      throw new HttpException(409, error);
    }
  }
  public async editDomainTechnology(
    domainTechnologyId,
    editDomainTechnologyDto
  ): Promise<DomainTechnology> {
    try {
      const existingDomainTechnology: DomainTechnology =
        await this.domainTechnology.findOne({
          where: { id: domainTechnologyId },
        });
      if (!existingDomainTechnology) {
        throw new HttpException(404, 'DomainTechnology not found');
      }
      await this.domainTechnology.update(
        { ...editDomainTechnologyDto },
        { where: { id: domainTechnologyId } }
      );
      const updatedDomainTechnology = await this.domainTechnology.findOne({
        where: { id: domainTechnologyId },
      });

      if (!updatedDomainTechnology) {
        throw new HttpException(
          500,
          'Failed to retrieve updated DomainTechnology'
        );
      }

      return updatedDomainTechnology;
    } catch (error) {
      throw new HttpException(409, error);
    }
  }

  public async deleteDomainTechnology(
    domainTechnologyId
  ): Promise<DomainTechnology> {
    try {
      const existingDomainTechnology: DomainTechnology =
        await this.domainTechnology.findOne({
          where: { id: domainTechnologyId },
        });
      if (!existingDomainTechnology) {
        throw new HttpException(404, 'DomainTechnology not found');
      }
      await this.domainTechnology.destroy({
        where: { id: domainTechnologyId },
      });
      return existingDomainTechnology;
    } catch (error) {
      throw new HttpException(409, error);
    }
  }
}

export default DomainTechnologyService;
