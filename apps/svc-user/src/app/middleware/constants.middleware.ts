export const module_helpers = {
    "User Management": {
        CREATE_USERS: { subject: "users", action: "create", name: "Create Users" },
        UPDATE_USERS: { subject: "users", action: "update", name: "Edit User" },
        DELETE_USERS: { subject: "users", action: "delete", name: "Delete User" },
        VIEW_USERS: { subject: "users", action: "read", name: "View Users List" },

        CREATE_ROLES: { subject: "roles", action: "create", name: "Create Role" },
        UPDATE_ROLES: { subject: "roles", action: "update", name: "Edit Role" },
        DELETE_ROLES: { subject: "roles", action: "delete", name: "Delete Role" },
        ASSIGN_ROLES: { subject: "roles", action: "assign", name: "Assign Role" },
    },
    "Batch Management": {
        CREATE_BATCHES: { subject: "batch", action: "create", name: "Create Batch" },
        VIEW_BATCHES: { subject: "batch", action: "read", name: "View Batch" },
        UPDATE_BATCHES: { subject: "batch", action: "update", name: "Edit Batch" },
        DELETE_BATCHES: { subject: "batch", action: "delete", name: "Delete Batch" },

        ASSIGN_BATCH: { subject: "batch", action: "assign", name: "Assign Batch" },
        DUPLICATE_BATCH: { subject: "batch", action: "duplicate", name: "Duplicate Batch" },
    },
    "Content Management": {
        CREATE_TOPICS: { subject: "topic", action: "create", name: "Create Topics" },
        VIEW_TOPICS: { subject: "topic", action: "read", name: "View Topics" },
        UPDATE_TOPICS: { subject: "topic", action: "update", name: "Edit Topics" },
        DELETE_TOPICS: { subject: "topic", action: "delete", name: "Delete Topics" },
        APPROVE_TOPICS: { subject: "topic", action: "approve", name: "Approve Topics" },

        CREATE_CHAPTERS: { subject: "chapter", action: "create", name: "Create Chapters" },
        VIEW_CHAPTERS: { subject: "chapter", action: "read", name: "View Chapters" },
        UPDATE_CHAPTERS: { subject: "chapter", action: "update", name: "Edit Chapters" },
        DELETE_CHAPTERS: { subject: "chapter", action: "delete", name: "Delete Chapters" },
        APPROVE_CHAPTERS: { subject: "chapter", action: "approve", name: "Approve Chapters" },

        CREATE_COURSES: { subject: "course", action: "create", name: "Create Courses" },
        VIEW_COURSES: { subject: "course", action: "read", name: "View Courses" },
        UPDATE_COURSES: { subject: "course", action: "update", name: "Edit Courses" },
        DELETE_COURSES: { subject: "course", action: "delete", name: "Delete Courses" },
        APPROVE_COURSES: { subject: "course", action: "approve", name: "Approve Courses" },

        CREATE_LEARNING_PATHS: { subject: "learningpath", action: "create", name: "Create Learning Path" },
        VIEW_LEARNING_PATHS: { subject: "learningpath", action: "read", name: "View Learning Paths" },
        UPDATE_LEARNING_PATHS: { subject: "learningpath", action: "update", name: "Edit Learning Path" },
        DELETE_LEARNING_PATHS: { subject: "learningpath", action: "delete", name: "Delete Learning Paths" },

        APPROVE_CONTENT: { subject: "content", action: "approve", name: "Approve Content" },
        PUBLISH_CONTENT: { subject: "content", action: "publish", name: "Publish Content" },
    },
    "Schedule Management": {
        CREATE_SCHEDULE: { subject: "schedule", action: "create", name: "Create Schedule" },
        VIEW_SCHEDULE: { subject: "schedule", action: "read", name: "View Schedule" },
        UPDATE_SCHEDULE: { subject: "schedule", action: "update", name: "Edit Schedule" },
        DELETE_SCHEDULE: { subject: "schedule", action: "delete", name: "Delete Schedule" },

        CREATE_BATCH_SCHEDULE: { subject: "batchschedule", action: "create", name: "Create Batch Schedule" },
        UPDATE_BATCH_SCHEDULE: { subject: "batchschedule", action: "update", name: "Edit Batch Schedule" },
        DELETE_BATCH_SCHEDULE: { subject: "batchschedule", action: "delete", name: "Delete Batch Schedule" },

        ENABLE_DISABLE_BATCH_SCHEDULE: { subject: "batchschedule", action: "enabledisable", name: "Enable/Disable Batch Schedule" },

    },
    "Assessment Management": {
        CREATE_PREASSESSMENT: { subject: "pre-assessment", action: "create", name: "Create Pre-Assessment" },
        VIEW_PREASSESSMENT: { subject: "pre-assessment", action: "read", name: "View Pre-Assessment" },
        UPDATE_PREASSESSMENT: { subject: "pre-assessment", action: "update", name: "Edit Pre-Assessment" },
        DELETE_PREASSESSMENT: { subject: "pre-assessment", action: "delete", name: "Delete Pre-Assessment" },
        UPLOAD_PREASSESSMENT: { subject: "pre-assessment", action: "upload", name: "Upload Pre-Assessment" },
        ENABLE_DISABLE_PREASSESSMENT: { subject: "pre-assessment", action: "enabledisable", name: "Enable/Disable Pre-Assessment" },
        APPROVE_PREASSESSMENT: { subject: "pre-assessment", action: "approve", name: "Approve Pre-Assessment" },

        CREATE_ASSESSMENT: { subject: "assessment", action: "create", name: "Create Assessment" },
        VIEW_ASSESSMENT: { subject: "assessment", action: "read", name: "View Assessment" },
        UPDATE_ASSESSMENT: { subject: "assessment", action: "update", name: "Edit Assessment" },
        DELETE_ASSESSMENT: { subject: "assessment", action: "delete", name: "Delete Assessment" },
        UPLOAD_ASSESSMENT: { subject: "assessment", action: "upload", name: "Upload Assessment" },
        ENABLE_DISABLE_ASSESSMENT: { subject: "assessment", action: "enabledisable", name: "Enable/Disable Assessment" },
        APPROVE_ASSESSMENT: { subject: "assessment", action: "approve", name: "Approve Assessment" },

        CREATE_ASSIGNMENT: { subject: "assignment", action: "create", name: "Create Assignment" },
        VIEW_ASSIGNMENT: { subject: "assignment", action: "read", name: "View Assignment" },
        UPDATE_ASSIGNMENT: { subject: "assignment", action: "update", name: "Edit Assignment" },
        DELETE_ASSIGNMENT: { subject: "assignment", action: "delete", name: "Delete Assignment" },
        UPLOAD_ASSIGNMENT: { subject: "assignment", action: "upload", name: "Upload Assignment" },
        ENABLE_DISABLE_ASSIGNMENT: { subject: "assignment", action: "enabledisable", name: "Enable/Disable Assignment" },
        APPROVE_ASSIGNMENT: { subject: "assignment", action: "approve", name: "Approve Assignment" },
    },
    "Feedback": {
        CREATE_FEEDBACK: { subject: "feedback", action: "create", name: "Create Feedback" },
        VIEW_FEEDBACK: { subject: "feedback", action: "read", name: "View Feedback" },
        UPDATE_FEEDBACK: { subject: "feedback", action: "update", name: "Edit Feedback" },
        DELETE_FEEDBACK: { subject: "feedback", action: "delete", name: "Delete Feedback" },

        ENABLE_DISABLE_FEEDBACK: { subject: "feedback", action: "enabledisable", name: "Enable/Disable Feedback" },
        APPROVE_FEEDBACK: { subject: "feedback", action: "approve", name: "Approve Feedback" },
    }
}

export const SubConstants = {
    USERS: "users",
    ROLES: "roles",
    BATCH: "batch",
    TOPIC: "topic",
    CHAPTER: "chapter",
    COURSE: "course",
    LEARNING_PATH: "learningpath",
    CONTENT: "content",
    SCHEDULE: "schedule",
    BATCH_SCHEDULE: "batchschedule",
    PRE_ASSESSMENT: "pre-assessment",
    ASSESSMENT: "assessment",
    ASSIGNMENT: "assignment",
    FEEDBACK: "feedback",
    ALL:"all"
}

export const ActionConstants = {
    CREATE: "create",
    READ: "read",
    UPDATE: "update",
    DELETE: "delete",
    ASSIGN: "assign",
    DUPLICATE: "duplicate",
    APPROVE: "approve",
    PUBLISH: "publish",
    UPLOAD: "upload",
    ENABLE_DISABLE: "enabledisable",
    MANAGE:"manage"
}
