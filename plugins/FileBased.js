"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.FileBased = void 0;
var BaseTweetPlugin_1 = require("../lib/BaseTweetPlugin");
var fs = require("fs");
var path = require("path");
var FileBased = /** @class */ (function (_super) {
    __extends(FileBased, _super);
    function FileBased() {
        var _this = _super.call(this) || this;
        _this.name = "FileBased";
        _this.tweets = {};
        _this.generateTweet = _this.generateTweet.bind(_this);
        _this.loadTweets = _this.loadTweets.bind(_this);
        _this.loadTweets();
        return _this;
    }
    FileBased.prototype.generateTweet = function () {
        return __awaiter(this, void 0, void 0, function () {
            var availableTweets, tweetContent;
            var _this = this;
            return __generator(this, function (_a) {
                availableTweets = this.tweetsArray.filter(function (tweet) { return !_this.sentTweetIDs.has(tweet.id); });
                if (availableTweets.length === 0)
                    return [2 /*return*/];
                tweetContent = availableTweets[Math.floor(Math.random() * availableTweets.length)];
                this.log("Pulled Tweet (".concat(tweetContent.id, "): ").concat(tweetContent.text));
                this.lastTweet = tweetContent;
                return [2 /*return*/, tweetContent.text];
            });
        });
    };
    FileBased.prototype.confirmTweetSent = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.lastTweet)
                    return [2 /*return*/];
                this.sentTweetIDs.add(this.lastTweet.id);
                // write sent tweet to file
                fs.appendFileSync(this.sentTweetsFile, this.lastTweet.id + "\n");
                this.lastTweet = undefined;
                return [2 /*return*/];
            });
        });
    };
    FileBased.prototype.loadTweets = function () {
        var _this = this;
        // load all tweets from tweets folder
        var tweetFiles = fs.readdirSync("./tweets/", "utf-8");
        var _loop_1 = function (tweetFile) {
            if (!tweetFile.match(/\.json$/))
                return "continue";
            var tweetFileData = fs.readFileSync(path.join("./tweets/", tweetFile), "utf-8");
            var tweetFileJSON = JSON.parse(tweetFileData);
            Object.entries(tweetFileJSON).forEach(function (_a) {
                var id = _a[0], text = _a[1];
                var key = "".concat(tweetFile.replace(/\.json$/, ""), "-").concat(id);
                _this.tweets[key] = text;
            });
            this_1.sentTweetsFile = "sent-tweets.txt";
            this_1.tweetsArray = Object.entries(this_1.tweets).map(function (_a) {
                var id = _a[0], text = _a[1];
                return ({ id: id, text: text });
            });
        };
        var this_1 = this;
        for (var _i = 0, tweetFiles_1 = tweetFiles; _i < tweetFiles_1.length; _i++) {
            var tweetFile = tweetFiles_1[_i];
            _loop_1(tweetFile);
        }
        this.log("Loaded ".concat(this.tweetsArray.length, " tweets from ").concat(tweetFiles.length, " files."));
        this.sentTweetIDs = new Set(fs.existsSync(this.sentTweetsFile) ? fs.readFileSync(this.sentTweetsFile, "utf-8").split("\n") : []);
    };
    return FileBased;
}(BaseTweetPlugin_1.BaseTweetPlugin));
exports.FileBased = FileBased;
