const db = require("../config/db");

// Función utilitaria para formatear fechas (YYYY-MM-DD)
function formatDate(dateStr) {
    if (!dateStr) return null;
    if (typeof dateStr === 'string' && dateStr.length >= 10) {
        // Si ya está en formato YYYY-MM-DD, o viene como YYYY-MM-DDTHH:mm:ss, extrae solo la fecha
        return dateStr.slice(0, 10);
    }
    return null;
}
// Función utilitaria para formatear timestamps (YYYY-MM-DD HH:MM:SS)
function formatTimestamp(dateStr) {
    if (!dateStr) return null;
    // Si ya está en formato correcto, retorna igual
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateStr)) return dateStr;
    // Si viene como ISO (YYYY-MM-DDTHH:mm:ss), reemplaza la T por espacio y recorta los milisegundos
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dateStr)) {
        return dateStr.replace('T', ' ').substring(0, 19);
    }
    // Si viene en otro formato, retorna igual (o podrías lanzar un warning)
    return dateStr;
}

const registrarReubicacionNeumatico = async (req, res) => {
    try {
        const datosArray = Array.isArray(req.body) ? req.body : [req.body];
        const queryMantenimiento = `
            INSERT INTO SPEED400AT.NEU_MANTENIMIENTO (
                CODIGO, MARCA, MEDIDA, DISEÑO, REMANENTE, PR, CARGA, VELOCIDAD,
                FECHA_FABRICACION, RQ, OC, PROYECTO, COSTO, PROVEEDOR, FECHA_REGISTRO,
                FECHA_COMPRA, USUARIO_SUPER, TIPO_MOVIMIENTO, PRESION_AIRE, TORQUE_APLICADO,
                ESTADO, PLACA, POSICION_NEU, POSICION_INICIAL, POSICION_FIN, DESTINO,
                FECHA_ASIGNACION, KILOMETRO, FECHA_MOVIMIENTO, OBSERVACION
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const queryMovimiento = `
            INSERT INTO SPEED400AT.NEU_MOVIMIENTO (
                CODIGO, MARCA, MEDIDA, DISEÑO, REMANENTE, PR, CARGA, VELOCIDAD,
                FECHA_FABRICACION, RQ, OC, PROYECTO, COSTO, PROVEEDOR, FECHA_REGISTRO, FECHA_COMPRA,
                USUARIO_SUPER, TIPO_MOVIMIENTO, PRESION_AIRE, TORQUE_APLICADO, ESTADO, PLACA, POSICION_NEU,
                FECHA_ASIGNACION, KILOMETRO, FECHA_MOVIMIENTO, ID_ASIGNADO
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `;
        for (const datos of datosArray) {
            try {
                const valoresMantenimiento = [
                    datos.CODIGO,
                    datos.MARCA,
                    datos.MEDIDA,
                    datos.DISEÑO,
                    datos.REMANENTE,
                    datos.PR,
                    datos.CARGA,
                    datos.VELOCIDAD,
                    datos.FECHA_FABRICACION,
                    datos.RQ,
                    datos.OC,
                    datos.PROYECTO,
                    datos.COSTO,
                    datos.PROVEEDOR,
                    formatDate(datos.FECHA_REGISTRO),
                    formatDate(datos.FECHA_COMPRA),
                    datos.USUARIO_SUPER,
                    "REUBICADO",
                    datos.PRESION_AIRE,
                    datos.TORQUE_APLICADO,
                    datos.ESTADO,
                    datos.PLACA,
                    // Usar POSICION_FIN como POSICION_NEU para reflejar la posición final real
                    datos.POSICION_FIN, // POSICION_NEU
                    // Usar POSICION_INICIAL si existe, si no, dejar null
                    datos.POSICION_INICIAL || null, // POSICION_INICIAL
                    datos.POSICION_FIN, // POSICION_FIN
                    datos.DESTINO,
                    formatDate(datos.FECHA_ASIGNACION),
                    datos.KILOMETRO,
                    formatTimestamp(datos.FECHA_MOVIMIENTO),
                    datos.OBSERVACION
                ];
                //console.log('queryMantenimiento:', queryMantenimiento);
                //console.log('valoresMantenimiento (length=' + valoresMantenimiento.length + '):', valoresMantenimiento);
                // Mostrar cada valor con su índice para depuración
                // valoresMantenimiento.forEach((v, i) => {
                //     console.log(`  [${i}] (${typeof v}):`, v);
                // });
                await db.query(queryMantenimiento, valoresMantenimiento);

                // Formatear FECHA_ASIGNACION para que sea solo fecha (YYYY-MM-DD)
                const fechaAsignacion = formatDate(datos.FECHA_ASIGNACION);

                // Validar duplicidad antes de insertar en NEU_MOVIMIENTO
                // (Desactivado: ahora permite insertar aunque exista la misma combinación CODIGO y FECHA_ASIGNACION)
                // const checkQuery = `SELECT 1 FROM SPEED400AT.NEU_MOVIMIENTO WHERE CODIGO = ? AND FECHA_ASIGNACION = ?`;
                // const checkResult = await db.query(checkQuery, [datos.CODIGO, fechaAsignacion]);
                // if (checkResult.length > 0) {
                //     console.error('Registro duplicado detectado en NEU_MOVIMIENTO para CODIGO y FECHA_ASIGNACION:', datos.CODIGO, fechaAsignacion);
                //     throw new Error('Ya existe un movimiento para este neumático y fecha de asignación.');
                // }
                const valoresMovimiento = [
                    datos.CODIGO || null,
                    datos.MARCA || null,
                    datos.MEDIDA || null,
                    datos.DISEÑO || null,
                    datos.REMANENTE || null,
                    datos.PR || null,
                    datos.CARGA || null,
                    datos.VELOCIDAD || null,
                    datos.FECHA_FABRICACION || null,
                    datos.RQ || null,
                    datos.OC || null,
                    datos.PROYECTO || null,
                    datos.COSTO || null,
                    datos.PROVEEDOR || null,
                    formatDate(datos.FECHA_REGISTRO),
                    formatDate(datos.FECHA_COMPRA),
                    datos.USUARIO_SUPER || null,
                    "REUBICADO",
                    datos.PRESION_AIRE || null,
                    datos.TORQUE_APLICADO || null,
                    datos.ESTADO || null,
                    datos.PLACA || null,
                    datos.POSICION_FIN || null, 
                    fechaAsignacion,
                    datos.KILOMETRO || null,
                    formatTimestamp(datos.FECHA_MOVIMIENTO) || null,
                    null 
                ];
                //console.log('valoresMovimiento:', valoresMovimiento);
                await db.query(queryMovimiento, valoresMovimiento);

                // ACTUALIZAR LA TABLA NEU_ASIGNADO para reflejar la nueva posición
                const queryUpdateAsignado = `
                    UPDATE SPEED400AT.NEU_ASIGNADO 
                    SET POSICION_NEU = ?, 
                        FECHA_MOVIMIENTO = ?
                    WHERE CODIGO = ? AND PLACA = ?
                `;
                const valoresUpdateAsignado = [
                    datos.POSICION_FIN, // Nueva posición
                    formatTimestamp(datos.FECHA_MOVIMIENTO), // Fecha del movimiento
                    datos.CODIGO, // Código del neumático
                    datos.PLACA // Placa del vehículo
                ];
                
                console.log('Actualizando NEU_ASIGNADO:', valoresUpdateAsignado);
                await db.query(queryUpdateAsignado, valoresUpdateAsignado);

            } catch (e) {
                // Mostrar el error exacto de la base de datos en consola para depuración
                console.error('Error SQL en registro individual:', e);
                throw e;
            }
        }
        res.status(201).json({ mensaje: `Reubicación de ${datosArray.length} neumático(s) registrada correctamente` });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la reubicación de neumático(s)", detalle: error.message });
    }
};

const registrarDesasignacionNeumatico = async (req, res) => {
    try {
        const datosArray = Array.isArray(req.body) ? req.body : [req.body];
        for (const datos of datosArray) {
            // Determinar la tabla según el tipo de movimiento
            let tabla = null;
            if (datos.TIPO_MOVIMIENTO === 'BAJA DEFINITIVA') {
                tabla = 'SPEED400AT.NEU_ELIMINADO';
            } else if (datos.TIPO_MOVIMIENTO === 'RECUPERADO') {
                tabla = 'SPEED400AT.NEU_RECUPERADO';
            } else {
                console.error('TIPO_MOVIMIENTO inválido:', datos.TIPO_MOVIMIENTO);
                return res.status(400).json({ error: 'TIPO_MOVIMIENTO inválido. Debe ser BAJA DEFINITIVA o RECUPERADO.' });
            }
            // Log de los valores a insertar
            // console.log('Insertando en', tabla);
            // console.log('Valores recibidos:', datos);
            const query = `
                INSERT INTO ${tabla} (
                    CODIGO, MARCA, MEDIDA, DISEÑO, REMANENTE, PR, CARGA, VELOCIDAD,
                    FECHA_FABRICACION, RQ, OC, PROYECTO, COSTO, PROVEEDOR, FECHA_REGISTRO, FECHA_COMPRA,
                    USUARIO_SUPER, TIPO_MOVIMIENTO, PRESION_AIRE, TORQUE_APLICADO, ESTADO, PLACA, POSICION_NEU,
                    DESTINO, FECHA_ASIGNACION, KILOMETRO, FECHA_MOVIMIENTO, OBSERVACION
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const valores = [
                datos.CODIGO,
                datos.MARCA,
                datos.MEDIDA,
                datos.DISEÑO,
                datos.REMANENTE,
                datos.PR,
                datos.CARGA,
                datos.VELOCIDAD,
                datos.FECHA_FABRICACION,
                datos.RQ,
                datos.OC,
                datos.PROYECTO,
                datos.COSTO,
                datos.PROVEEDOR,
                formatDate(datos.FECHA_REGISTRO),
                formatDate(datos.FECHA_COMPRA),
                datos.USUARIO_SUPER,
                datos.TIPO_MOVIMIENTO,
                datos.PRESION_AIRE,
                datos.TORQUE_APLICADO,
                datos.ESTADO,
                datos.PLACA,
                datos.POSICION_NEU,
                datos.DESTINO,
                formatDate(datos.FECHA_ASIGNACION),
                datos.KILOMETRO,
                formatTimestamp(datos.FECHA_MOVIMIENTO),
                datos.OBSERVACION
            ];
            // Log de los valores finales a insertar
            // valores.forEach((v, i) => {
            //     console.log(`  [${i}] (${typeof v}):`, v);  
            // });
            try {
                await db.query(query, valores);
                // --- NUEVO: Insertar también en NEU_MOVIMIENTO ---
                const queryMovimiento = `
                    INSERT INTO SPEED400AT.NEU_MOVIMIENTO (
                        CODIGO, MARCA, MEDIDA, DISEÑO, REMANENTE, PR, CARGA, VELOCIDAD,
                        FECHA_FABRICACION, RQ, OC, PROYECTO, COSTO, PROVEEDOR, FECHA_REGISTRO, FECHA_COMPRA,
                        USUARIO_SUPER, TIPO_MOVIMIENTO, PRESION_AIRE, TORQUE_APLICADO, ESTADO, PLACA, POSICION_NEU,
                        FECHA_ASIGNACION, KILOMETRO, FECHA_MOVIMIENTO, ID_ASIGNADO
                    ) VALUES (
                        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                    )
                `;
                const valoresMovimiento = [
                    datos.CODIGO || null,
                    datos.MARCA || null,
                    datos.MEDIDA || null,
                    datos.DISEÑO || null,
                    datos.REMANENTE || null,
                    datos.PR || null,
                    datos.CARGA || null,
                    datos.VELOCIDAD || null,
                    datos.FECHA_FABRICACION || null,
                    datos.RQ || null,
                    datos.OC || null,
                    datos.PROYECTO || null,
                    datos.COSTO || null,
                    datos.PROVEEDOR || null,
                    formatDate(datos.FECHA_REGISTRO),
                    formatDate(datos.FECHA_COMPRA),
                    datos.USUARIO_SUPER || null,
                    datos.TIPO_MOVIMIENTO,
                    datos.PRESION_AIRE || null,
                    datos.TORQUE_APLICADO || null,
                    datos.ESTADO || null,
                    datos.PLACA || null,
                    datos.POSICION_NEU || null,
                    formatDate(datos.FECHA_ASIGNACION),
                    datos.KILOMETRO || null,
                    formatTimestamp(datos.FECHA_MOVIMIENTO) || null,
                    datos.ID_ASIGNADO || null
                ];
                await db.query(queryMovimiento, valoresMovimiento);

                // ELIMINAR DE LA TABLA NEU_ASIGNADO cuando se desasigna
                const queryDeleteAsignado = `
                    DELETE FROM SPEED400AT.NEU_ASIGNADO 
                    WHERE CODIGO = ? AND PLACA = ?
                `;
                const valoresDeleteAsignado = [
                    datos.CODIGO, // Código del neumático
                    datos.PLACA // Placa del vehículo
                ];
                
                console.log('Eliminando de NEU_ASIGNADO:', valoresDeleteAsignado);
                await db.query(queryDeleteAsignado, valoresDeleteAsignado);

                // --- FIN NUEVO ---
            } catch (e) {
                console.error('Error SQL al insertar en', tabla, ':', e);
                throw e;
            }
        }
        res.status(201).json({ mensaje: `Desasignación de ${datosArray.length} neumático(s) registrada correctamente` });
    } catch (error) {
        console.error('Error general en registrarDesasignacionNeumatico:', error);
        res.status(500).json({ error: 'Error al registrar la desasignación de neumático(s)', detalle: error.message });
    }
};

// Obtener la última fecha de inspección para un neumático y placa
const getUltimaFechaInspeccion = async (req, res) => {
    try {
        const { codigo, placa } = req.query;
        if (!codigo || !placa) {
            return res.status(400).json({ error: "Faltan parámetros: codigo y placa son requeridos" });
        }
        const query = `
            SELECT FECHA_REGISTRO
            FROM SPEED400AT.NEU_INSPECCION
            WHERE CODIGO = ? AND PLACA = ?
            ORDER BY FECHA_REGISTRO DESC
            FETCH FIRST 1 ROW ONLY
        `;
        const result = await db.query(query, [codigo, placa]);
        res.json({ ultima: result[0]?.FECHA_REGISTRO || null });
    } catch (error) {
        res.status(500).json({ error: "Error al consultar la última fecha de inspección", detalle: error.message });
    }
};

// Obtener la última fecha de inspección solo por placa
const getUltimaFechaInspeccionPorPlaca = async (req, res) => {
    try {
        const { placa } = req.query;
        if (!placa) {
            return res.status(400).json({ error: "Falta el parámetro: placa es requerido" });
        }
        const query = `
            SELECT FECHA_REGISTRO
            FROM SPEED400AT.NEU_INSPECCION
            WHERE PLACA = ?
            ORDER BY FECHA_REGISTRO DESC
            FETCH FIRST 1 ROW ONLY
        `;
        const result = await db.query(query, [placa]);
        res.json({ ultima: result[0]?.FECHA_REGISTRO || null });
    } catch (error) {
        res.status(500).json({ error: "Error al consultar la última fecha de inspección por placa", detalle: error.message });
    }
};

module.exports = { registrarReubicacionNeumatico, registrarDesasignacionNeumatico, getUltimaFechaInspeccion, getUltimaFechaInspeccionPorPlaca };
