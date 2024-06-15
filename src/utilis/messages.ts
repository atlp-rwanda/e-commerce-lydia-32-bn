import moment from 'moment'

function formatMessage(name: string, text: string) {
 return {
    username: name,
    text,
    time: moment().format('h:mm a')
 }
}

export default formatMessage