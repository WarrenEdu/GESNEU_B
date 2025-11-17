const fetch = require('node-fetch');

async function probarAPI() {
    try {
        console.log('🧪 PROBANDO API DIRECTAMENTE');
        console.log('='.repeat(50));
        
        const url = 'http://localhost:3006/api/po-asignados/TDQ-854';
        console.log(`📡 Consultando: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error(`❌ Error HTTP: ${response.status} ${response.statusText}`);
            return;
        }
        
        const data = await response.json();
        console.log(`✅ Respuesta recibida (${data.length} registros):`);
        console.log('');
        
        data.forEach((neumatico, index) => {
            console.log(`${index + 1}. Posición: ${neumatico.POSICION_NEU} | Código: ${neumatico.CODIGO}`);
            console.log(`   Tipo: ${neumatico.TIPO_MOVIMIENTO} | Fecha: ${neumatico.FECHA_MOVIMIENTO}`);
            console.log('');
        });
        
        // Verificar específicamente POS02
        const enPOS02 = data.find(n => n.POSICION_NEU === 'POS02');
        if (enPOS02) {
            console.log('🎯 NEUMÁTICO EN POS02 ENCONTRADO:');
            console.log(`   Código: ${enPOS02.CODIGO}`);
            console.log(`   Tipo: ${enPOS02.TIPO_MOVIMIENTO}`);
            console.log('   ✅ La API SÍ devuelve el neumático en POS02');
        } else {
            console.log('❌ NO SE ENCONTRÓ NEUMÁTICO EN POS02 EN LA RESPUESTA DE LA API');
        }
        
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('❌ Error al probar la API:', error.message);
    }
}

probarAPI();