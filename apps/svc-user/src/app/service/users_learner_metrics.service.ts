import DB from '../database';
import { Op } from 'sequelize';

class UserLearnerMetricsService {
  public users = DB.DBmodels.users;
  public roles = DB.DBmodels.roles;
  public userProfiles = DB.DBmodels.user_profiles;
  ////////////////////////////////////////////////////////Upcoming sessions////////////////////////////////////////////////////////////////////
  /**upcomingsession trainer details */
  public fetchUpcomingSessionTrainer = async (userIds: number[]) => {
    const trainerIdArray = {
      id: {
        [Op.in]: userIds,
      },
    };
    const trainers = await this.users.findAll({
      where: { ...trainerIdArray },
      attributes: ['id', 'first_name', 'last_name', 'name', 'email'],
      include: [
        {
          model: this.userProfiles,
          as: 'userProfiles',
          attributes: ['image_url'],
        },
        {
          model: this.roles,
          as: 'userRoles',
          attributes: ['id', 'name'],
        },
      ],
    });

    console.log('edfs', trainers);

    return trainers.map((x) => {
      const id = x.dataValues.id;
      const trainerEmail = x.dataValues.email;
      const trainerName = x.dataValues.name || null;
      const trainerFirstName = x.dataValues.first_name || null;
      const trainerLastName = x.dataValues.last_name || null;
      const imageUrl = x.dataValues.userProfiles.image_url || null;
      return {
        //...x.dataValues,
        id,
        trainerEmail,
        trainerFirstName,
        trainerLastName,
        trainerName,
        imageUrl,
      };
    });
  };
  ////////////////////////////////////////////////////////Upcoming sessions////////////////////////////////////////////////////////////////////
}

export default UserLearnerMetricsService;
