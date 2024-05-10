"use strict";
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
exports.EmailSender = void 0;
var nodemailer = require('nodemailer');
var database_1 = require("../lib/database");
var EmailSender = /** @class */ (function () {
    function EmailSender() {
        this.emailSender = 'uig11538@contiwan.com';
        this.emailTransporter = nodemailer.createTransport({
            host: 'smtpHubEu.contiwan.com',
            port: 587,
            service: 'office365',
            secure: false,
            auth: {
                user: this.emailSender,
                pass: 'Counter@pp01',
            },
            debug: false,
            logger: true,
        });
    }
    EmailSender.prototype.sendEmail = function (toParam, subjectParam, textParam, htmlParam) {
        return __awaiter(this, void 0, void 0, function () {
            var EmailBodyText, sqlCommand, egroup, validEmails;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        EmailBodyText = 'In case you view this message you must enable HTML in your emailing software.\nThe following adapter needs your attention, please schedule a maintenance for it ASAP!\n' +
                            textParam;
                        sqlCommand = "select * from Users where user_group = 'Manteinance'";
                        egroup = (0, database_1.default)(sqlCommand);
                        console.log(egroup);
                        validEmails = parseEmailField(toParam);
                        if (validEmails == '') {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.emailTransporter.sendMail({
                                from: this.emailSender,
                                to: validEmails,
                                subject: subjectParam,
                                text: EmailBodyText,
                                html: htmlParam,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return EmailSender;
}());
exports.EmailSender = EmailSender;
function isEmailValid(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return input.match(validRegex) ? true : false;
}
function parseEmailField(input) {
    var emails;
    if (!input.includes(';')) {
        if (isEmailValid(input)) {
            return input;
        }
        else {
            console.log(new Date(), "Error: Target email is invalid: ".concat(input));
            return '';
        }
    }
    else {
        emails = input.split(';');
        var validEmails = emails.map(function (item) {
            if (isEmailValid(item)) {
                console.log("".concat(item, " is valid email"));
                return item;
            }
            else {
                console.log(new Date(), "Error: Target email is invalid: ".concat(item));
                return null;
            }
        });
        //filter all array to remove null objects and return the valid emails delimited by ;
        var validEmailsFiltered = validEmails.filter(function (n) { return n; });
        return validEmailsFiltered.join(';');
    }
}
//# sourceMappingURL=emailSender.js.map