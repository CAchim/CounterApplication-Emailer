"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHtmlFile = void 0;
var node_html_parser_1 = require("node-html-parser");
//This message has low priority - Warning -> class="text-warning"
//This message has high priority - Alert  -> class="text-danger"
var parseHtmlFile = function (htmlRawContent, projectDictionary) {
    var root = (0, node_html_parser_1.parse)(htmlRawContent, {
        blockTextElements: {
            script: true,
            noscript: true,
            style: true,
            pre: true, // keep text content when parsing
        },
    });
    var textToBeAddedForPriorityTag = "";
    var classToBeAddedForPriorityTag = "";
    switch (projectDictionary.issue) {
        case "reset":
            textToBeAddedForPriorityTag = "The counter value for the the equipment below has been reseted!";
            classToBeAddedForPriorityTag = "text-danger";
            break;
        case "limit":
            textToBeAddedForPriorityTag = "The equipment below has exceeded the maximum contacts limit! Please take into consideration the maintenance as soon as possible!";
            classToBeAddedForPriorityTag = "text-danger";
            break;
        case "warning":
            textToBeAddedForPriorityTag = "The equipment below has exceeded the contacts warning limit! Please take into consideration scheduling the maintenance soon!";
            classToBeAddedForPriorityTag = "text-warning";
            break;
        case "limit_change":
            textToBeAddedForPriorityTag = "The limits for the equipment below have been modified!";
            classToBeAddedForPriorityTag = "text-warning";
            break;
        case "owner_change":
            textToBeAddedForPriorityTag = "The owner for the equipment below has been modified!";
            classToBeAddedForPriorityTag = "text-warning";
            break;
        default:
            textToBeAddedForPriorityTag = "If you receive this error, please contact your administrator!";
            classToBeAddedForPriorityTag = "text-danger";
            break;
    }
    root.getElementById("priorityLevelTag").innerHTML =
        textToBeAddedForPriorityTag;
    root
        .getElementById("priorityLevelTag")
        .classList.add(classToBeAddedForPriorityTag);
    root.getElementById("project_name").innerHTML =
        "Project name: " + projectDictionary.project.project_name;
    root.getElementById("adapter_code").innerHTML =
        "Adapter code: " + projectDictionary.project.adapter_code;
    root.getElementById("fixture_type").innerHTML =
        "Fixture type: " + projectDictionary.project.fixture_type;
    root.getElementById("owner_email").innerHTML =
        "Owner email: " + projectDictionary.project.owner_email;
    root.getElementById("contacts").innerHTML =
        "Contacts: " + projectDictionary.project.contacts.toString();
    root.getElementById("contacts_limit").innerHTML =
        "Contacts limit: " + projectDictionary.project.contacts_limit.toString();
    root.getElementById("warning_at").innerHTML =
        "Warning at: " + projectDictionary.project.warning_at.toString();
    root.getElementById("resets").innerHTML =
        "Resets: " + projectDictionary.project.resets.toString();
    root.getElementById("testprobes").innerHTML =
        "Required test probes: " + projectDictionary.project.testprobes;
    root.getElementById("modified_by").innerHTML =
        "Modified by: " + projectDictionary.project.modified_by.toString();
    root.getElementById("last_update").innerHTML =
        "Last update: " + projectDictionary.project.last_update.toString();
    var parsedHtmlContent = root.toString();
    return parsedHtmlContent;
};
exports.parseHtmlFile = parseHtmlFile;
//# sourceMappingURL=htmlParser.js.map