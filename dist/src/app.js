"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const member_route_1 = __importDefault(require("./Routing/member_route"));
const post_route_1 = __importDefault(require("./Routing/post_route"));
const user_route_1 = __importDefault(require("./Routing/user_route"));
const comments_route_1 = __importDefault(require("./Routing/comments_route"));
const Files_routes_1 = __importDefault(require("./Routing/Files_routes"));
const initApp = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', () => { console.log("DB connected 👍"); });
        mongoose_1.default.connect(process.env.DB_URL).then(() => {
            const app = (0, express_1.default)();
            app.use(body_parser_1.default.json());
            app.use(body_parser_1.default.urlencoded({ extended: true }));
            app.use((0, cors_1.default)());
            app.use('/member', member_route_1.default);
            app.use('/post', post_route_1.default);
            app.use('/auth', user_route_1.default);
            app.use(comments_route_1.default);
            app.use('/file', Files_routes_1.default);
            app.use("/public", express_1.default.static('public'));
            resolve(app);
        });
    });
    return promise;
};
exports.default = initApp;
//# sourceMappingURL=app.js.map