// =======================
// configuration db =========
// =======================
var connectionString = process.env.DATABASE_URL || 'postgres://username:passsss@localhost/portalchart';
module.exports = connectionString;