module.exports = function(sequelize, DataTypes) {
	return sequelize.define('employees', {
		id: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(256),
			allowNull: false
		},
		email: {
			type: DataTypes.STRING(30),
			allowNull: false
		},
        hire_date: {
            type: DataTypes.DATE,
			allowNull: false
        },
        salary: {
            type: DataTypes.DOUBLE(10).UNSIGNED,
			allowNull: false
        },
        job_title: {
            type: DataTypes.STRING(64),
			allowNull: false
        },
        project_id: {
            type: DataTypes.INTEGER(10),
			allowNull: false
        }
	}, {
		tableName: 'employees',
		timestamps: false
	});
};