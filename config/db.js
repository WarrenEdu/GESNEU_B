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
            // Usar DSN de IBM i Access
            const connStr = `DSN=AS400_SYSTEM`;
            
            console.log(`🔄 Intentando conectar a AS400/iSeries usando DSN: AS400_SYSTEM`);
            
            db.connection = await odbc.connect(connStr);
            console.log('✅ Conectado a AS400/iSeries vía IBM i Access ODBC correctamente');
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
