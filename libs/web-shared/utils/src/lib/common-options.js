

export const topicTypeData = [
    { id: 'Self-paced', name: 'Self-paced' },
    { id: 'Virtual Class', name: 'Virtual Class' },
    { id: 'Classroom', name: 'Classroom' },
    { id: 'Activity', name: 'Activity' },
    { id: 'Topic Link', name: 'Topic Link' },
]
export const skills = [
    { id: 'java', name: 'Java' },
    { id: 'node', name: 'Node' },
    { id: 'react', name: 'React' },
    { id: 'angular', name: 'Angular' },
    { id: 'javascript', name: 'Javascript' },
]
export const deliveryTypeData = [
    { id: 'Reading Material', name: 'Reading Material' },
    { id: 'Podcast', name: 'Podcast' },
    { id: 'Video', name: 'Video' },
]

export const statusType = [
    { id: 'Published', name: 'Published' },
    { id: 'Pending Approval', name: 'Pending Approval' },
    { id: 'In Draft', name: 'In Draft' }
]

export const statusTypes = [
    { id: 'Published', name: 'Published' },
    { id: 'Pending Approval', name: 'Pending Approval' },
    { id: 'In Draft', name: 'In Draft' },
    { id: 'Approved', name: 'Approved' },
    { id: 'Rejected', name: 'Rejected' },
    { id: 'Review In Progress', name: 'Review In Progress' }
]
export const userRegistrationType = [
    { id: 'Self Registered', name: 'Self Registered' },
    { id: 'Platform Registered', name: 'Platform Registered' }
]

export const userStatusType = [
    { id: 'active', name: 'Active' },
    { id: 'in active', name: 'Inactive' },
    { id: 'pending approval', name: 'Pending Approval' }
]

export const BATCH_STATUSES = [
    { status: "Ongoing", status_color: "#0e70da", },
    { status: "Completed", status_color: "#65ca33" },
    { status: "On Hold", status_color: "#f2c73e" },
    { status: "Upcoming", status_color: "#fc65c0" }
];

export const activityLogType = [
    { id: 'upload', name: 'Upload' },
    { id: 'download', name: 'Download' },
    { id: 'request', name: 'Request' },
    { id: 'approve', name: 'Approve' },
    { id: 'create', name: 'Create' },
    { id: 'delete', name: 'Delete' },
    { id: 'update', name: 'Update' },
    { id: 'enable', name: 'Enable' },
];

export const moduleTypeList = [
    { id: 'tracks', name: 'Courses' },
    { id: 'chapters', name: 'Chapters' },
    { id: 'topics', name: 'Topics' }
];

export const education = [
    { id: 1, name: 'Doctorate/PhD' },
    { id: 2, name: 'Masters/Post-Graduation' },
    { id: 3, name: 'Under-Graduation' },
    { id: 4, name: '12th/Equivalent' },
];

export const checkStatus = ['Published'];
export const checkTrainerStatus = ['Published', 'Approved'];
export const editPageSaveButtonStatus = ['Rejected', 'In Draft', 'Pending Approval', 'Review In Progress', 'Approved'];
export const editPageCancelButtonStatus = ['In Draft', 'Pending Approval', 'Rejected'];
export const editpageApproveButtonStatus = ['Rejected', 'Pending Approval', 'Review In Progress'];
export const editpageCancelButtonStatus = ['Rejected', 'Pending Approval', 'Review In Progress', 'Approved'];
export const editPageRejectButtonStatus = ['Pending Approval', 'Review In Progress', 'Approved'];
export const editPageRejectHideStatus = ['Pending Approval', 'Review In Progress'];
export const editPageApproveButtonRoles = ['Admin', 'Super Admin', 'Job Architect'];

export const ValidateButton = (role, status) => {
    const buttonId = [
        {
            id: 1,
            name: 'save'
        },
        {
            id: 2,
            name: "Cancel"
        },
        {
            id: 3,
            name: "Publish"
        },
        {
            id: 4,
            name: "Approve"
        }
    ]

    switch (role) {
        case 'Trainer':
            break;
        case 'Admin':

            break;
        case 'Super Admin':

            break;
        case 'Job Architect':

            break;
        default:
            return [];
    }
}