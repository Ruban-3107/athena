import DB from '../database';
import { CreateCertificationsDto } from '../dto/user_certifications.dto';
import { HttpException } from '@athena/shared/exceptions';
import { UserCertifications } from '../interface/users_certifications.interface';
import { isEmpty } from '../util/util';
import { uploadFile } from '@athena/shared/file-upload';
import Allowed_type from '../util/allow_type';
class CertificationService {
  public certifications = DB.DBmodels.user_certifications;
  public users = DB.DBmodels.users;
  public providers = DB.DBmodels.certification_providers;

  public async findAllCertifications(): Promise<UserCertifications[]> {
    console.log("servicesssssssss certifications");
    
    const allCertifications: UserCertifications[] =
      await this.certifications.findAll({ include: 'user' });
    console.log("return munduuuuu");
    
    return allCertifications;
  }

  public async findCertificationById(
    certificationId: number
  ): Promise<UserCertifications> {
    if (isEmpty(certificationId))
      throw new HttpException(400, 'CertificationId is empty');

    const findCertification: UserCertifications = await this.certifications.findByPk(
      certificationId,
      { include: 'user' }
    );
    if (!findCertification)
      throw new HttpException(409, "Certification doesn't exist");

    return findCertification;
  }

  public async createCertification(
    certificationData: CreateCertificationsDto,
    files: any
  ): Promise<UserCertifications> {
    try {
      if (isEmpty(certificationData))
        throw new HttpException(400, 'certificationData is empty');

      const provider_id: any = certificationData.provider_id;

      if (JSON.parse(provider_id) == null) {
        const [provider, created] = await this.providers.findOrCreate({
          where: { label: certificationData.create_provider },
        });
        certificationData.provider_id = provider.id;
      }
      if (isEmpty(certificationData.date_expires)) {
        delete certificationData.date_expires;
      }
      delete certificationData.create_provider;

      const data = await uploadFile(files, Allowed_type.ALLOWED_DOC_TYPES);
      if (data.success) certificationData.certificate_upload = data.url;

      const createCertificationData: UserCertifications =
        await this.certifications.create({ ...certificationData });
      console.log("ioioioioioi")
      const certificationDatawithProvider: UserCertifications =
        await this.certifications.findOne({
          where: { id: createCertificationData.id },
          include: 'certificationProviders',
        });

      return certificationDatawithProvider;
    } catch (error) {
      throw new HttpException(404, error.message);
    }
  }

  public async updateCertification(
    certificationId: number,
    certificationData: CreateCertificationsDto,
    files: any
  ): Promise<UserCertifications> {
    try {
      if (isEmpty(certificationData))
        throw new HttpException(400, 'certificationData is empty');

      const findCertification: UserCertifications =
        await this.certifications.findByPk(certificationId);
      if (!findCertification)
        throw new HttpException(409, "Certification doesn't exist");

      if (files && Object.keys(files).length > 0) {
        const data = await uploadFile(files, Allowed_type.ALLOWED_DOC_TYPES);
        if (data.success) certificationData.certificate_upload = data.url;
      }

      const a = await this.certifications.update(
        { ...certificationData },
        { where: { id: certificationId } }
      );

      const updatedCertification: UserCertifications =
        await this.certifications.findByPk(certificationId);

      return updatedCertification;
    } catch (error) {
      throw new HttpException(404, error.message);
    }
  }

  public async deleteCertification(
    certificationId: number
  ): Promise<UserCertifications> {
    console.log('sssdfghjhgfdfytrwqettutytr');
    if (isEmpty(certificationId))
      throw new HttpException(400, "Certification doesn't existId");

    const findCertification: UserCertifications = await this.certifications.findByPk(
      certificationId
    );
    if (!findCertification)
      throw new HttpException(409, "Certification doesn't exist");

    await this.certifications.destroy({ where: { id: certificationId } });
    return findCertification;

    }
  }

export default CertificationService;
