import moment from "moment";
import { Issue } from "../../types";

export const getDateLabel = (issue: Issue) => {
    switch (issue.status) {
        case 'Done':
            return moment(issue.updated).fromNow()
        default: 
            return `for ${moment(issue.updated).fromNow(true)}`
    }
}