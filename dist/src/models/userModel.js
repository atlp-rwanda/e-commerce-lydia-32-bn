import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
class User extends Model {
    id;
    firstname;
    othername;
    email;
    phone;
    password;
    usertype;
    street;
    city;
    state;
    postal_code;
    country;
    isverified;
    isAdmin;
    // Timestamps
    createdAt;
    updatedAt;
}
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstname: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    othername: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    email: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    phone: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    password: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    usertype: {
        type: DataTypes.ENUM('buyer', 'seller'),
        defaultValue: 'buyer'
    },
    street: {
        type: new DataTypes.STRING(128),
    },
    city: {
        type: new DataTypes.STRING(128),
    },
    state: {
        type: new DataTypes.STRING(128),
    },
    postal_code: {
        type: new DataTypes.STRING(128),
    },
    country: {
        type: new DataTypes.STRING(128),
    },
    isverified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    tableName: 'users',
    sequelize, // passing the `sequelize` instance
});
export default User;
