/**
 * BigDataBrain
 *
 */

/**
 * General configuration
 */
var config = {};

config.baseUrl = 'http://api.getin.mx/bdb';
config.dashUrl = 'http://api.getin.mx/appv2';
config.uploadUrl = 'http://api.getin.mx/bdb/img/upload'

// config.baseUrl = 'http://staging.getin.mx/bdb';
// config.dashUrl = 'http://staging.getin.mx/appv2';
// config.uploadUrl = 'http://staging.getin.mx/bdb/img/upload'

//config.baseUrl = 'http://r2d2.getin.mx/bdb';
//config.dashUrl = 'http://r2d2.getin.mx/appv2';
//config.uploadUrl = 'http://r2d2.getin.mx/bdb/img/upload'

// config.baseUrl = 'http://r2d2.getin.mx/bdb';
// config.dashUrl = 'http://r2d2.getin.mx/appv2';
// config.uploadUrl = 'http://r2d2.getin.mx/bdb/img/upload'

config.oneMonth = 2505600000;
config.oneWeek = 518400000;
config.threeWeeks = 1987200000;
config.oneDay = 86400000;

config.retailCalendar = JSON.parse('[{"id":0,"index":1,"fromDate":"2016-01-04","name":"2016 Semana 1: 2016-01-04 - 2016-01-10","year":2016,"toDate":"2016-01-10"},{"id":1,"index":2,"fromDate":"2016-01-11","name":"2016 Semana 2: 2016-01-11 - 2016-01-17","year":2016,"toDate":"2016-01-17"},{"id":2,"index":3,"fromDate":"2016-01-18","name":"2016 Semana 3: 2016-01-18 - 2016-01-24","year":2016,"toDate":"2016-01-24"},{"id":3,"index":4,"fromDate":"2016-01-25","name":"2016 Semana 4: 2016-01-25 - 2016-01-31","year":2016,"toDate":"2016-01-31"},{"id":4,"index":5,"fromDate":"2016-02-01","name":"2016 Semana 5: 2016-02-01 - 2016-02-07","year":2016,"toDate":"2016-02-07"},{"id":5,"index":6,"fromDate":"2016-02-08","name":"2016 Semana 6: 2016-02-08 - 2016-02-14","year":2016,"toDate":"2016-02-14"},{"id":6,"index":7,"fromDate":"2016-02-15","name":"2016 Semana 7: 2016-02-15 - 2016-02-21","year":2016,"toDate":"2016-02-21"},{"id":7,"index":8,"fromDate":"2016-02-22","name":"2016 Semana 8: 2016-02-22 - 2016-02-28","year":2016,"toDate":"2016-02-28"},{"id":8,"index":9,"fromDate":"2016-02-29","name":"2016 Semana 9: 2016-02-29 - 2016-03-06","year":2016,"toDate":"2016-03-06"},{"id":9,"index":10,"fromDate":"2016-03-07","name":"2016 Semana 10: 2016-03-07 - 2016-03-13","year":2016,"toDate":"2016-03-13"},{"id":10,"index":11,"fromDate":"2016-03-14","name":"2016 Semana 11: 2016-03-14 - 2016-03-20","year":2016,"toDate":"2016-03-20"},{"id":11,"index":12,"fromDate":"2016-03-21","name":"2016 Semana 12: 2016-03-21 - 2016-03-27","year":2016,"toDate":"2016-03-27"},{"id":12,"index":13,"fromDate":"2016-03-28","name":"2016 Semana 13: 2016-03-28 - 2016-04-03","year":2016,"toDate":"2016-04-03"},{"id":13,"index":14,"fromDate":"2016-04-04","name":"2016 Semana 14: 2016-04-04 - 2016-04-10","year":2016,"toDate":"2016-04-10"},{"id":14,"index":15,"fromDate":"2016-04-11","name":"2016 Semana 15: 2016-04-11 - 2016-04-17","year":2016,"toDate":"2016-04-17"},{"id":15,"index":16,"fromDate":"2016-04-18","name":"2016 Semana 16: 2016-04-18 - 2016-04-24","year":2016,"toDate":"2016-04-24"},{"id":16,"index":17,"fromDate":"2016-04-25","name":"2016 Semana 17: 2016-04-25 - 2016-05-01","year":2016,"toDate":"2016-05-01"},{"id":17,"index":18,"fromDate":"2016-05-02","name":"2016 Semana 18: 2016-05-02 - 2016-05-08","year":2016,"toDate":"2016-05-08"},{"id":18,"index":19,"fromDate":"2016-05-09","name":"2016 Semana 19: 2016-05-09 - 2016-05-15","year":2016,"toDate":"2016-05-15"},{"id":19,"index":20,"fromDate":"2016-05-16","name":"2016 Semana 20: 2016-05-16 - 2016-05-22","year":2016,"toDate":"2016-05-22"},{"id":20,"index":21,"fromDate":"2016-05-23","name":"2016 Semana 21: 2016-05-23 - 2016-05-29","year":2016,"toDate":"2016-05-29"},{"id":21,"index":22,"fromDate":"2016-05-30","name":"2016 Semana 22: 2016-05-30 - 2016-06-05","year":2016,"toDate":"2016-06-05"},{"id":22,"index":23,"fromDate":"2016-06-06","name":"2016 Semana 23: 2016-06-06 - 2016-06-12","year":2016,"toDate":"2016-06-12"},{"id":23,"index":24,"fromDate":"2016-06-13","name":"2016 Semana 24: 2016-06-13 - 2016-06-19","year":2016,"toDate":"2016-06-19"},{"id":24,"index":25,"fromDate":"2016-06-20","name":"2016 Semana 25: 2016-06-20 - 2016-06-26","year":2016,"toDate":"2016-06-26"},{"id":25,"index":26,"fromDate":"2016-06-27","name":"2016 Semana 26: 2016-06-27 - 2016-07-03","year":2016,"toDate":"2016-07-03"},{"id":26,"index":27,"fromDate":"2016-07-04","name":"2016 Semana 27: 2016-07-04 - 2016-07-10","year":2016,"toDate":"2016-07-10"},{"id":27,"index":28,"fromDate":"2016-07-11","name":"2016 Semana 28: 2016-07-11 - 2016-07-17","year":2016,"toDate":"2016-07-17"},{"id":28,"index":29,"fromDate":"2016-07-18","name":"2016 Semana 29: 2016-07-18 - 2016-07-24","year":2016,"toDate":"2016-07-24"},{"id":29,"index":30,"fromDate":"2016-07-25","name":"2016 Semana 30: 2016-07-25 - 2016-07-31","year":2016,"toDate":"2016-07-31"},{"id":30,"index":31,"fromDate":"2016-08-01","name":"2016 Semana 31: 2016-08-01 - 2016-08-07","year":2016,"toDate":"2016-08-07"},{"id":31,"index":32,"fromDate":"2016-08-08","name":"2016 Semana 32: 2016-08-08 - 2016-08-14","year":2016,"toDate":"2016-08-14"},{"id":32,"index":33,"fromDate":"2016-08-15","name":"2016 Semana 33: 2016-08-15 - 2016-08-21","year":2016,"toDate":"2016-08-21"},{"id":33,"index":34,"fromDate":"2016-08-22","name":"2016 Semana 34: 2016-08-22 - 2016-08-28","year":2016,"toDate":"2016-08-28"},{"id":34,"index":35,"fromDate":"2016-08-29","name":"2016 Semana 35: 2016-08-29 - 2016-09-04","year":2016,"toDate":"2016-09-04"},{"id":35,"index":36,"fromDate":"2016-09-05","name":"2016 Semana 36: 2016-09-05 - 2016-09-11","year":2016,"toDate":"2016-09-11"},{"id":36,"index":37,"fromDate":"2016-09-12","name":"2016 Semana 37: 2016-09-12 - 2016-09-18","year":2016,"toDate":"2016-09-18"},{"id":37,"index":38,"fromDate":"2016-09-19","name":"2016 Semana 38: 2016-09-19 - 2016-09-25","year":2016,"toDate":"2016-09-25"},{"id":38,"index":39,"fromDate":"2016-09-26","name":"2016 Semana 39: 2016-09-26 - 2016-10-02","year":2016,"toDate":"2016-10-02"},{"id":39,"index":40,"fromDate":"2016-10-03","name":"2016 Semana 40: 2016-10-03 - 2016-10-09","year":2016,"toDate":"2016-10-09"},{"id":40,"index":41,"fromDate":"2016-10-10","name":"2016 Semana 41: 2016-10-10 - 2016-10-16","year":2016,"toDate":"2016-10-16"},{"id":41,"index":42,"fromDate":"2016-10-17","name":"2016 Semana 42: 2016-10-17 - 2016-10-23","year":2016,"toDate":"2016-10-23"},{"id":42,"index":43,"fromDate":"2016-10-24","name":"2016 Semana 43: 2016-10-24 - 2016-10-30","year":2016,"toDate":"2016-10-30"},{"id":43,"index":44,"fromDate":"2016-10-31","name":"2016 Semana 44: 2016-10-31 - 2016-11-06","year":2016,"toDate":"2016-11-06"},{"id":44,"index":45,"fromDate":"2016-11-07","name":"2016 Semana 45: 2016-11-07 - 2016-11-13","year":2016,"toDate":"2016-11-13"},{"id":45,"index":46,"fromDate":"2016-11-14","name":"2016 Semana 46: 2016-11-14 - 2016-11-20","year":2016,"toDate":"2016-11-20"},{"id":46,"index":47,"fromDate":"2016-11-21","name":"2016 Semana 47: 2016-11-21 - 2016-11-27","year":2016,"toDate":"2016-11-27"},{"id":47,"index":48,"fromDate":"2016-11-28","name":"2016 Semana 48: 2016-11-28 - 2016-12-04","year":2016,"toDate":"2016-12-04"},{"id":48,"index":49,"fromDate":"2016-12-05","name":"2016 Semana 49: 2016-12-05 - 2016-12-11","year":2016,"toDate":"2016-12-11"},{"id":49,"index":50,"fromDate":"2016-12-12","name":"2016 Semana 50: 2016-12-12 - 2016-12-18","year":2016,"toDate":"2016-12-18"},{"id":50,"index":51,"fromDate":"2016-12-19","name":"2016 Semana 51: 2016-12-19 - 2016-12-25","year":2016,"toDate":"2016-12-25"},{"id":51,"index":52,"fromDate":"2016-12-26","name":"2016 Semana 52: 2016-12-26 - 2017-01-01","year":2016,"toDate":"2017-01-01"},{"id":52,"index":1,"fromDate":"2017-01-02","name":"2017 Semana 1: 2017-01-02 - 2017-01-08","year":2017,"toDate":"2017-01-08"},{"id":53,"index":2,"fromDate":"2017-01-09","name":"2017 Semana 2: 2017-01-09 - 2017-01-15","year":2017,"toDate":"2017-01-15"},{"id":54,"index":3,"fromDate":"2017-01-16","name":"2017 Semana 3: 2017-01-16 - 2017-01-22","year":2017,"toDate":"2017-01-22"},{"id":55,"index":4,"fromDate":"2017-01-23","name":"2017 Semana 4: 2017-01-23 - 2017-01-29","year":2017,"toDate":"2017-01-29"},{"id":56,"index":5,"fromDate":"2017-01-30","name":"2017 Semana 5: 2017-01-30 - 2017-02-05","year":2017,"toDate":"2017-02-05"},{"id":57,"index":6,"fromDate":"2017-02-06","name":"2017 Semana 6: 2017-02-06 - 2017-02-12","year":2017,"toDate":"2017-02-12"},{"id":58,"index":7,"fromDate":"2017-02-13","name":"2017 Semana 7: 2017-02-13 - 2017-02-19","year":2017,"toDate":"2017-02-19"},{"id":59,"index":8,"fromDate":"2017-02-20","name":"2017 Semana 8: 2017-02-20 - 2017-02-26","year":2017,"toDate":"2017-02-26"},{"id":60,"index":9,"fromDate":"2017-02-27","name":"2017 Semana 9: 2017-02-27 - 2017-03-05","year":2017,"toDate":"2017-03-05"},{"id":61,"index":10,"fromDate":"2017-03-06","name":"2017 Semana 10: 2017-03-06 - 2017-03-12","year":2017,"toDate":"2017-03-12"},{"id":62,"index":11,"fromDate":"2017-03-13","name":"2017 Semana 11: 2017-03-13 - 2017-03-19","year":2017,"toDate":"2017-03-19"},{"id":63,"index":12,"fromDate":"2017-03-20","name":"2017 Semana 12: 2017-03-20 - 2017-03-26","year":2017,"toDate":"2017-03-26"},{"id":64,"index":13,"fromDate":"2017-03-27","name":"2017 Semana 13: 2017-03-27 - 2017-04-02","year":2017,"toDate":"2017-04-02"},{"id":65,"index":14,"fromDate":"2017-04-03","name":"2017 Semana 14: 2017-04-03 - 2017-04-09","year":2017,"toDate":"2017-04-09"},{"id":66,"index":15,"fromDate":"2017-04-10","name":"2017 Semana 15: 2017-04-10 - 2017-04-16","year":2017,"toDate":"2017-04-16"},{"id":67,"index":16,"fromDate":"2017-04-17","name":"2017 Semana 16: 2017-04-17 - 2017-04-23","year":2017,"toDate":"2017-04-23"},{"id":68,"index":17,"fromDate":"2017-04-24","name":"2017 Semana 17: 2017-04-24 - 2017-04-30","year":2017,"toDate":"2017-04-30"},{"id":69,"index":18,"fromDate":"2017-05-01","name":"2017 Semana 18: 2017-05-01 - 2017-05-07","year":2017,"toDate":"2017-05-07"},{"id":70,"index":19,"fromDate":"2017-05-08","name":"2017 Semana 19: 2017-05-08 - 2017-05-14","year":2017,"toDate":"2017-05-14"},{"id":71,"index":20,"fromDate":"2017-05-15","name":"2017 Semana 20: 2017-05-15 - 2017-05-21","year":2017,"toDate":"2017-05-21"},{"id":72,"index":21,"fromDate":"2017-05-22","name":"2017 Semana 21: 2017-05-22 - 2017-05-28","year":2017,"toDate":"2017-05-28"},{"id":73,"index":22,"fromDate":"2017-05-29","name":"2017 Semana 22: 2017-05-29 - 2017-06-04","year":2017,"toDate":"2017-06-04"},{"id":74,"index":23,"fromDate":"2017-06-05","name":"2017 Semana 23: 2017-06-05 - 2017-06-11","year":2017,"toDate":"2017-06-11"},{"id":75,"index":24,"fromDate":"2017-06-12","name":"2017 Semana 24: 2017-06-12 - 2017-06-18","year":2017,"toDate":"2017-06-18"},{"id":76,"index":25,"fromDate":"2017-06-19","name":"2017 Semana 25: 2017-06-19 - 2017-06-25","year":2017,"toDate":"2017-06-25"},{"id":77,"index":26,"fromDate":"2017-06-26","name":"2017 Semana 26: 2017-06-26 - 2017-07-02","year":2017,"toDate":"2017-07-02"},{"id":78,"index":27,"fromDate":"2017-07-03","name":"2017 Semana 27: 2017-07-03 - 2017-07-09","year":2017,"toDate":"2017-07-09"},{"id":79,"index":28,"fromDate":"2017-07-10","name":"2017 Semana 28: 2017-07-10 - 2017-07-16","year":2017,"toDate":"2017-07-16"},{"id":80,"index":29,"fromDate":"2017-07-17","name":"2017 Semana 29: 2017-07-17 - 2017-07-23","year":2017,"toDate":"2017-07-23"},{"id":81,"index":30,"fromDate":"2017-07-24","name":"2017 Semana 30: 2017-07-24 - 2017-07-30","year":2017,"toDate":"2017-07-30"},{"id":82,"index":31,"fromDate":"2017-07-31","name":"2017 Semana 31: 2017-07-31 - 2017-08-06","year":2017,"toDate":"2017-08-06"},{"id":83,"index":32,"fromDate":"2017-08-07","name":"2017 Semana 32: 2017-08-07 - 2017-08-13","year":2017,"toDate":"2017-08-13"},{"id":84,"index":33,"fromDate":"2017-08-14","name":"2017 Semana 33: 2017-08-14 - 2017-08-20","year":2017,"toDate":"2017-08-20"},{"id":85,"index":34,"fromDate":"2017-08-21","name":"2017 Semana 34: 2017-08-21 - 2017-08-27","year":2017,"toDate":"2017-08-27"},{"id":86,"index":35,"fromDate":"2017-08-28","name":"2017 Semana 35: 2017-08-28 - 2017-09-03","year":2017,"toDate":"2017-09-03"},{"id":87,"index":36,"fromDate":"2017-09-04","name":"2017 Semana 36: 2017-09-04 - 2017-09-10","year":2017,"toDate":"2017-09-10"},{"id":88,"index":37,"fromDate":"2017-09-11","name":"2017 Semana 37: 2017-09-11 - 2017-09-17","year":2017,"toDate":"2017-09-17"},{"id":89,"index":38,"fromDate":"2017-09-18","name":"2017 Semana 38: 2017-09-18 - 2017-09-24","year":2017,"toDate":"2017-09-24"},{"id":90,"index":39,"fromDate":"2017-09-25","name":"2017 Semana 39: 2017-09-25 - 2017-10-01","year":2017,"toDate":"2017-10-01"},{"id":91,"index":40,"fromDate":"2017-10-02","name":"2017 Semana 40: 2017-10-02 - 2017-10-08","year":2017,"toDate":"2017-10-08"},{"id":92,"index":41,"fromDate":"2017-10-09","name":"2017 Semana 41: 2017-10-09 - 2017-10-15","year":2017,"toDate":"2017-10-15"},{"id":93,"index":42,"fromDate":"2017-10-16","name":"2017 Semana 42: 2017-10-16 - 2017-10-22","year":2017,"toDate":"2017-10-22"},{"id":94,"index":43,"fromDate":"2017-10-23","name":"2017 Semana 43: 2017-10-23 - 2017-10-29","year":2017,"toDate":"2017-10-29"},{"id":95,"index":44,"fromDate":"2017-10-30","name":"2017 Semana 44: 2017-10-30 - 2017-11-05","year":2017,"toDate":"2017-11-05"},{"id":96,"index":45,"fromDate":"2017-11-06","name":"2017 Semana 45: 2017-11-06 - 2017-11-12","year":2017,"toDate":"2017-11-12"},{"id":97,"index":46,"fromDate":"2017-11-13","name":"2017 Semana 46: 2017-11-13 - 2017-11-19","year":2017,"toDate":"2017-11-19"},{"id":98,"index":47,"fromDate":"2017-11-20","name":"2017 Semana 47: 2017-11-20 - 2017-11-26","year":2017,"toDate":"2017-11-26"},{"id":99,"index":48,"fromDate":"2017-11-27","name":"2017 Semana 48: 2017-11-27 - 2017-12-03","year":2017,"toDate":"2017-12-03"},{"id":100,"index":49,"fromDate":"2017-12-04","name":"2017 Semana 49: 2017-12-04 - 2017-12-10","year":2017,"toDate":"2017-12-10"},{"id":101,"index":50,"fromDate":"2017-12-11","name":"2017 Semana 50: 2017-12-11 - 2017-12-17","year":2017,"toDate":"2017-12-17"},{"id":102,"index":51,"fromDate":"2017-12-18","name":"2017 Semana 51: 2017-12-18 - 2017-12-24","year":2017,"toDate":"2017-12-24"},{"id":103,"index":52,"fromDate":"2017-12-25","name":"2017 Semana 52: 2017-12-25 - 2017-12-31","year":2017,"toDate":"2017-12-31"}]');
config.monthCalendar = JSON.parse('[{"fromDate":"2016-01-01","year":2016,"toDate":"2016-01-31","name":"2016 Enero","index":1,"id":0},{"fromDate":"2016-02-01","year":2016,"toDate":"2016-02-29","name":"2016 Febrero","index":2,"id":1},{"fromDate":"2016-03-01","year":2016,"toDate":"2016-03-31","name":"2016 Marzo","index":3,"id":2},{"fromDate":"2016-04-01","year":2016,"toDate":"2016-04-30","name":"2016 Abril","index":4,"id":3},{"fromDate":"2016-05-01","year":2016,"toDate":"2016-05-31","name":"2016 Mayo","index":5,"id":4},{"fromDate":"2016-06-01","year":2016,"toDate":"2016-06-30","name":"2016 Junio","index":6,"id":5},{"fromDate":"2016-07-01","year":2016,"toDate":"2016-07-31","name":"2016 Julio","index":7,"id":6},{"fromDate":"2016-08-01","year":2016,"toDate":"2016-08-31","name":"2016 Agosto","index":8,"id":7},{"fromDate":"2016-09-01","year":2016,"toDate":"2016-09-30","name":"2016 Septiembre","index":9,"id":8},{"fromDate":"2016-10-01","year":2016,"toDate":"2016-10-31","name":"2016 Octubre","index":10,"id":9},{"fromDate":"2016-11-01","year":2016,"toDate":"2016-11-30","name":"2016 Noviembre","index":11,"id":10},{"fromDate":"2016-12-01","year":2016,"toDate":"2016-12-31","name":"2016 Diciembre","index":12,"id":11},{"fromDate":"2017-01-01","year":2017,"toDate":"2017-01-31","name":"2017 Enero","index":1,"id":12},{"fromDate":"2017-02-01","year":2017,"toDate":"2017-02-28","name":"2017 Febrero","index":2,"id":13},{"fromDate":"2017-03-01","year":2017,"toDate":"2017-03-31","name":"2017 Marzo","index":3,"id":14},{"fromDate":"2017-04-01","year":2017,"toDate":"2017-04-30","name":"2017 Abril","index":4,"id":15},{"fromDate":"2017-05-01","year":2017,"toDate":"2017-05-31","name":"2017 Mayo","index":5,"id":16},{"fromDate":"2017-06-01","year":2017,"toDate":"2017-06-30","name":"2017 Junio","index":6,"id":17},{"fromDate":"2017-07-01","year":2017,"toDate":"2017-07-31","name":"2017 Julio","index":7,"id":18},{"fromDate":"2017-08-01","year":2017,"toDate":"2017-08-31","name":"2017 Agosto","index":8,"id":19},{"fromDate":"2017-09-01","year":2017,"toDate":"2017-09-30","name":"2017 Septiembre","index":9,"id":20},{"fromDate":"2017-10-01","year":2017,"toDate":"2017-10-31","name":"2017 Octubre","index":10,"id":21},{"fromDate":"2017-11-01","year":2017,"toDate":"2017-11-30","name":"2017 Noviembre","index":11,"id":22},{"fromDate":"2017-12-01","year":2017,"toDate":"2017-12-31","name":"2017 Diciembre","index":12,"id":23}]');
config.quarterCalendar = JSON.parse('[{"fromDate":"2016-01-01","year":2016,"toDate":"2016-03-31","name":"2016 Trimestre 1","index":1,"id":0},{"fromDate":"2016-04-01","year":2016,"toDate":"2016-06-30","name":"2016 Trimestre 2","index":2,"id":1},{"fromDate":"2016-07-01","year":2016,"toDate":"2016-09-30","name":"2016 Trimestre 3","index":3,"id":2},{"fromDate":"2016-10-01","year":2016,"toDate":"2016-12-31","name":"2016 Trimestre 4","index":4,"id":3},{"fromDate":"2017-01-01","year":2017,"toDate":"2017-03-31","name":"2017 Trimestre 1","index":1,"id":4},{"fromDate":"2017-04-01","year":2017,"toDate":"2017-06-30","name":"2017 Trimestre 2","index":2,"id":5},{"fromDate":"2017-07-01","year":2017,"toDate":"2017-09-30","name":"2017 Trimestre 3","index":3,"id":6},{"fromDate":"2017-10-01","year":2017,"toDate":"2017-12-31","name":"2017 Trimestre 4","index":4,"id":7}]');
config.annualCalendar = JSON.parse('[{"fromDate":"2016-01-01","year":2016,"toDate":"2016-12-31","name":"2016","index":1,"id":0},{"fromDate":"2017-01-01","year":2017,"toDate":"2017-12-31","name":"2017","index":1,"id":1}]');

/**
 * Angular configuration
 */
function angularConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/index/main");

    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html",
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "views/main.html",
            data: { pageTitle: 'Main view' }
        })
        .state('index.minor', {
            url: "/minor",
            templateUrl: "views/minor.html",
            data: { pageTitle: 'Example view' }
        })
        .state('maintenance', {
            url: "/maintenance",
            templateUrl: "views/maintenance.html",
            data: { pageTitle: 'Maintenance', specialClass: 'gray-bg' }
        })
        .state('login', {
            url: "/login",
            templateUrl: "views/login_two_columns.html",
            data: { pageTitle: 'Login', specialClass: 'gray-bg' }
        })
        .state('404', {
            url: "/404",
            templateUrl: "views/error404.html",
            data: { pageTitle: '404', specialClass: 'gray-bg' }
        })
        .state('500', {
            url: "/500",
            templateUrl: "views/error500.html",
            data: { pageTitle: '500', specialClass: 'gray-bg' }
        })

        .state('index.trafficmap', {
            url: "/trafficmap",
            templateUrl: "views/base/trafficmap.html",
            data: { pageTitle: 'Tráfico Vehicular'}
        })

        .state('index.influencemap', {
            url: "/influencemap",
            templateUrl: "views/base/influencemap.html",
            data: { pageTitle: 'Mapa de Influencia'}
        })

        .state('index.apdvisits', {
            url: "/apdvisits",
            templateUrl: "views/custom/apdvisits.html",
            data: { pageTitle: 'Visitas'}
        })

        .state('index.apreport', {
            url: "/apreport",
            templateUrl: "views/custom/apreport.html",
            data: { pageTitle: 'Reporte'}
        })

        .state('index.apdvisitsonly', {
            url: "/apdvisitsonly",
            templateUrl: "views/custom/apdvisitsonly.html",
            data: { pageTitle: 'Visitas'}
        })

        .state('index.shoppingvisits', {
            url: "/shoppingvisits",
            templateUrl: "views/custom/shoppingvisits.html",
            data: { pageTitle: 'Visitas'}
        })

        .state('index.storeplacer', {
            url: "/storeplacer",
            templateUrl: "views/custom/storeplacer.html",
            data: { pageTitle: 'Ubicacion'}
        })

        .state('index.devicemessage', {
            url: "/devicemessage",
            templateUrl: "views/custom/devicemessage.html",
            data: { pageTitle: 'Envio de Mensajes'}
        })

        .state('index.storeitems', {
            url: "/storeitems",
            templateUrl: "views/custom/storeitems.html",
            data: { pageTitle: 'Items Vendidos'}
        })

        .state('index.storetickets', {
            url: "/storetickets",
            templateUrl: "views/custom/storetickets.html",
            data: { pageTitle: 'Tickets'}
        })

        .state('index.storerevenue', {
            url: "/storerevenue",
            templateUrl: "views/custom/storerevenue.html",
            data: { pageTitle: 'Revenue'}
        })

        .state('index.test', {
            url: "/test",
            templateUrl: "views/custom/test.html",
            data: { pageTitle: 'Test de Componentes'}
        })

        .state('index.apddetails', {
            url: "/apddetails",
            templateUrl: "views/custom/apddetails.html",
            data: { pageTitle: 'Detalles'}
        })

        .state('index.patternheatmap', {
            url: "/patternheatmap",
            templateUrl: "views/custom/pattern_heatmap.html",
            data: { pageTitle: 'Heatmap de Patrones'}
        })

        .state('patternheatmap_frame', {
            url: "/patternheatmap_frame",
            templateUrl: "views/custom/pattern_heatmap_frame.html",
            data: { pageTitle: 'Heatmap', specialClass: 'white-bg' }
        })

        .state('index.heatmap', {
            url: "/heatmap",
            templateUrl: "views/custom/heatmap.html",
            data: { pageTitle: 'Heatmap'}
        })

        .state('heatmap_frame', {
            url: "/heatmap_frame",
            templateUrl: "views/custom/heatmap_frame.html",
            data: { pageTitle: 'Heatmap', specialClass: 'white-bg' }
        })

        .state('index.demomap', {
            url: "/demomap",
            templateUrl: "views/custom/demo_maps.html",
            data: { pageTitle: 'Mapas'}
        })

        .state('index.demovisits', {
            url: "/demovisits",
            templateUrl: "views/custom/demo_visits.html",
            data: { pageTitle: 'Visitas'}
        })

        .state('index.demodevlyn', {
            url: "/demodevlyn",
            templateUrl: "views/custom/demo_visits_devlyn.html",
            data: { pageTitle: 'Visitas'}
        })

        .state('index.demovisits3', {
            url: "/demovisits3",
            templateUrl: "views/custom/demo_visits_3.html",
            data: { pageTitle: 'Visitas'}
        })

        .state('index.demoareas', {
            url: "/demoareas",
            templateUrl: "views/custom/demo_areas.html",
            data: { pageTitle: 'Areas de Afluencia'}
        })

        .state('index.users', {
            url: "/users",
            templateUrl: "views/base/users.html",
            data: { pageTitle: 'Usuarios'}
        })

        .state('index.applications', {
            url: "/applications",
            templateUrl: "views/base/applications.html",
            data: { pageTitle: 'Aplicaciones'}
        })

        .state('index.shoppings', {
            url: "/shoppings",
            templateUrl: "views/base/shoppings.html",
            data: { pageTitle: 'Centros Comerciales'}
        })

        .state('index.shoppingsettings', {
            url: "/shoppingsettings/{identifier}",
            templateUrl: "views/base/shopping.settings.html",
            data: { pageTitle: 'Configuracion de Centros Comerciales'}
        })

        .state('index.dashboard', {
            url: "/dashboard",
            templateUrl: "views/base/dashboard.html",
            data: { pageTitle: 'Dashboard'}
        })

        .state('index.loginauditlog', {
            url: "/loginauditlog/{identifier}",
            templateUrl: "views/base/loginauditlog.html",
            data: { pageTitle: 'Log de Auditoria'}
        })

        .state('index.brands', {
            url: "/brands",
            templateUrl: "views/base/brands.html",
            data: { pageTitle: 'Cadenas'}
        })

        .state('index.apdevices', {
            url: "/apdevices",
            templateUrl: "views/base/apdevices.html",
            data: { pageTitle: 'Antenas'}
        })

        .state('index.apuptime', {
            url: "/apuptime/{hostname}",
            templateUrl: "views/base/apuptime.html",
            data: { pageTitle: 'Uptime de Antenas'}
        })

        .state('index.aplocation', {
            url: "/aplocation/{hostname}",
            templateUrl: "views/base/aplocation.html",
            data: { pageTitle: 'Ubicacion de Antenas'}
        })

        .state('index.apdevicesettings', {
            url: "/apdevicesettings/{hostname}",
            templateUrl: "views/base/apdevice.settings.html",
            data: { pageTitle: 'Configuracion de Antena'}
        })

        .state('index.aphentry', {
            url: "/aphentry/{identifier}",
            templateUrl: "views/base/aphentry.html",
            data: { pageTitle: 'Analisis de Visitas'}
        })

        .state('index.apdvanalysis', {
            url: "/apdvanalysis",
            templateUrl: "views/base/apdvanalysis.html",
            data: { pageTitle: 'Analisis de Visitas'}
        })

        .state('index.apdmaemployees', {
            url: "/apdmaemployees",
            templateUrl: "views/base/apdmaemployees.html",
            data: { pageTitle: 'Empleados'}
        })

        .state('index.apdmaemployeesettings', {
            url: "/apdmaemployeesettings/{identifier}",
            templateUrl: "views/base/apdmaemployee.settings.html",
            data: { pageTitle: 'Configuracion de Empleado'}
        })

        .state('index.opentimes', {
            url: "/opentimes",
            templateUrl: "views/base/opentimes.html",
            data: { pageTitle: 'Horarios de Apertura y Cierre'}
        })

        .state('index.employeetimes', {
            url: "/employeetimes",
            templateUrl: "views/base/employeetimes.html",
            data: { pageTitle: 'Horario de Empleados'}
        })

        .state('index.processes', {
            url: "/processes",
            templateUrl: "views/base/processes.html",
            data: { pageTitle: 'Reprocesos'}
        })

};

/**
 * Cookie run control
 */
function run($rootScope, $state, $cookieStore, $http, $location) {
    // keep user logged in after page refresh
    $rootScope.$state = $state;
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.token; // jshint ignore:line
    }
 
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        var loggedIn = $rootScope.globals.currentUser;
        if (restrictedPage && !loggedIn) {
          $location.path('/login');
        }
    });


    // Moment.js locale configuration
    moment.locale(moment.locale(), {invalidDate: ""});

};

// Enter key trap
angular
    .module('bdb')
    .directive('bdbEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.bdbEnter);
                });

                event.preventDefault();
            }
        });
    };
});

angular
    .module('bdb')
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('browserCacheInterceptor');
    }]);


angular
    .module('bdb')
    .config(angularConfig)
    .run(run);
