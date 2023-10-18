// const UserDataHistory = require("../../controllers/userdatahistory.controller");
import UserSessionHistory from '../../service/user_sessions_history.service';
const userSessionHistoryService = new UserSessionHistory();

export const userSessionHistory = async (serviceType, obj1, role) => {
    const item_arr = [];


    if (serviceType == "create") {
        const estart = obj1;

        if (typeof estart === "object" && Object.keys(estart).length > 0) {
            for (const item in estart) {
                item_arr.push(item);
            }
            // if (!item_arr.includes("user")) {
            //     eid = estart.id;
            // }
            // console.log("kkkkkkkkkkkkkkkkk",estart);

            // let e_id = eid
            // ? eid
            // : estart.users.dataValues
            // ? estart.employee.dataValues.id
            // : estart.employee.id;

            const pay = {
                sign_up_at: new Date(),
                user_id: estart.id,
                field: "Sign_Up",
                is_email_verified: false,
                is_password_changed: estart.is_password_changed,
                user_name: estart.name,
                role: [role]
                // started_at: new Date(),
            };
            await userSessionHistoryService.createUserSessionsHistory(pay);
        }
    }
}