 // import { CreateTemplateDto } fro
import { HttpException } from '@athena/shared/exceptions';
import DB from '../database/index'

class TemplateService {
  public template = DB.DBmodels.template;

  public async createTemplate (template: any): Promise<any> {
    console.log('service::::::::::',template);
    try {
    
      const templateData: any = await this.template.create({ ...template });
      return templateData;
    } catch (error) {
      throw new HttpException(401, error);
    }
  };

  public async getTemplateData(template:string):Promise<any>{
    try{
      const getTemp = await this.template.findOne({
        where: { 'template_name': template },
      });
      console.log("getTemp::",getTemp)
  
      return getTemp;

    }catch(error){
      throw new HttpException(401,error)
    }
  }

}

export default TemplateService;
