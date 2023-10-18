import generateTopicUrl from '../../../../../libs/shared/middleware/src/lib/generateTopicUrl.middleware';
import generateTopicUrlForTrack from '../../../../../libs/shared/middleware/src/lib/generateTopicUrlForTrack.middleware';

function sampleMiddleware(req, res, next) {
    console.log('sample middleware for auth-svc-courses');
    next();
}

export { sampleMiddleware, generateTopicUrl, generateTopicUrlForTrack };