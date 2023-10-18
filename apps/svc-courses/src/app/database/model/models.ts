import { Sequelize } from 'sequelize';
// import { courses as _courses } from './courses';
import { tracks as _tracks, tracksAttributes, tracksCreationAttributes } from '../models/tracks'
import { chapters as _chapters, chaptersAttributes, chaptersCreationAttributes } from '../models/chapters';
import { topics as _topics, topicsAttributes,topicsCreationAttributes } from '../models/topics';
// import type { coursesAttributes, coursesCreationAttributes } from './courses';

export {
  // _courses as users,
  _tracks as tracks,
  _chapters as chapters,
  _topics as topics
};

  
export type {
  // coursesAttributes,
  // coursesCreationAttributes,
  tracksAttributes,
  tracksCreationAttributes
};
  
export function initModels(sequelize: Sequelize) {
  // const courses = _courses.initModel(sequelize);
  const tracks = _tracks.initModel(sequelize);
  return {
    // courses: courses,
    tracks: tracks
  };
}
