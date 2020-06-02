"use strict";
exports.__esModule = true;
var express_1 = require("express");
var routes = express_1.Router();
routes.get('/', function (req, res) {
    return res.json({ hello: 'world' });
});
exports["default"] = routes;
