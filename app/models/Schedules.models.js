module.exports = (sequelize, Sequelize, Polis) => {
    const Schedules = sequelize.define('schedules', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        p_id: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: Polis,
                key: 'poli_id',
            }
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        date: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: false,
        },
        time_start: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        time_end: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        poli_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        is_leave: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
            field: 'created_at'
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
            field: 'updated_at'
        }
    }, {
        timestamps: true,
        underscored: true,
    });
    return Schedules;
}