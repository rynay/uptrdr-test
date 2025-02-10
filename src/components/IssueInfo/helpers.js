import moment from "moment"

export const getDateLabel = (issue) => {
    switch (issue.status) {
        case 'Done':
            return moment(issue.updated).fromNow()
        default: 
            return `for ${moment(issue.updated).fromNow(true)}`
    }
}