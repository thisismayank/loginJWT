'use strict';

module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define('users', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING,
        userCode: {
            type: DataTypes.STRING,
            unique: true,
        },
        dob: DataTypes.DATE,
        isActive: DataTypes.BOOLEAN,
        loginRetryCount: DataTypes.INTEGER
    });

    User.associate = function(models) {
        User.belongsToMany(models.File, {
            through: 'user-file-mapping',
            foreignKey: 'userId'
        });
    };

    return User;
}