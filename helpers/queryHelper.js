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

    to_insert_query: function (movies) {
        var name = movies.name;
        var rank = (movies.rank) ? movies.rank : `NULL`;
        var year = movies.year;

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

    to_create_log_query: function (id, name, year, rank, node, type) {
        return `SET @@session.time_zone = "+08:00"; INSERT INTO log_table(\`type\`, node_to, done, id, \`name\`, \`year\`, \`rank\`) VALUES ('` +
        type + `', ` + node `, false, ` + id + `, '` + name + `', ` + year + `, ` + rank + `);`
    }
}
module.exports = query_funcs;