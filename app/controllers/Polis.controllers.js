const models = require('../models');

const Polis = models.Polis;
const Op = models.Sequelize.Op;

/**
 * 
 * @returns 
 */
exports.get = async () => {
    const polis = await Polis.findAll({
        raw: true,
    });
    return polis;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
exports.find = async (param) => {
    const poli = await Polis.findOne({
        raw: true,
        where: {
            poli_id: {
                [Op.eq]: param
            }
        }
    });
    return poli;
}