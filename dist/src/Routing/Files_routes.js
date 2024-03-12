"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path")); // Import the path module
const base = "http://localhost:3000/";
// Use path.join to generate platform-specific file paths
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join('public')); // Use path.join for platform-specific file paths
    },
    filename: function (req, file, cb) {
        const ext = path_1.default.extname(file.originalname); // Use path.extname to get file extension
        cb(null, Date.now() + ext); // Use path.extname to keep the extension intact
    }
});
const upload = (0, multer_1.default)({ storage: storage });
router.post('/', upload.single("file"), function (req, res) {
    const filePath = req.file.path.replace(/\\/g, "/"); // Convert backslashes to forward slashes
    console.log("router.post(/file: " + base + filePath);
    res.status(200).send({ url: base + filePath });
});
module.exports = router;
//# sourceMappingURL=Files_routes.js.map