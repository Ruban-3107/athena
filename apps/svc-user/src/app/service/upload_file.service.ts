import { Template } from "handlebars";
import DB from "../database/index";
import { getcallfroms3, uploadFileUrl } from '@athena/shared/file-upload';
import { HttpException } from "@athena/shared/exceptions";
import { isEmpty } from '../util/util';
import { where } from "sequelize";

class providerService {

    public template = DB.DBmodels.template;


    public async createUploadFile(files, fields, role:any): Promise<any> {
       
        let filekey: any = await uploadFileUrl(files, fields, 'file');
        let payload = {};
        payload['template'] = String(filekey);
        if (role === 'Super Admin') {
            payload['template_name'] = 'Super_admin_bulk_upload_template'
        } else if (role === 'Admin') {
            payload['template_name'] = 'Admin_bulk_upload_template'
        } else {
            payload['template_name'] = 'Client_bulk_upload_template'
        }
        console.log("oiiowudiuwidwodjwidw",payload);
        const uploadfiledata = await this.template.create(payload);
        console.log("kkjjkdidjjjf",uploadfiledata);
        
        return uploadfiledata;
    }

    public async findAllTemplates(): Promise<Template[]> {
        const allTemplates: any = await this.template.findAll({});
        return allTemplates;
    }
    
    public async findTemplateById(templateId: string): Promise<any>{
        if (isEmpty(templateId)) throw new HttpException(400, "templateId is empty");
        const findtemplate = await this.template.findOne({where:{template_name: templateId}});
        if (!findtemplate) throw new HttpException(400, "template doesn't exist");
        // const filekey = findtemplate.template
        const templateURL = await getcallfroms3(findtemplate.template);
        if (!templateURL) throw new HttpException(400, "template_filekey doesn't exist");
        return templateURL;
    }
}

export default providerService;
