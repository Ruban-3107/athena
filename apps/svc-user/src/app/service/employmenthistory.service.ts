// import { hash } from 'bcrypt';
import DB from "../database/index";
import { CreateEmploymenthistoryDto } from '../dto/employmenthistory.dto';
import { HttpException } from '../../../../../libs/shared/exceptions/src/index';
import { Employmenthistory } from '../interface/employmenthistory.interface';
import { isEmpty } from '../util/util';



class EmploymenthistoryService {



  public employmenthistory = DB.DBmodels.employment_history;
  public users = DB.DBmodels.users;

  public async findAllEmploymenthistory(): Promise<Employmenthistory[]> {
    const allEmploymenthistory: Employmenthistory[] = await this.employmenthistory.findAll({
      include: "user"
    });
    return allEmploymenthistory;
  }

  public async findEmploymenthistoryById(employmenthistoryId: number): Promise<Employmenthistory> {
    const findEmploymenthistory: Employmenthistory = await this.employmenthistory.findByPk(employmenthistoryId, {include:"user"});
    if (!findEmploymenthistory) throw new HttpException(409, "Employmenthistory doesn't exist");

    return findEmploymenthistory;
  }

  public async createEmploymenthistory(employmenthistoryData: CreateEmploymenthistoryDto): Promise<Employmenthistory> {

   // console.log("in service",employmenthistoryData);
    if (isEmpty(employmenthistoryData)) throw new HttpException(400, "Employmenthistory Data is empty");
    // const finduser : Employmenthistory = await this.users.findByPk( employmenthistoryData.user_id )
    // if (isEmpty(finduser)) throw new HttpException(400, "Employmenthistory is not found");
    const createEmploymenthistoryData: Employmenthistory = await this.employmenthistory.create({ ...employmenthistoryData });
    return createEmploymenthistoryData;
  }

  public async updateEmploymenthistory(employmenthistoryId: number, employmenthistoryData: CreateEmploymenthistoryDto): Promise<Employmenthistory> {
    if (isEmpty(employmenthistoryData)) throw new HttpException(400, "Employmenthistory Data is empty");

    const findEmploymenthistory: Employmenthistory = await this.employmenthistory.findByPk(employmenthistoryId);
    if (!findEmploymenthistory) throw new HttpException(409, "Employmenthistory doesn't exist");

    await this.employmenthistory.update({ ...employmenthistoryData }, { where: { id: employmenthistoryId } });

    const updateEmploymenthistory: Employmenthistory = await this.employmenthistory.findByPk(employmenthistoryId);
    return updateEmploymenthistory;
  }

  public async deleteEmploymenthistory(employmenthistoryId: number): Promise<Employmenthistory> {
    if (isEmpty(employmenthistoryId)) throw new HttpException(400, "Employmenthistory doesn't existId");

    const findEmploymenthistory: Employmenthistory = await this.employmenthistory.findByPk(employmenthistoryId);
    if (!findEmploymenthistory) throw new HttpException(409, "Employmenthistory doesn't exist");

    await this.employmenthistory.destroy({ where: { id: employmenthistoryId } });

    return findEmploymenthistory;
  }
}

export default EmploymenthistoryService;
