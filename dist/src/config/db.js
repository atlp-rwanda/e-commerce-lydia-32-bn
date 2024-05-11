"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db = new sequelize_1.Sequelize('smsksjiz', 'smsksjiz', 'f1fOPcWCQhe3EjannsJ9qxi7AEN2qwAR', {
    host: 'kala.db.elephantsql.com',
    dialect: 'postgres'
});
exports.default = db;
