module.exports = function (sequelize, DataTypes) {
	return sequelize.define('message', {
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1,250]
			}
		},

		timestamp: {
			type: DataTypes.STRING,
			allowNull: false
		},

		content: {
			type: DataTypes.STRING,
			allowNull: false
		}
		
	});

};