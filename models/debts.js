'use strict';
const {
  Model
} = require('sequelize');
const { DEBTS_LABEL } = require('../misc/Constants');
module.exports = (sequelize, DataTypes) => {
  class debts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({customers}) {
      // define association here
      this.belongsTo(customers, {
        foreignKey: 'customerId',
        onDelete: 'set null'
      })
    }
  }
  debts.init({
    collectionDate: DataTypes.STRING,
    returnDate: DataTypes.STRING,
    debtsOwner: DataTypes.INTEGER, 
    amount: {
      type: DataTypes.DECIMAL(8, 2),
      defaultValue: 0.00
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: DEBTS_LABEL.pending
    }
  }, {
    sequelize,
    modelName: 'debts',
  });
  return debts;
};