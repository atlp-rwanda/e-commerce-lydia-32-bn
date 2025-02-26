import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';

interface PostAttributes {
  id: number;
  room: string;
  content: string;
  name: string;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;

  public room!: string;

  public content!: string;

  public name!: string
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    room: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Posts',
  },
);

export default Post;
