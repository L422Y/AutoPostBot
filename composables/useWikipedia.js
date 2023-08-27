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
exports.getArticleFromURL = exports.getArticleTitleFromURL = exports.getWikipediaArticleFromCategory = exports.getRandomWikipediaArticle = void 0;
var axios_1 = require("axios");
var cheerio = require("cheerio");
var url = require("url");
var getRandomWikipediaArticle = function (categories) { return __awaiter(void 0, void 0, void 0, function () {
    var randomCategory, articleURL, article;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                randomCategory = categories[Math.floor(Math.random() * categories.length)];
                console.log("Random Category: ".concat(randomCategory));
                return [4 /*yield*/, (0, exports.getWikipediaArticleFromCategory)(randomCategory)];
            case 1:
                articleURL = _a.sent();
                if (!articleURL) {
                    return [2 /*return*/, null];
                }
                return [4 /*yield*/, (0, exports.getArticleFromURL)(articleURL)];
            case 2:
                article = _a.sent();
                if (!article) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, { body: article, url: articleURL, category: randomCategory, title: (0, exports.getArticleTitleFromURL)(articleURL) }];
        }
    });
}); };
exports.getRandomWikipediaArticle = getRandomWikipediaArticle;
var getWikipediaArticleFromCategory = function (category) { return __awaiter(void 0, void 0, void 0, function () {
    var response, pages, articles, randomArticle, articleURL, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get("https://en.wikipedia.org/w/api.php", {
                        params: {
                            action: "query",
                            list: "categorymembers",
                            cmtitle: "Category:".concat(category),
                            cmlimit: 500,
                            format: "json",
                        },
                    })];
            case 1:
                response = _a.sent();
                pages = response.data.query.categorymembers;
                articles = pages.filter(function (page) { return page.ns === 0; }).filter(function (page) {
                    return !page.title.includes("List of")
                        && !page.title.includes("Index of")
                        && !page.title.includes("Template:")
                        && !page.title.includes("Category:")
                        && !page.title.includes("Portal:")
                        && !page.title.includes("File:")
                        && !page.title.includes("Help:")
                        && !page.title.includes("Outline of");
                });
                if (articles.length === 0) {
                    console.log("No articles found.");
                    return [2 /*return*/];
                }
                randomArticle = articles[Math.floor(Math.random() * articles.length)];
                articleURL = "https://en.wikipedia.org/wiki/".concat(encodeURIComponent(randomArticle.title));
                console.log("Random Article URL: ".concat(articleURL));
                return [2 /*return*/, articleURL];
            case 2:
                error_1 = _a.sent();
                console.error("Failed to get articles: ".concat(error_1));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/, null];
        }
    });
}); };
exports.getWikipediaArticleFromCategory = getWikipediaArticleFromCategory;
var getArticleTitleFromURL = function (articleURL) {
    var _a;
    var parsedURL = url.parse(articleURL);
    var title = decodeURIComponent(((_a = parsedURL.pathname) === null || _a === void 0 ? void 0 : _a.split("/wiki/")[1]) || "");
    if (!title) {
        console.error("Invalid Wikipedia URL");
        return null;
    }
    return title;
};
exports.getArticleTitleFromURL = getArticleTitleFromURL;
var getArticleFromURL = function (articleURL) { return __awaiter(void 0, void 0, void 0, function () {
    var title, response, htmlContent, $, body, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                title = (0, exports.getArticleTitleFromURL)(articleURL);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get("https://en.wikipedia.org/w/api.php", {
                        params: {
                            action: "parse",
                            page: title,
                            format: "json",
                            prop: "text",
                            disabletoc: true, // disables table of contents in the output
                        },
                    })];
            case 2:
                response = _a.sent();
                htmlContent = response.data.parse.text["*"];
                $ = cheerio.load(htmlContent);
                body = $(".mw-parser-output")
                    .children("p,  h2, h3, h4, h5, h6, blockquote, pre")
                    .not("#See_also, #References, #External_links, #Further_reading, #Notes, .mw-empty-elt, .mw-editsection, .toc, .thumb, .tright, .infobox, .navbox, .vertical-navbox, .mw-jump-link, .mw-references-wrap, .mw-references-wrap, .mw-cite-backlink, .mw-editsection-bracket, .mw-editsection-divider, .mw-editsection-like, .mw-editsection-like")
                    .text()
                    .replace(/\[\d+\]/g, "")
                    .replace(/\[\w+\]/g, "");
                return [2 /*return*/, body];
            case 3:
                error_2 = _a.sent();
                console.error("Failed to get article body: ".concat(error_2));
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getArticleFromURL = getArticleFromURL;
