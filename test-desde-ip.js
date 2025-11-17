const fetch = require('node-fetch');

async function probarDesdeIP() {
    try {
        console.log('🧪 PROBANDO API DESDE IP 192.168.100.182');
        console.log('='.repeat(50));
        
        const url = 'http://192.168.100.182:3006/api/po-asignados/TDQ-854';
        console.log(`📡 Consultando: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            console.error(`❌ Error HTTP: ${response.status} ${response.statusText}`);
            return;
        }
        
        const data = await response.json();
        console.log(`✅ Respuesta recibida: ${data.length} registros`);
        
        // Buscar específicamente POS02
        const pos02 = data.find(n => n.POSICION_NEU === 'POS02');
        
        if (pos02) {
            console.log('\n🎯 NEUMÁTICO EN POS02:');
            console.log(`   Código: ${pos02.CODIGO}`);
            console.log(`   Posición: ${pos02.POSICION_NEU}`);
            console.log(`   Tipo: ${pos02.TIPO_MOVIMIENTO}`);
            console.log('   ✅ LA API SÍ DEVUELVE EL NEUMÁTICO EN POS02');
        } else {
            console.log('\n❌ NO SE ENCONTRÓ NEUMÁTICO EN POS02');
        }
        
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('❌ Error al conectar:', error.message);
        console.log('💡 Asegúrate de que el backend esté corriendo en puerto 3006');
    }
}

probarDesdeIP();