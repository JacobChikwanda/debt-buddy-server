'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({debts}) {
      // define association here
      this.hasMany(debts, {
        foreignKey: 'customerId',
        onDelete: 'set null'
      })
    }
  }
  customers.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    creatorId: DataTypes.INTEGER,
    email: DataTypes.STRING,
    phoneNo: {
      type: DataTypes.STRING,
      unique: true
    },
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'customers',
  });
  return customers;
};