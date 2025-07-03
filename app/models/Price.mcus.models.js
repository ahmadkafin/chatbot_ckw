module.exports = (sequelize, Sequelize, Mcus) => {
    const PriceMcus = sequelize.define('price_mcus', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        mcu_id: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: Mcus,
                key: 'mcus_id'
            }
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        price: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
            }
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
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
        underscore: true,
    });
    return PriceMcus;
}