const fetch = require('node-fetch');

async function simularLogicaFrontend() {
    try {
        console.log('🔬 SIMULANDO LÓGICA EXACTA DEL FRONTEND');
        console.log('='.repeat(60));
        
        // 1. Obtener datos como el frontend
        const response = await fetch('http://192.168.100.182:3006/api/po-asignados/TDQ-854');
        const neumaticosAsignados = await response.json();
        
        console.log(`📊 Datos originales: ${neumaticosAsignados.length} registros`);
        
        // 2. Aplicar EXACTAMENTE la misma lógica del componente DiagramaVehiculo
        console.log('\n🔍 Aplicando filtros del componente...');
        
        // Paso 1: Filtrar por posición
        const porPosicion = new Map();
        for (const n of neumaticosAsignados) {
            // FILTRO CORREGIDO: Excluir solo BAJA DEFINITIVA
            if (n.TIPO_MOVIMIENTO === 'BAJA DEFINITIVA') {
                console.log(`   ❌ Excluido por BAJA DEFINITIVA: ${n.CODIGO} (${n.POSICION_NEU})`);
                continue;
            }
            
            // MAPEO CORREGIDO: usar POSICION_NEU || POSICION
            const pos = n.POSICION_NEU || n.POSICION;
            if (!pos) {
                console.log(`   ⚠️  Sin posición: ${n.CODIGO}`);
                continue;
            }
            
            console.log(`   ✅ Procesando: ${n.CODIGO} en ${pos} (${n.TIPO_MOVIMIENTO})`);
            
            if (!porPosicion.has(pos) || ((n.ID_MOVIMIENTO || 0) > (porPosicion.get(pos)?.ID_MOVIMIENTO || 0))) {
                porPosicion.set(pos, n);
                console.log(`      → Asignado a posición ${pos}`);
            } else {
                console.log(`      → Ignorado (ID_MOVIMIENTO menor)`);
            }
        }
        
        console.log(`\n📍 Después de filtrar por posición: ${porPosicion.size} posiciones`);
        
        // Paso 2: Filtrar por código
        const porCodigo = new Map();
        for (const n of porPosicion.values()) {
            const codigo = n.CODIGO_NEU || n.CODIGO;
            if (!codigo) continue;
            if (!porCodigo.has(codigo) || ((n.ID_MOVIMIENTO || 0) > (porCodigo.get(codigo)?.ID_MOVIMIENTO || 0))) {
                porCodigo.set(codigo, n);
            }
        }
        
        const neumaticosFiltrados = Array.from(porCodigo.values());
        
        console.log(`\n🎯 RESULTADO FINAL: ${neumaticosFiltrados.length} neumáticos`);
        console.log('\nPOR POSICIÓN:');
        
        // Mostrar resultado por posición
        ['POS01', 'POS02', 'POS03', 'POS04', 'RES01'].forEach(posicion => {
            const neumatico = neumaticosFiltrados.find(n => (n.POSICION_NEU || n.POSICION) === posicion);
            if (neumatico) {
                console.log(`   ${posicion}: ${neumatico.CODIGO} (${neumatico.TIPO_MOVIMIENTO})`);
                if (posicion === 'POS02') {
                    console.log('      🎉 ¡POS02 ENCONTRADO EN EL RESULTADO!');
                }
            } else {
                console.log(`   ${posicion}: VACÍA`);
                if (posicion === 'POS02') {
                    console.log('      ❌ POS02 NO APARECE - HAY UN PROBLEMA');
                }
            }
        });
        
        console.log('\n' + '='.repeat(60));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

simularLogicaFrontend();