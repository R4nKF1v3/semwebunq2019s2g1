"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
class SlackNotifier {
    constructor() {
        this.SLACK_URL = "https://hooks.slack.com/services/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";
    }
    sendNotification(message) {
        console.log("Comenzando envío de notificación a Slack: " + message);
        let body = {
            "text": message
        };
        node_fetch_1.default(this.SLACK_URL, {
            method: 'post',
            body: JSON.stringify(body)
        })
            .then(response => console.log("Mensaje enviado a Slack: " + message))
            .catch(error => console.error("Error enviando mensaje a Slack: " + JSON.stringify(error)));
    }
}
exports.default = SlackNotifier;
