const fetch = require('node-fetch');

async function probarComponenteDiagrama() {
    try {
        console.log('🧪 PROBANDO LÓGICA CORREGIDA DEL COMPONENTE');
        console.log('='.repeat(60));
        
        // 1. Obtener datos como lo hace el frontend
        const response = await fetch('http://localhost:3006/api/po-asignados/TDQ-854');
        const neumaticosAsignados = await response.json();
        
        console.log(`📊 Datos recibidos de la API: ${neumaticosAsignados.length} registros`);
        
        // 2. Aplicar la lógica de filtrado CORREGIDA (como en el componente)
        const porPosicion = new Map();
        for (const n of neumaticosAsignados) {
            // FILTRO CORREGIDO: Excluir solo BAJA DEFINITIVA (RECUPERADO debe mostrarse)
            if (n.TIPO_MOVIMIENTO === 'BAJA DEFINITIVA') continue;
            
            // MAPEO CORREGIDO: usar POSICION_NEU
            const pos = n.POSICION_NEU || n.POSICION;
            if (!pos) continue;
            
            if (!porPosicion.has(pos) || ((n.ID_MOVIMIENTO || 0) > (porPosicion.get(pos)?.ID_MOVIMIENTO || 0))) {
                porPosicion.set(pos, n);
            }
        }
        
        // 3. Filtrar por código (último movimiento por código)
        const porCodigo = new Map();
        for (const n of porPosicion.values()) {
            const codigo = n.CODIGO_NEU || n.CODIGO;
            if (!codigo) continue;
            if (!porCodigo.has(codigo) || ((n.ID_MOVIMIENTO || 0) > (porCodigo.get(codigo)?.ID_MOVIMIENTO || 0))) {
                porCodigo.set(codigo, n);
            }
        }
        
        const neumaticosFiltrados = Array.from(porCodigo.values());
        
        console.log(`✅ Neumáticos después del filtrado: ${neumaticosFiltrados.length} registros`);
        console.log('');
        
        // 4. Mostrar resultado por posición
        ['POS01', 'POS02', 'POS03', 'POS04', 'RES01'].forEach(posicion => {
            const neumatico = neumaticosFiltrados.find(n => (n.POSICION_NEU || n.POSICION) === posicion);
            if (neumatico) {
                console.log(`${posicion}: ${neumatico.CODIGO} (${neumatico.TIPO_MOVIMIENTO})`);
            } else {
                console.log(`${posicion}: VACÍA`);
            }
        });
        
        // 5. Verificar específicamente POS02
        const enPOS02 = neumaticosFiltrados.find(n => (n.POSICION_NEU || n.POSICION) === 'POS02');
        console.log('');
        if (enPOS02) {
            console.log('🎯 ¡ÉXITO! POS02 aparece en el resultado filtrado:');
            console.log(`   Código: ${enPOS02.CODIGO}`);
            console.log(`   Tipo: ${enPOS02.TIPO_MOVIMIENTO}`);
            console.log(`   Posición: ${enPOS02.POSICION_NEU}`);
            console.log('   ✅ El neumático DEBERÍA aparecer en el frontend');
        } else {
            console.log('❌ POS02 NO aparece en el resultado - aún hay un problema');
        }
        
        console.log('='.repeat(60));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

probarComponenteDiagrama();