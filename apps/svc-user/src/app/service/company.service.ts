import DB from "../database/index";
import { CreateCompanyDto } from '../dto/company.dto';
import { HttpException } from '../../../../../libs/shared/exceptions/src/index';
import { isEmpty } from '../util/util';
import { Company } from '../interface/company.interface';

class CompanyService {
  public company = DB.DBmodels.company;

  public async findAllCompanies(companyData: Company): Promise<Company[]> {
    const allCompanies: Company[] = await this.company.findAll();
    return allCompanies;
  }

  public async findCompanyById(companyId: number): Promise<Company> {
    if (isEmpty(companyId)) throw new HttpException(400, "CompanyId is empty");
    const findCompany: Company = await this.company.findByPk(companyId);
    if (!findCompany) throw new HttpException(409, "Company doesn't exist");
    return findCompany;
  }

  public async createCompany(companyData: any): Promise<Company> {
    try {
      if (isEmpty(companyData)) throw new HttpException(400, "Company Data is empty");
      const findCompany: Company = await this.company.findOne({ where: { name: companyData.name } });
      if (findCompany) throw new HttpException(409, `This role ${companyData.name} already exists`);
        const createCompanyData: Company = await this.company.create(companyData);
        const companydata:any = await this.company.findOne({ where: { id: createCompanyData.id } });
      return companydata;
    } catch (error) {
      throw new HttpException(400, error.message);
    }
  }

  public async updateCompany(companyId: number, companyData: CreateCompanyDto): Promise<Company> {
    if (isEmpty(companyData)) throw new HttpException(400, "Company Data is empty");

    const findCompany: Company = await this.company.findByPk(companyId);
    if (!findCompany) throw new HttpException(409, "Company doesn't exist");
    await this.company.update(companyData, { where: { id: companyId } });
    const updateCompany: Company = await this.company.findByPk(companyId);
    return updateCompany;
  }

  public async deleteCompany(companyId: number): Promise<Company> {
    if (isEmpty(companyId)) throw new HttpException(400, "Company doesn't existId");

    const findCompany: Company = await this.company.findByPk(companyId);
    if (!findCompany) throw new HttpException(409, "Company doesn't exist");

    await this.company.destroy({ where: { id: companyId } });

    return findCompany;
  }

  
}

export default CompanyService;
