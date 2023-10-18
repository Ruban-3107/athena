import type { Sequelize } from 'sequelize';

import { batches as _batches } from './batches';
import type { batchesAttributes, batchesCreationAttributes } from './batches';
import { batch_learners as _batch_learners } from './batch_learners';
import type {
  batchLearnersAttributes,
  batchLearnersCreationAttributes,
} from './batch_learners';

import { schedules as _schedules } from './schedules';
import type {
  schedulesAttributes,
  schedulesCreationAttributes,
} from './schedules';

import { user_tracks as _user_tracks } from './user_tracks';
import type {
  user_tracksAttributes,
  user_tracksCreationAttributes,
} from './user_tracks';

export { _batches as batches, _batch_learners as batch_learners };

export type {
  batchesAttributes,
  batchesCreationAttributes,
  batchLearnersAttributes,
  batchLearnersCreationAttributes,
  schedulesAttributes,
  schedulesCreationAttributes,
  user_tracksAttributes,
  user_tracksCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const batches = _batches.initModel(sequelize);
  const batch_learners = _batch_learners.initModel(sequelize);
  const schedules = _schedules.initModel(sequelize);
  const user_tracks = _user_tracks.initModel(sequelize);

  batches.hasMany(schedules, {
    as: 'batch_schedules',
    foreignKey: 'batch_id',
  });

  schedules.belongsTo(batches, {
    as: 'schedule_batches',
    foreignKey: 'batch_id',
  });

  batches.hasMany(batch_learners, {
    as: 'batchBatchLearners',
    foreignKey: 'batch_id',
  });
  return {
    batches: batches,
    batch_learners: batch_learners,
    schedules: schedules,
    user_tracks: user_tracks,
  };
}
