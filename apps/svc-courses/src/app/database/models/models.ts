import type { Sequelize } from 'sequelize';
import {
  tracks as _tracks,
  tracksAttributes,
  tracksCreationAttributes,
} from './tracks';
import {
  chapters as _chapters,
  chaptersAttributes,
  chaptersCreationAttributes,
} from './chapters';
import {
  topics as _topics,
  topicsAttributes,
  topicsCreationAttributes,
} from './topics';
import {
  domainTechnology as _domainTechnology,
  domainTechnologyAttributes,
  domainTechnologyOptionalAttributes,
} from './_domain_technology';
import {
  activities_log as _activities_log,
  activitiesAttributes,
  activitiesCreationAttributes,
} from './activities_log';
import {
  assessments as _assessment,
  assessmentsAttribute,
  assessmentsOptionalAttributs,
} from './assessment';

export {
  _tracks as tracks,
  _chapters as chapters,
  _topics as topics,
  _domainTechnology as domainTechnology,
  _activities_log as activities_log,
  _assessment as assessment,
};

export type {
  tracksAttributes,
  tracksCreationAttributes,
  chaptersAttributes,
  chaptersCreationAttributes,
  topicsAttributes,
  topicsCreationAttributes,
  domainTechnologyAttributes,
  domainTechnologyOptionalAttributes,
  activitiesAttributes,
  activitiesCreationAttributes,
  assessmentsAttribute,
};

export function initModels(sequelize: Sequelize) {
  const tracks = _tracks.initModel(sequelize);
  const chapters = _chapters.initModel(sequelize);
  const topics = _topics.initModel(sequelize);
  const domainTechnology = _domainTechnology.initModel(sequelize);
  const activities_log = _activities_log.initModel(sequelize);
  const assessment = _assessment.initModel(sequelize);

  tracks.belongsToMany(tracks, {
    as: 'children',
    through: 'trackchildren',
    foreignKey: 'track_id',
    otherKey: 'child_id',
  });
  tracks.belongsToMany(chapters, {
    as: 'track_chapters',
    through: 'trackchapters',
  });
  chapters.belongsToMany(tracks, {
    as: 'chaptrac',
    through: 'trackchapters',
  });
  chapters.belongsToMany(topics, {
    as: 'chapter_topics',
    through: 'chaptertopics',
  });
  topics.belongsToMany(chapters, {
    as: 'topic_chapters',
    through: 'chaptertopics',
  });
  domainTechnology.hasOne(tracks, {
    as: 'tracks',
    foreignKey: 'technology_skills',
  });

  domainTechnology.hasMany(assessment, {
    as: 'assessment',
    foreignKey: 'technology_skills',
    constraints: false,
  });

  assessment.belongsTo(domainTechnology, {
    as: 'domainTechnology',
    foreignKey: 'technology_skills',
    constraints: false,
  });

  tracks.belongsTo(domainTechnology, {
    as: 'technology_skill_track',
    foreignKey: 'technology_skills',
  });

  return {
    tracks: tracks,
    chapters: chapters,
    topics: topics,
    domainTechnology: domainTechnology,
    activities_log: activities_log,
    assessment: assessment,
  };
}
