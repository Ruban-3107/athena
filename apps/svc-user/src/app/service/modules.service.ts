import DB from "../database/index";
import { CreateModuleDto } from '../dto/modules.dto';
import { HttpException } from '@athena/shared/exceptions';
import { module } from '../interface/modules.interface';
import { isEmpty } from '../util/util';

class ModuleService {
    public users = DB.DBmodels.users;
    public modules = DB.DBmodels.modules;

    public async findAllModule(): Promise<module[]> {
        const allModule: module[] = await this.modules.findAll();
        return allModule;
    }
}

export default ModuleService;
