import { Sequelize, DataTypes } from "sequelize";
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(process.env.DB_Name, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
    // logging: false,
})

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false},
    image: {type: DataTypes.STRING, allowNull: false},
    productType: { type: DataTypes.STRING, defaultValue: 'kidswear' },
    price: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    timeLeft: { type: DataTypes.INTEGER, allowNull: false },
    totalSales: { type: DataTypes.INTEGER, allowNull: false },
})


sequelize.sync({ alter: true })
    .then(() => console.log("👕 Product table synced"))
    .catch(err => console.error("⚔️ Error syncing Product table: ", err))

export default Product