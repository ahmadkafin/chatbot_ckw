const model = require('../models');

const Schedules = model.Schedules;
const Op = model.Sequelize.Op;

/**
 * 
 * @param {*} param 
 * @returns 
 */
exports.get = async (param) => {
    const schedule = await Schedules.findAll({
        raw: true,
        where: {
            p_id: {
                [Op.eq]: param
            }
        }
    });
    return schedule;
}