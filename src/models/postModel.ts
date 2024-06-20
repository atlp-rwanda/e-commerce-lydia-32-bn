import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';

interface PostAttributes {
  id: number;
  room: string;
  content: string;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;

  public room!: string;

  public content!: string;
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
  },
  {
    sequelize,
    modelName: 'Posts',
  },
);

export default Post;
