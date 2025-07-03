const core = require('../../core/');
const Sequelize = require('sequelize');


const sequelize = core.connections.sequelize(Sequelize);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Polis = require('./Polis.models')(sequelize, Sequelize);
db.Schedules = require('./Schedules.models')(sequelize, Sequelize, db.Polis);
db.Mcus = require('./Mcus.models')(sequelize, Sequelize);
db.PriceMcus = require('./Price.mcus.models')(sequelize, Sequelize, db.Mcus);

require('./relationship.models')(db);
module.exports = db;