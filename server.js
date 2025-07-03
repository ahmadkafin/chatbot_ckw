const db = require('./app/models');
const utils = require('./app/utils');
const whatsapp = utils.whatsapp;

const controllers = require('./app/controllers')
const Polis = controllers.Polis;
const Schedules = controllers.Schedules;

db.sequelize.sync();
whatsapp.makeWhatsappSocket();

// async function main() {
//     // const p = await Polis.get();
//     const p = await Schedules.get("P001")
//     console.log(p);
// }

// main();