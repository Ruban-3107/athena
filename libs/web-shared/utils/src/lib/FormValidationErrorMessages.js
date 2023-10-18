
export const add_user_validations = {
       first_name: 'First Name is required',
       first_name_min: 'First Name should be min 3 characters',
       first_name_max: 'First Name should be max 30 characters',
       last_name: 'Last Name is required',
       last_name_min: 'Last Name should be min 1 characters',
       last_name_max: 'Last Name should be max 50 characters',
       primary_email_ID: 'Primary Email ID is required',
       primary_email_ID_max: 'Email ID should be max of 255 characters',
       mobile_number: 'Mobile Number is required',
       mobile_number_max: 'Mobile Number should be max 10 digits',
       user_role: 'User Role is required',
       user_type: 'User Type is required',
       corporate_group: 'Corporate Group is required'
}

export const create_role_validations = {
       role_name: 'Role Name is required',
       role_name_min: 'Role Name should be min 3 characters',
       role_name_max: 'Role Name should be max 30 characters',
       description_min: 'Description should be min 10 characters',
       description_max: 'Description should be max 250 characters',
}

export const create_batch_validations = {
       batch_name: 'Batch Name is required',
       batch_name_min: 'Batch Name should be min 2 characters',
       batch_name_max: 'Batch Name should not be more than 20 characters',
       batch_name_valid: 'Batch Name must be valid and should not allow special characters',
       description: 'Description is required',
       description_min: 'Description should be min 10 characters',
       description_max: 'Description should be max 250 characters',
       description_valid: ' Descriptio must be valid and should not allow special characters',
       corporate_group: 'Corporate Group is required',
       start_date: 'Start Date is required'

}

export const create_corporate_validations = {
       corporate_group: 'Corporate Group is required',
       corporate_group_min: 'Corporate Group should be min 3 characters',
       corporate_group_max: 'Corporate Group should be max 30 characters',
       company_name: 'Company Name is required',
       company_name_min: 'Company Name should be min 3 characters',
       company_name_max: 'Company Name should be max 30 characters',
       first_name: 'First Name is required',
       first_name_min: 'First Name should be min 3 characters',
       first_name_max: 'First Name should be max 30 characters',
       last_name: 'Last Name is required',
       last_name_min: 'Last Name should be min 1 characters',
       last_name_max: 'Last Name should be max 50 characters',
       primary_email_ID: 'Primary Email ID is required',
       primary_email_ID_max: 'Email ID should be max of 255 characters',
       mobile_number: 'Mobile Number is required',
       mobile_number_max: 'Mobile Number should be max 10 digits',
}

export const create_topic_validations = {
       topic_name: 'Topic Name is required',
       // required ila
       topic_name_min: 'Topic Name should be min 3 characters',
       topic_name_max: 'Topic Name should be max 255 characters',
       topic_name_pattren:'Invalid Topic Name',
       description:'Invalid description',
       // description: 'Description is required',
       // required ila
       // description_min: 'Description should be min 10 characters',
       // description_max: 'Description should be max 1000 characters',
       topic_type: 'Topic Type is required',
       topic_link: 'Topic Link is required',
       topic_link_pattern: 'Invalid topic link',
       delivery_type: 'Delivery Type is required',
       duration: 'Duration is required',
       tech_skill: 'Technology/Skill is required',
       level: 'Please select difficulty level',
       file:"File is required"
       // required ila
}

export const create_chapter_validations = {
       chapter_title: 'Chapter Title is required',
       chapter_title_min: 'Chapter Title should be min 3 characters',
       chapter_title_max: 'Chapter Title should be max 255 characters',
       description: 'Description is required',
       // required ila
       description_min: 'Description should be min 3 characters',
       description_max: 'Description should be max 1000 characters',
       tech_skill: 'Technology/Skill is required',
       add_topic: 'At least add one topic'
}

export const create_course_validations = {
       course_title: 'Title is required',
       course_title_min: 'Title should be min 3 characters',
       course_title_max: 'Title should be max 255 characters',
       description: 'Description is required',
       // required ila
       description_min: 'Description should be min 3 characters',
       description_max: 'Description should be max 1000 characters',
       // pre,level,permission,course_type------------req vena
       add_chapter: 'At least add one chapter',
       tech_skill: 'Technology/Skill is required',

}

export const create_track_validations = {
       track_title: 'Title is required',
       track_title_min: 'Title should be min 3 characters',
       track_title_max: 'Title should be max 255 characters',
       description: 'Description is required',
       // required ila
       description_min: 'Description should be min 3 characters',
       description_max: 'Description should be max 1000 characters',
       // pre,level,permission,track_type------------req vena
       add_course: 'At least add one course',
       domain_subject: 'Domain/Subject is required',

}