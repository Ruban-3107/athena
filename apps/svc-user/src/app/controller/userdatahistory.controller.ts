import { NextFunction, Request, Response } from 'express';
import UserdatahistoryService from '../service/userdatahistory.service';
import {
    responseCF,
    bodyCF,
} from '../../../../../libs/commonResponse/commonResponse';


class UserDataHistory {
    public UserdatahistoryService = new UserdatahistoryService();

    public getUserdatahistoryBasedOnFiterAndSearch = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const getUserData: any[] = await this.UserdatahistoryService.filteruserdatahistory(req.body);
            const response = responseCF(
                bodyCF({
                    code: '600',
                    val: getUserData,
                    status: "success",
                    message: "userlogs fetched "
                })
            );
            return res
                .json(response);
        } catch (error) {
            const response = responseCF(
                bodyCF({ message: error.message, code: '611', status: "error" })
            );
            return res.json(response);
        }

    }

    public createuserdatahistory
        // (data: any, res: Response) =>
        = async (data: any, res: Response, next: NextFunction) => {
            try {
                const userData = data;
                const createdUserData = await this.UserdatahistoryService.createuserdatahistory(userData);
                const response = responseCF(
                    bodyCF({
                        code: '600',
                        status: "success",
                        message: "userlogs created successfully "
                    })
                );
                return res.json(response);
            } catch (error) {
                const response = responseCF(
                    bodyCF({ message: error.message, code: '611', status: "error" })
                );
                return res.json(response);
            }
        }
}

export default UserDataHistory;