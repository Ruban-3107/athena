// import { hash } from 'bcrypt';
import DB from "../database/index";
import { CreateCertificationsProviderDto } from '../dto/certifications_provider.dto';
import { HttpException } from '@athena/shared/exceptions';
import { CertificationProvider } from '../interface/certification_provider.interface';
import { isEmpty } from '../util/util';

class providerService {

    public provider = DB.DBmodels.certification_providers;

    public async findAllProvider(): Promise<CertificationProvider[]> {
        const allProvider: CertificationProvider[] = await this.provider.findAll({});
        return allProvider;
    }

    public async findProviderById(providerId: number): Promise<CertificationProvider> {
        const findProvider: CertificationProvider = await this.provider.findByPk(providerId);
        if (!findProvider) throw new HttpException(409, "Provider doesn't exist");
        return findProvider;
    }

    public async createCertificationsProvider(providerData: CreateCertificationsProviderDto): Promise<CertificationProvider> {
        if (isEmpty(providerData)) throw new HttpException(400, "provider Data is empty");
        const findCertificationProvider: CertificationProvider = await this.provider.findOne({ where: { label: providerData.label } });
        if (findCertificationProvider) throw new HttpException(409, `This provider with name ${providerData.label} already exists`);
        const createCertificationProviderData: CertificationProvider = await this.provider.create({ ...providerData });
        return createCertificationProviderData;
    }

    public async updateProvider(providerId: number, providerData: CreateCertificationsProviderDto): Promise<CertificationProvider> {
        if (isEmpty(providerData)) throw new HttpException(400, "provider Data is empty");
        const findCertificationProvider: CertificationProvider = await this.provider.findByPk(providerId);
        if (!findCertificationProvider) throw new HttpException(409, "Provider doesn't exist");
        await this.provider.update({ ...providerData }, { where: { id: providerId } });
        const updateProvider: CertificationProvider = await this.provider.findByPk(providerId);
        return updateProvider;
    }

    public async deleteProvider(providerId: number): Promise<CertificationProvider> {
        if (isEmpty(providerId)) throw new HttpException(400, "Provider doesn't existId");
        const findCertificationProvider: CertificationProvider = await this.provider.findByPk(providerId);
        if (!findCertificationProvider) throw new HttpException(409, "SkillSet doesn't exist");
        await this.provider.destroy({ where: { id: providerId } });
        return findCertificationProvider;
    }
}

export default providerService;
