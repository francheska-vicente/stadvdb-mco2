const { DateTime } = require("luxon");

const query_funcs = {
    to_select_query: function (movies) {
        var query = `SELECT `;

        for (var i = 0; i < select.length; i++) {
            if (i != 0 && select[i].split(" ").join("") != `rank`) {
                query = query + `, ` + select[i];
            } else if (i != 0) {
                query = query + `, \`` + select[i] + `\``;
            } else {
                query = query + select[i];
            }
        }

        if (select.length == 0) {
            query = query + '*';
        }

        query = query + ` FROM movies `;

        for (var i = 0; i < where.length; i++) {
            if (i != 0) {
                query = query + `, ` + where[i];
            } else {
                query = query + ` WHERE ` + where[i];
            }
        }

        return query + `;`;
    },

    to_insert_query: function (name, year, rank) {
        return `INSERT INTO movies (name, \`rank\`,  year) VALUES ('` + name + `', ` + rank + `, ` + year + `);`
    },

    to_update_query: function (id, name, rank, year) {
        var query = `UPDATE movies SET`;

        if (name != '') {
            query = query + ` name = '` + name + `'`;

            if (rank != '') {
                query = query + `, \`rank\` = ` + rank;

                if (year != '') {
                    query = query + `, year = ` + year;
                }
            } else if (year != '') {
                query = query + `, year = ` + year;
            }
        } else {
            query = query + ` \`rank\` = ` + rank;
            query = query + `year = ` + year;
        }

        return query + ` WHERE id = ` + id + `;`;
    },

    to_delete_query: function (id) {
        return `DELETE FROM movies WHERE id = ` + id + `;`;
    },

    to_insert_query_log: function (name, year, rank, node_to, node_from) {
        return `INSERT INTO log_table(type, node_to, done, name, year, \`rank\`) VALUES ('INSERT', ` 
            + node_to + `, '` + node_from + `, false, '` + name + `', ` + year + `, ` + rank + `);`
    },

    to_update_query_log: function (id, name, year, rank, node_to, node_from) {
        return `INSERT INTO log_table(type, node_to, node_from, done, id, name, year, \`rank\`) VALUES ('UPDATE', ` 
            + node_to + `, ` + node_from + `, false, ` + id + `, '` + name + `', ` + year + `, ` + rank + `);`
    },

    to_delete_query_log: function (id, node_to, node_from) {
        return `INSERT INTO log_table(type, node_to, node_from, done, id) VALUES ('DELETE', `
            + node_to + `, '` + node_from + `, false, ` + id`);`
    },

    to_finish_log: function (id) {
        return `UPDATE log_table SET done=1 WHERE statement_id=` + id + `;`
    },
    
    to_retrieve_logs: function (node) {
        const now = DateTime.now().toObject()
        var year = "" + now.year;

        var month = "" + now.month;
        if (month < 10) month = "0" + month;
        
        var day = "" + now.day;
        if (day < 10) day = "0" + day;
        
        var hour = "" + now.hour;
        if (hour < 10) hour = "0" + hour;
        
        var minute = "" + now.minute;
        if (minute < 10) minute = "0" + minute;

        var second = "" + now.second;
        if (second < 10) second = "0" + second;
        
        return `SELECT * FROM log_table
                WHERE done=false AND node_to=`+ node + ` AND date < '` + year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second + `' 
                ORDER BY date ASC;`
    }
}
module.exports = query_funcs;