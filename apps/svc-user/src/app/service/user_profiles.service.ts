import DB from "../database/index";
import { CreateUserProfileDto } from '../dto/user_profiles.dto';
import { HttpException } from '../../../../../libs/shared/exceptions/src/index';
import { UserProfile } from '../interface/user_profiles.interface';
import { isEmpty } from '../util/util';
import { Op } from 'sequelize';
import { uploadFile } from '@athena/shared/file-upload';
import Allowed_type from '../util/allow_type';

class UserProfileService {
    public userprofiles = DB.DBmodels.user_profiles;
    public users = DB.DBmodels.users;
    public employmenthistory = DB.DBmodels.employment_history;
    public certifications = DB.DBmodels.user_certifications;
    public skillset = DB.DBmodels.skill_set;
    public provider = DB.DBmodels.certification_providers;


    public async findAllUserProfile(): Promise<UserProfile[]> {
        const allUserprofile: UserProfile[] = await this.userprofiles.findAll({
            include:
                [
                    {
                        model: this.users,
                        as: "user",
                        include:
                            [
                                {
                                    model: this.employmenthistory,
                                    as: "user_employment_history"
                                },
                                {
                                    model: this.certifications,
                                    as: "user_certifications",
                                    include: [
                                        {
                                            model: this.provider,
                                            as: "providers",
                                            // limit:1
                                        }
                                    ]
                                },
                                "users_skillset"
                            ],
                    }
                ],
            order: [
                ['id', 'DESC']
            ],

        });
        return allUserprofile;
    }

    public async findUserProfileById(userprofileId: number): Promise<UserProfile> {
        try {
            if (isEmpty(userprofileId)) throw new HttpException(400, "userprofileId is empty");
            const findUserprofile: UserProfile = await this.userprofiles.findOne({
                where: { user_id: userprofileId },
                include:
                    [
                        {
                            model: this.users,
                            as: "userProfilesUser",
                            include:
                                [
                                    {
                                        model: this.employmenthistory,
                                        as: "user_employment_history"
                                    },
                                    {
                                        model: this.certifications,
                                        as: "usersUsersCertification",
                                        include: [
                                            {
                                                model: this.provider,
                                                as: "certificationProviders"
                                            }
                                        ]
                                    },
                                    "usersSkillSet"
                                ],
                        }
                    ],
                order: [
                    ['id', 'DESC']
                ],
            });

            const userProfileData = <any>findUserprofile;
            let percentage = 0;
            if (userProfileData) {
                if (userProfileData?.first_name != null && userProfileData?.last_name != null && userProfileData?.contact_email != null && userProfileData?.phone_number != null) {
                    percentage = 35;
                }

                if (userProfileData?.about_me != null) {
                    percentage += 30;
                }
                // if (userProfileData?.user?.user_employment_history?.length > 0) {
                //   percentage += 25;
                // }
                if (userProfileData?.user?.user_certifications?.length > 0) {
                    percentage += 35;
                }
                findUserprofile["dataValues"].percentage = percentage
            }

            if (!findUserprofile) throw new HttpException(409, "UserProfile doesn't exist");
            // console.log("gggggggggggg")
            return findUserprofile;

        } catch (error) {
            console.log("sssssss", error);
            throw new HttpException(400, error.message);
            //console.log("sssssss", error);
            throw new HttpException(error.statusCode, error.message);
            return error;
        }
    }

    public async createUserProfile(userprofileData: CreateUserProfileDto): Promise<UserProfile> {
        try {
            if (isEmpty(userprofileData)) throw new HttpException(400, "userprofileData is empty");
            // console.log("in user profile service", userprofileData)
            const findUserprofile: UserProfile = await this.userprofiles.findOne({ where: { user_id: userprofileData.user_id } });
            if (findUserprofile) throw new HttpException(409, `This userprofile with ${userprofileData.user_id} already exists`);
            // let findUser: any = await this.users.findOne({ where: { email: userprofileData.contact_email, phone_number: userprofileData.phone_number } });
            // if (!findUser) {
            //   throw new HttpException(409, `Email and mobile number doesn't matched`);
            // }
            if (userprofileData.years_of_experience) {

                userprofileData.experience_updated_at = new Date();
                console.log("//////////", userprofileData);
            }

            const createUserProfileData: UserProfile = await this.userprofiles.create({ ...userprofileData });
            if (createUserProfileData) {
                // await this.users.update({ name: createUserProfileData.first_name, bio: createUserProfileData.about_me }, { where: { id: createUserProfileData.user_id } })
            }

            if (userprofileData.skillset) {
                await this.associateSkillset(createUserProfileData.user_id, userprofileData.skillset);
            }

            return createUserProfileData;
        }
        catch (error) {
            throw new HttpException(400, error.message);
            // console.log("ggggggggg", error)
            return error;
        }
    }

    public async updateUserProfile(userprofileId: number, userprofileData: CreateUserProfileDto, files: any | null): Promise<UserProfile> {
        try {
            console.log("userprofileData", userprofileData, userprofileId);

            if (isEmpty(userprofileId)) throw new HttpException(400, "userprofileId is empty");
            if (files && Object.keys(files).length > 0) {
                const data = await uploadFile(files, Allowed_type.ALLOWED_IMG_TYPE);
                if (data.success) userprofileData.image_url = data.url;
            }
            if (isEmpty(userprofileData)) throw new HttpException(400, "userprofileData is empty");

            const findUserprofile: UserProfile = await this.userprofiles.findOne({ where: { user_id: userprofileId } });
            if (!findUserprofile) throw new HttpException(409, "UserProfile doesn't exist");
            if (userprofileData.years_of_experience) {
                userprofileData.experience_updated_at = new Date();
            }
            try {
                const a = await this.userprofiles.update({ ...userprofileData }, { where: { id: findUserprofile.id } });
            } catch (error) {
                console.log("ggggggggg", error);
            }

            if (userprofileData.first_name || userprofileData.about_me || userprofileData.skillset) {
                const payload = {};
                if (userprofileData.first_name) payload["name"] = userprofileData.first_name
                if (userprofileData.about_me) payload["bio"] = userprofileData.about_me
                if (userprofileData.skillset) payload["skillset"] = userprofileData.skillset
                await this.users.update(payload, { where: { id: findUserprofile.user_id } })
            }

            if (userprofileData.skillset) {
                await this.associateSkillset(findUserprofile.user_id, userprofileData.skillset);
            }

            const updateUserProfile: UserProfile = await this.userprofiles.findByPk(userprofileId);
            return updateUserProfile;
        }
        catch (error) {
            throw new HttpException(400, error.message);
            return error;
        }
    }

    public async deleteUserProfile(userprofileId: number): Promise<UserProfile> {
        try {
            if (isEmpty(userprofileId)) throw new HttpException(400, "please provide a UserProfile Id");

            const findUserprofile: UserProfile = await this.userprofiles.findByPk(userprofileId);
            if (!findUserprofile) throw new HttpException(409, "UserProfile doesn't exist");

            await this.userprofiles.destroy({ where: { id: userprofileId } });

            return findUserprofile;
        }
        catch (error) {
            throw new HttpException(400, error.message);
            return error;
        }
    }

    public async associateSkillset(userId: number, skillset: object[]) {
        // console.log("ssss", userId, skillset);
        if (isEmpty(userId)) throw new HttpException(400, "User doesn't exist");
        let skillset1 = await this.skillset.findAll({ where: { id: { [Op.in]: skillset } } })
        let t = skillset1.map((x) => x["dataValues"].id);
        try {
            this.users.findByPk(userId).then(async (user) => {
                await user.setUsers_skillset(t);
            });
        } catch (error) {
            throw new HttpException(error.statusCode, error.message);
            // console.log(error);
        }
    }
}

export default UserProfileService;
