const model = require('../models');

const Mcus = model.Mcus;
const Op = model.Sequelize.Op;

/**
 * 
 * @returns 
 */
exports.get = async () => {
    const mcus = await Mcus.findAll({
        raw: true,
    });
    return mcus;
}

exports.find = async (param) => {
    const mcu = await Mcus.findOne({
        raw: true,
        where: {
            mcus_id: {
                [Op.eq]: param,
            }
        }
    });
    return mcu;
}