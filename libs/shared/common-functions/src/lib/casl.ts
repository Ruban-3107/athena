import { createMongoAbility, MongoAbility, RawRuleOf, ForcedSubject } from '@casl/ability';
import { SubConstants, ActionConstants } from './config';



export const actions = [
    ActionConstants.CREATE,
    ActionConstants.READ,
    ActionConstants.UPDATE,
    ActionConstants.DELETE,
    ActionConstants.ASSIGN,
    ActionConstants.APPROVE,
    ActionConstants.PUBLISH,
    ActionConstants.UPLOAD,
    ActionConstants.DUPLICATE,
    ActionConstants.ENABLE_DISABLE,
    ActionConstants.MANAGE
] as const;
export const subjects = [
    SubConstants.USERS,
    SubConstants.ROLES,
    SubConstants.BATCH,
    SubConstants.TOPIC,
    SubConstants.CHAPTER,
    SubConstants.COURSE,
    SubConstants.CONTENT,
    SubConstants.SCHEDULE,
    SubConstants.BATCH_SCHEDULE,
    SubConstants.LEARNING_PATH,
    SubConstants.PRE_ASSESSMENT,
    SubConstants.ASSESSMENT,
    SubConstants.ASSIGNMENT,
    SubConstants.FEEDBACK,
    SubConstants.ALL
] as const;

export type Abilities = [
    typeof actions[number],
    typeof subjects[number] | ForcedSubject<Exclude<typeof subjects[number], 'all'>>
];
export type AppAbility = MongoAbility<Abilities>;
export const createAbility = (rules: RawRuleOf<AppAbility>[]) => createMongoAbility<AppAbility>(rules);