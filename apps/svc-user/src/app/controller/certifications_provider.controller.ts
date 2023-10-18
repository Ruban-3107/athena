import { NextFunction, Request, Response } from 'express';
import { CreateCertificationsProviderDto } from '../dto/certifications_provider.dto';
import { CertificationProvider } from '../interface/certification_provider.interface';
import providerService from '../service/certification_providers.service';


class CertificationProviderController {
    public providerService = new providerService();

    public getProvider = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findAllProviderData: CertificationProvider[] = await this.providerService.findAllProvider();
            res.status(200).json({ data: findAllProviderData, message: 'findAll', status: 'success'});
        } catch (error) {
            res.status(404).json({ message: error.message, code: error.status, status: "error" });
            next(error);
        }
    };

    public getProviderById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const providerId = Number(req.params.id);
            const findOneProviderData: CertificationProvider = await this.providerService.findProviderById(providerId);
            res.status(200).json({ data: findOneProviderData, message: 'findOne', status: 'success'});
        } catch (error) {
            res.status(404).json({ message: error.message, code: error.status, status: "error" });
            next(error);
        }
    };

    public createCertificationProvider = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const providerData: CreateCertificationsProviderDto = req.body;
            const createProviderData: CertificationProvider = await this.providerService.createCertificationsProvider(providerData);
            res.status(201).json({ data: createProviderData, message: 'created', status: 'success'});
        } catch (error) {
            res.status(404).json({ message: error.message, code: error.status, status: "error" });
        }
    };

    public updateProvider = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const providerId = Number(req.params.id);
            const providerData: CreateCertificationsProviderDto = req.body;
            const updateProviderData: CertificationProvider = await this.providerService.updateProvider(providerId, providerData);
            res.status(200).json({ data: updateProviderData, message: 'updated', status: 'success'});
        } catch (error) {
            res.status(404).json({ message: error.message, code: error.status, status: "error" });
            next(error);
        }
    };

    public deleteProvider = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const providerId = Number(req.params.id);
            const deleteProviderData: CertificationProvider = await this.providerService.deleteProvider(providerId);
            res.status(200).json({ data: deleteProviderData, message: 'deleted', status: 'success'});
        } catch (error) {
            res.status(404).json({ message: error.message, code: error.status, status: "error" });
            next(error);
        }
    };
}

export default CertificationProviderController;
