'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fetchDataLib = require('./fetchData');
var fs = require('fs');
var htmlParser_1 = require("./htmlParser");
var emailSender_1 = require("./emailSender");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var oldProjectsFromDB, emailer, Currentday, Yesterday, dayChanged, _loop_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    oldProjectsFromDB = [];
                    emailer = new emailSender_1.EmailSender();
                    Currentday = new Date().getDate();
                    Yesterday = 0;
                    dayChanged = true;
                    _loop_1 = function () {
                        var dbResponse, projectsFromDB, projectsNeedMaintenance, htmlRawContent;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    console.log(new Date(), "Fetching new data...");
                                    //only send the limit and warning emails once a day
                                    Currentday = new Date().getDate();
                                    if (Yesterday != Currentday) {
                                        console.log(new Date(), "Day changed...Sending email if limit is reached.");
                                        dayChanged = true;
                                        Yesterday = Currentday;
                                    }
                                    return [4 /*yield*/, fetchDataLib.fetchData()];
                                case 1:
                                    dbResponse = _b.sent();
                                    if (dbResponse.status == 500) {
                                        console.log(new Date(), 'Could not read the data from database, please check the error message below:');
                                        console.log(new Date(), dbResponse.message);
                                        return [2 /*return*/, "continue"];
                                    }
                                    projectsFromDB = dbResponse.message;
                                    projectsNeedMaintenance = [];
                                    projectsNeedMaintenance = checkProjectsData(projectsFromDB.slice(), oldProjectsFromDB.slice());
                                    htmlRawContent = ReadContentFile();
                                    projectsNeedMaintenance.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                        var Subject, htmlContent, emailSent, emailSent, emailSent;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    Subject = '';
                                                    switch (item.issue) {
                                                        case 'reset':
                                                            Subject = 'Conter value was reseted';
                                                            break;
                                                        case 'limit':
                                                            Subject = 'Adapter has reached contacts limit';
                                                            break;
                                                        case 'warning':
                                                            Subject = 'Adapter has reached contacts warning';
                                                            break;
                                                        case 'limit_change':
                                                            Subject = 'Adapter contacts limits were changed';
                                                            break;
                                                        case 'owner_change':
                                                            Subject = 'Adapter owner was changed';
                                                            break;
                                                        default:
                                                            Subject =
                                                                'If you receive this error, please contact your administrator!';
                                                            break;
                                                    }
                                                    htmlContent = (0, htmlParser_1.parseHtmlFile)(htmlRawContent, item);
                                                    if (!(dayChanged && (item.issue == 'limit' || item.issue == 'warning'))) return [3 /*break*/, 2];
                                                    console.log(new Date(), 'Sending email for Alert: ', item.issue, ' with Project name: ', item.project.project_name, ' Adapter code: ', item.project.adapter_code, ' Fixture type: ', item.project.fixture_type);
                                                    return [4 /*yield*/, emailer.sendEmail(item.project.owner_email, Subject, JSON.stringify(item), htmlContent)];
                                                case 1:
                                                    emailSent = _a.sent();
                                                    if (emailSent) {
                                                        console.log(new Date(), "Email sent!");
                                                        dayChanged = false;
                                                    }
                                                    _a.label = 2;
                                                case 2:
                                                    if (!(item.issue == 'reset')) return [3 /*break*/, 4];
                                                    console.log(new Date(), 'Sending email for Alert: ', item.issue, ' with Project name: ', item.project.project_name, ' Adapter code: ', item.project.adapter_code, ' Fixture type: ', item.project.fixture_type);
                                                    return [4 /*yield*/, emailer.sendEmail(item.project.owner_email, Subject, JSON.stringify(item), htmlContent)];
                                                case 3:
                                                    emailSent = _a.sent();
                                                    if (emailSent) {
                                                        console.log(new Date(), "Email sent!");
                                                    }
                                                    _a.label = 4;
                                                case 4:
                                                    if (!(item.issue == 'limit_change' || item.issue == 'owner_change')) return [3 /*break*/, 6];
                                                    console.log(new Date(), 'Sending email for Alert: ', item.issue, ' with Project name: ', item.project.project_name, ' Adapter code: ', item.project.adapter_code, ' Fixture type: ', item.project.fixture_type);
                                                    return [4 /*yield*/, emailer.sendEmail(item.project.owner_email, Subject, JSON.stringify(item), htmlContent)];
                                                case 5:
                                                    emailSent = _a.sent();
                                                    if (emailSent) {
                                                        console.log(new Date(), "Email sent!");
                                                    }
                                                    _a.label = 6;
                                                case 6: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    //await sleep(1000 * 60 * 15);
                                    return [4 /*yield*/, sleep(10000)];
                                case 2:
                                    //await sleep(1000 * 60 * 15);
                                    _b.sent();
                                    oldProjectsFromDB = projectsFromDB.slice();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
var sleep = function (time_ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, time_ms);
    });
};
var ReadContentFile = function () {
    try {
        return fs.readFileSync('./html/emailContent.html', 'utf8');
    }
    catch (err) {
        console.error(err);
    }
    return '';
};
/*
The following function will return a list of projects that have out of boundaries values,
if one project has exceeded its temperature -> add the project to the list
if one project has changed its temperature by 3 deg from previous -> add the project to the list
if one project has its contacts greater than limit -> add the project to the list and skip checking for warning (limit > contacts)
if one project has its contacts greater than warning -> add the project to the list ONLY IF the value of limit was not exceeded(warning > contacts < limit)
*/
var checkProjectsData = function (projects, oldProjectsFromDB) {
    var projectsNeedMaintenance = [];
    projects.map(function (item) {
        //map over all the old projects and check if the temperature changed by 3 deg.
        oldProjectsFromDB.map(function (oldItem) {
            if (oldItem.adapter_code === item.adapter_code &&
                oldItem.fixture_type === item.fixture_type) {
                if (item.resets - oldItem.resets > 0) {
                    var itemDictionary = {
                        issue: 'reset',
                        project: item,
                    };
                    console.log(new Date(), "!!!!Contacts were reseted!!!!");
                    projectsNeedMaintenance.push(itemDictionary);
                }
            }
            if (oldItem.adapter_code === item.adapter_code &&
                oldItem.fixture_type === item.fixture_type) {
                if (item.contacts_limit != oldItem.contacts_limit ||
                    item.warning_at != oldItem.warning_at) {
                    var itemDictionary = {
                        issue: 'limit_change',
                        project: item,
                    };
                    console.log(new Date(), "Limits were changed!");
                    projectsNeedMaintenance.push(itemDictionary);
                }
            }
            if (oldItem.adapter_code === item.adapter_code &&
                oldItem.fixture_type === item.fixture_type) {
                if (item.owner_email != oldItem.owner_email) {
                    var itemDictionary = {
                        issue: 'owner_change',
                        project: item,
                    };
                    console.log(new Date(), "Owner was changed!");
                    projectsNeedMaintenance.push(itemDictionary);
                }
            }
        });
        var limitAdded_SkippingWarning = false;
        if (item.contacts > item.contacts_limit) {
            var itemDictionary = {
                issue: 'limit',
                project: item,
            };
            limitAdded_SkippingWarning = true;
            projectsNeedMaintenance.push(itemDictionary);
        }
        if (!limitAdded_SkippingWarning) {
            //only add the warning if the limit was not added
            if (item.contacts > item.warning_at) {
                var itemDictionary = {
                    issue: 'warning',
                    project: item,
                };
                projectsNeedMaintenance.push(itemDictionary);
            }
        }
    });
    return projectsNeedMaintenance;
};
//# sourceMappingURL=emailService.js.map