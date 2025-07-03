const model = require('../models');

const PriceMcus = model.PriceMcus;
const Op = model.Sequelize.Op;


/**
 * 
 * @param {*} param 
 * @returns 
 */
exports.get = async (param) => {
    const priceMcus = await PriceMcus.findAll({
        raw: true,
        where: {
            mcu_id: {
                [Op.eq]: param,
            }
        }
    });
    return priceMcus;
}