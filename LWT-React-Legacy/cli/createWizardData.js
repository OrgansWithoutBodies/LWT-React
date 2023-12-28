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
exports.parseWizardCSV = exports.parseWizardData = exports.LangDefValidator = exports.loadCSV = exports.getGoogleSheets = void 0;
var axios_1 = require("axios");
var fs = require("fs");
var papaparse_1 = require("papaparse");
var ss = require("superstruct");
var overwriteURI = 'data/wizard/wizardData.overwrite.csv';
var defaultURI = 'data/wizard/wizardData.default.csv';
/**
 *
 */
function getGoogleSheets(_a) {
    var 
    //   spreadsheetID,
    //   sheetID,
    url = _a.url;
    return __awaiter(this, void 0, void 0, function () {
        var txt;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, axios_1.default
                        .get(url
                    //   `https://docs.google.com/spreadsheets/d/${spreadsheetID}/gviz/tq?tqx=out:csv&tq&gid=${sheetID}`
                    )
                        .then(function (val) { return val.data; })];
                case 1:
                    txt = _b.sent();
                    return [2 /*return*/, (0, papaparse_1.parse)(txt)];
            }
        });
    });
}
exports.getGoogleSheets = getGoogleSheets;
// TODO
function loadCSV(_a) {
    var filePath = _a.filePath, _b = _a.delimiter, delimiter = _b === void 0 ? ',' : _b;
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_c) {
            data = (0, papaparse_1.parse)(filePath, { delimiter: delimiter });
            return [2 /*return*/, data];
        });
    });
}
exports.loadCSV = loadCSV;
exports.LangDefValidator = ss.object({
    LgGTransKey: ss.string(),
    LgGlosbeKey: ss.string(),
    LgTextSize: ss.number(),
    LgRegexpWordCharacters: ss.regexp(),
    LgRegexpSplitSentences: ss.regexp(),
    LgSplitEachChar: ss.boolean(),
    LgRemoveSpaces: ss.boolean(),
    LgRightToLeft: ss.boolean(),
});
function parseWizardData(dataURI) {
    return __awaiter(this, void 0, void 0, function () {
        var data, file, buffer, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    data = null;
                    if (!new RegExp('https://docs.google.com/spreadsheets/d/.*/gviz/tq').test(dataURI)) return [3 /*break*/, 2];
                    return [4 /*yield*/, getGoogleSheets({ url: dataURI })];
                case 1:
                    data = _c.sent();
                    return [3 /*break*/, 4];
                case 2:
                    if (!true) return [3 /*break*/, 4];
                    return [4 /*yield*/, loadCSV({ filePath: dataURI })];
                case 3:
                    data = _c.sent();
                    _c.label = 4;
                case 4:
                    if (data === null) {
                        throw new Error('Parsing Error!');
                    }
                    file = new Blob([(0, papaparse_1.unparse)(data.data)], {
                        type: 'text/csv;charset=utf-8;',
                    });
                    _b = (_a = Buffer).from;
                    return [4 /*yield*/, file.arrayBuffer()];
                case 5:
                    buffer = _b.apply(_a, [_c.sent()]);
                    fs.writeFile('data/wizard/wizardData.overwrite.csv', buffer, function () {
                        return console.log('file saved!');
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.parseWizardData = parseWizardData;
if (process.argv.length < 3) {
    throw new Error('Wizard Must Be Supplied Data! <|:^(');
}
function parseWizardCSV() {
    return __awaiter(this, void 0, void 0, function () {
        var data, fileData, fileData, lookupIndexByKey, dataObj;
        return __generator(this, function (_a) {
            data = null;
            console.log(overwriteURI);
            if (fs.existsSync(overwriteURI)) {
                fileData = fs.readFileSync(overwriteURI);
                // we expect to be able to handle the file all at once, no streaming
                data = (0, papaparse_1.parse)(fileData.toString());
            }
            else {
                fileData = fs.readFileSync(defaultURI);
                data = (0, papaparse_1.parse)(fileData.toString());
            }
            if (data === null) {
                throw new Error('Parse Error! Does a default or overwrite file exist?');
            }
            console.log(data);
            lookupIndexByKey = Object.fromEntries(data.data[0].map(function (val, ii) { return [val, ii]; }));
            dataObj = Object.fromEntries(data.data.slice(1).map(function (row) { return [
                row[lookupIndexByKey['LgName']],
                {
                    LgGTransKey: row[lookupIndexByKey['LgGTransKey']],
                    LgGlosbeKey: row[lookupIndexByKey['LgGlosbeKey']],
                    LgTextSize: Number.parseInt(row[lookupIndexByKey['LgTextSize']]),
                    LgRegexpWordCharacters: row[lookupIndexByKey['LgRegexpWordCharacters']],
                    LgRegexpSplitSentences: row[lookupIndexByKey['LgRegexpSplitSentences']],
                    LgSplitEachChar: row[lookupIndexByKey['LgSplitEachChar']] === 'FALSE' ? false : true,
                    LgRemoveSpaces: row[lookupIndexByKey['LgRemoveSpaces']] === 'FALSE' ? false : true,
                    LgRightToLeft: row[lookupIndexByKey['LgRightToLeft']] === 'FALSE' ? false : true,
                },
            ]; }));
            fs.writeFileSync('data/wizard/wizard.data.ts', "export const WizardData = ".concat(JSON.stringify(dataObj), " as const;\n    \nexport const AvailableLangs=").concat(JSON.stringify(Object.keys(dataObj)), " as const;\n\nexport type LangKey = (typeof AvailableLangs)[number]"));
            return [2 /*return*/];
        });
    });
}
exports.parseWizardCSV = parseWizardCSV;
function wizard() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, parseWizardData(process.argv[2])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, parseWizardCSV()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
wizard();
