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
exports.generateImage = exports.generateTweet = void 0;
var axios_1 = require("axios");
var dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
var apiKey = process.env.OPENAI_KEY;
var OPENAI_INITIAL_PROMPT = process.env.OPENAI_INITIAL_PROMPT;
if (OPENAI_INITIAL_PROMPT === undefined || OPENAI_INITIAL_PROMPT === null || OPENAI_INITIAL_PROMPT === "") {
    OPENAI_INITIAL_PROMPT = "Generate a 200 character tweet like one of these:\n    \n    \"New electronic waste from discarded gadgets makes up for 70% of all toxic waste. Let's consider recycling and upcycling our tech to create a healthier environment for us all.\"\n    \"In the realm of technology, the first alarm clock could only ring at 4am! Created by Levi Hutchins in 1787, its sole purpose was to wake him for his pre-dawn job. Truly an early bird that transformed the way we start our days.\"\n    \"The first computer mouse was made of wood! Created by Douglas Engelbart in 1964, it was a simple wooden shell with two metal wheels. It was later patented in 1970.\"\n    \n    Do not make it a question, avoid using or featuring gender or politics, do not use phrases like \"Did you know\". The simple tweet should include a single interesting fact about the following:";
}
var headers = {
    "Authorization": "Bearer ".concat(apiKey),
    "Content-Type": "application/json",
};
var generateTweet = function (content) { return __awaiter(void 0, void 0, void 0, function () {
    var model, endpoint, prompt, response, content_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = "gpt-4";
                endpoint = "https://api.openai.com/v1/chat/completions";
                prompt = "".concat(OPENAI_INITIAL_PROMPT, "\n\n").concat(content);
                prompt = prompt.substring(0, 1024);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                response = void 0;
                return [4 /*yield*/, axios_1.default.post(endpoint, {
                        model: model,
                        temperature: 0.2,
                        max_tokens: 200,
                        top_p: 0.1,
                        messages: [{
                                "role": "user",
                                "content": prompt
                            }]
                    }, {
                        headers: {
                            "Authorization": "Bearer ".concat(apiKey),
                            "Content-Type": "application/json",
                        },
                    })];
            case 2:
                response = _a.sent();
                content_1 = response.data.choices[0].message.content;
                if (!(content_1.length > 280)) return [3 /*break*/, 4];
                console.log('Shortening...');
                return [4 /*yield*/, axios_1.default.post(endpoint, {
                        model: model,
                        messages: [{
                                "role": "user",
                                "content": "Condense this tweet: ".concat(content_1)
                            }]
                    }, {
                        headers: {
                            "Authorization": "Bearer ".concat(apiKey),
                            "Content-Type": "application/json",
                        },
                    })];
            case 3:
                response = _a.sent();
                content_1 = response.data.choices[0].message.content;
                _a.label = 4;
            case 4: return [2 /*return*/, content_1];
            case 5:
                error_1 = _a.sent();
                console.error("Error generating tweet: ".concat(error_1));
                if (error_1.response) {
                    console.log(error_1.response.data);
                    console.log(error_1.response.status);
                    console.log(error_1.response.headers);
                }
                return [2 /*return*/, null];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.generateTweet = generateTweet;
var generateImage = function (prompt) { return __awaiter(void 0, void 0, void 0, function () {
    var endpoint, response, data, image, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                endpoint = "https://api.openai.com/v1/images/generations";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post(endpoint, {
                        prompt: prompt,
                        n: 1,
                        size: "1024x1024"
                    }, {
                        headers: headers,
                    })];
            case 2:
                response = _a.sent();
                data = response.data;
                console.log(JSON.stringify(data, null, 2));
                image = data.images[0];
                // save image to file
                // const imageBuffer = Buffer.from(image, "base64")
                // fs.writeFileSync("image.png", imageBuffer)
                console.log("Generated image:", image.data.url);
                return [2 /*return*/, image];
            case 3:
                error_2 = _a.sent();
                console.error("Error generating image: ".concat(error_2));
                if (error_2.response) {
                    console.log(error_2.response.data);
                    console.log(error_2.response.status);
                    console.log(error_2.response.headers);
                }
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.generateImage = generateImage;
// Example usage
// generateTweet("technology")
//     .then((tweet) => {
//         if (tweet) {
//             console.log(JSON.stringify(tweet, null, 2))
//             console.log(`Generated Tweet: ${tweet}`)
//         } else {
//             console.log("Failed to generate a tweet.")
//         }
//     })
//     .catch((error) => {
//         console.error(`Error generating tweet: ${error}`)
//
//     })
