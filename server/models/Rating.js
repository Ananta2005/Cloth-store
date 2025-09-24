import { Sequelize ,DataTypes } from 'sequelize'
import Product from "./Product.js"
import User from "./user.js"

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
})


const Rating = sequelize.define("Rating", {
    productId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    ratingValue: { type: DataTypes.FLOAT, allowNull: false, validate: {min: 1, max: 5}, },
    }, { indexes: [
        {
            unique: true,
            fields: ['productId', 'userId']
        }
    ]
})

Rating.belongsTo(Product, {foreignKey: "productId", onDelete: 'CASCADE', onUpdate: 'CASCADE', })
Rating.belongsTo(User, {foreignKey: "userId" })

Product.hasMany(Rating, {foreignKey: 'productId', onDelete: 'CASCADE', onUpdate: 'CASCADE',})


sequelize.sync({ alter: true })
         .then(() => console.log("⭐ Rating table synced"))
         .catch(err => console.error("⚔️Error syncing Rating table:", err))

export default Rating