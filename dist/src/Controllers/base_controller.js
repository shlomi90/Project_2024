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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    constructor(model) {
        this.model = model;
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            try {
                const obj = yield this.model.create(req.body);
                res.send(obj).status(200);
            }
            catch (err) {
                console.error(err);
                res.status(500).send('Unable to save data to database');
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.model.findById(req.params.id);
                res.send(user);
            }
            catch (err) {
                console.error(err);
                res.status(500).send('Unable to retrieve data from database');
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.model.find();
                res.send(users);
            }
            catch (err) {
                console.error(err);
                res.status(500).send('Unable to retrieve data from database');
            }
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const obj = req.body;
                yield this.model.findByIdAndUpdate(id, obj);
                res.status(200).send('Data updated in database');
            }
            catch (err) {
                console.error(err);
                res.status(500).send('Unable to update data in database');
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                yield this.model.findByIdAndDelete(id);
                res.status(200).send('Data deleted');
            }
            catch (err) {
                console.error(err);
                res.status(500).send('Unable to delete user from database');
            }
        });
    }
}
exports.BaseController = BaseController;
const createController = (model) => new BaseController(model);
exports.default = createController;
//# sourceMappingURL=Base_Controller.js.map