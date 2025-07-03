module.exports = (db) => {
    db.Polis.hasMany(db.Schedules, {
        foreignKey: 'p_id',
        targetKey: 'p_id',
        sourceKey: 'poli_id',
        constraint: false,
    });
    db.Mcus.hasMany(db.PriceMcus, {
        foreignKey: 'mcu_id',
        targetKey: 'mcu_id',
        sourceKey: 'mcus_id',
        constraint: false,
    })

    db.Schedules.belongsTo(db.Polis, {
        foreignKey: 'p_id',
        targetKey: 'poli_id',
        sourceKey: 'poli_id',
        constraint: false,
    })
    db.PriceMcus.belongsTo(db.Mcus, {
        foreignKey: 'mcu_id',
        targetKey: 'mcus_id',
        sourceKey: 'mcus_id',
        constraint: false,
    })

}