import { DataTypes, HasMany, Model, Optional, Sequelize } from "sequelize"
import sequelise from '../config/db.js'
import Product from './productModel.js'
import User from "./userModel.js"
export interface ReviewAttributes{
    id:number
    userId:number
    productId:Number
    RatingValue:number
    review:string
}
 interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id'>{}

 class Review extends Model<ReviewAttributes,ReviewCreationAttributes> implements ReviewAttributes{
   public id!:number
    public userId!: number
    public  productId!: number
    public  RatingValue!: number
    public review!: string

 }
 
 Review.init({
    id:{
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        type:DataTypes.NUMBER
    },
    productId:{
        allowNull:false,
        type:DataTypes.NUMBER
    },
    userId:{
        allowNull:false,
        type:DataTypes.NUMBER
    },
    RatingValue:{
        allowNull:false,
        type:DataTypes.NUMBER
    },
    review:{
        allowNull:true,
        type:DataTypes.STRING
    },
    
 },
 {
    sequelize:sequelise,
    modelName:'reviews',
    tableName:'reviews'
},)

Review.belongsTo(User, {foreignKey:'userId' as 'user'})
Product.hasMany(Review,{foreignKey:'userId' as 'review'})
export default Review


