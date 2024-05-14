import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
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
        type: new DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    street: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    city: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    state: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    postal_code: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    country: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    tableName: 'users',
    sequelize, // passing the `sequelize` instance
});
export default User;
