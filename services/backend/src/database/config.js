module.exports = {
    development: {
        dialect: 'postgres',
        database: process.env['POSTGRES_DATABASE'],
        host: process.env['POSTGRES_HOST'],
        port: process.env['POSTGRES_PORT'],
        username: process.env['POSTGRES_USER'],
        password: process.env['POSTGRES_PASSWORD'],
    },
    production: {
        dialect: 'postgres',
        database: process.env['POSTGRES_DATABASE'],
        host: process.env['POSTGRES_HOST'],
        port: process.env['POSTGRES_PORT'],
        username: process.env['POSTGRES_USER'],
        password: process.env['POSTGRES_PASSWORD'],
    },
}