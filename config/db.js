const odbc = require('odbc');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || '192.168.5.5',
    database: 'S210092w', // Base de datos real según DBeaver
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

const db = {
    connection: null,

    connect: async () => {
        try {
            //const dsn = process.env.DB_DSN || 'AS400_SYSTEM';
            const connStr = `DRIVER={IBM i Access ODBC Driver};SYSTEM=192.168.5.5;UID=SYPSA;PWD=cotito$`;
        
        console.log(`🔄 Conectando directamente a 192.168.5.5`);
        db.connection = await odbc.connect(connStr);
        console.log('✅ Conectado correctamente');
        } catch (err) {
            console.error('❌ Error de conexión IBM i Access:', err);
            console.log('⚠️ Continuando sin conexión a la base de datos...');
        }
    },

    query: async (sql, params = []) => {
        if (!db.connection) await db.connect();
        if (!db.connection) return null;
        return db.connection.query(sql, params);
    },

    close: async () => {
        if (db.connection) {
            await db.connection.close();
            db.connection = null;
            console.log('🔌 Conexión cerrada.');
        }
    }
};

module.exports = db;
