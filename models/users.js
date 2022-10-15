const bcrypt = require('bcryptjs');
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init(
    {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING
    },
    {
        hooks: {
            beforeCreate: async(user) => {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.dataValues.password, salt);
            
            user.dataValues.password = hash
            },
            beforeUpdate: async(user) => {
            if (user.dataValues.password) {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(user.dataValues.password, salt);
                
                user.dataValues.password = hash
            }
            }
        },
        sequelize,
        modelName: 'users',
    }
  );
  return users;
};