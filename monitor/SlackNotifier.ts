import fetch from 'node-fetch';

class SlackNotifier {

    private readonly SLACK_URL: string = "https://hooks.slack.com/services/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";

    constructor() {}

    sendNotification(message: string) {
        console.log("Comenzando envío de notificación a Slack: " + message)
        let body = {
            "text": message
        }
        fetch(this.SLACK_URL, {
            method: 'post',
            body: JSON.stringify(body)
        })
        .then( response => console.log("Mensaje enviado a Slack: " + message) )
        .catch( error => console.error("Error enviando mensaje a Slack: " + JSON.stringify(error)))
    }
    
}

export default SlackNotifier;