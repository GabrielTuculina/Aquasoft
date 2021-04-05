module.exports = function(sequelize, DataTypes) {
	return sequelize.define('projects', {
		id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		project_name: {
			type: DataTypes.STRING(256),
			allowNull: false
		},
        start_date: {
            type: DataTypes.DATE,
			allowNull: false
        },
        planned_end_date: {
            type: DataTypes.DATE,
			allowNull: false
        },
		description: {
			type: DataTypes.STRING(256),
			allowNull: false
		},
		project_code: {
			type: DataTypes.STRING(30),
			allowNull: false
		}
	}, {
		tableName: 'projects',
		timestamps: false
	});
};