import { Sequelize } from "sequelize";

const db = new Sequelize('smsksjiz','smsksjiz', 'f1fOPcWCQhe3EjannsJ9qxi7AEN2qwAR',  {
    host: 'kala.db.elephantsql.com',
    dialect: 'postgres' 
} )


export default db 


