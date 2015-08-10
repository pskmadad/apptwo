/**
 * Created by svaithiyanathan on 8/4/15.
 */

module.exports = {
    development: {
        port: 3001,
        db: {
            host: 'localhost',
            connectionLimit: 10,
            user: 'groceryapp',
            password: 'Gr0c@ry',
            database: 'grocery',
            debug: false
        },
        log: {
            console: true
        },
        decrypted: '|SuperGroceryApp|', //}RtqdsFsnbdsx@qq}
        salt: '1'
    },
    production: {

    }
};