// ============================================
// conexion.js - Cliente de Supabase
// ============================================

// 1. Importar la librería
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// 2. Tus credenciales
const supabaseUrl = 'https://mrxgdilnriuovkrvtzup.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yeGdkaWxucml1b3ZrcnZ0enVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDA1MzIsImV4cCI6MjA5MTc3NjUzMn0.pUU664KTiryYsOcpa89WgE-0p3rcRJsv66t9oZBGmKI'

// 3. Limpiar toda la caché antes de crear el cliente
try {
    // Limpiar localStorage
    for (let key in localStorage) {
        if (key.includes('supabase') || key.includes('sb-')) {
            localStorage.removeItem(key);
        }
    }
    
    // Limpiar sessionStorage
    for (let key in sessionStorage) {
        if (key.includes('supabase') || key.includes('sb-')) {
            sessionStorage.removeItem(key);
        }
    }
    
    // Limpiar IndexedDB
    const databases = await indexedDB.databases();
    for (const db of databases) {
        if (db.name && (db.name.includes('supabase') || db.name.includes('firebase'))) {
            indexedDB.deleteDatabase(db.name);
            console.log('Eliminada base de datos:', db.name);
        }
    }
} catch(e) {
    console.log('Error limpiando caché:', e);
}

// 4. Crear el cliente con configuración especial
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    schema: 'public',
    autoRefreshToken: true,
    persistSession: true,
    db: {
        schema: 'public'
    },
    global: {
        headers: {
            'X-Client-Info': 'supabase-js-web'
        }
    }
});

// 5. Forzar la recarga del esquema
supabase.from('carpetas').select('id').limit(1).then(() => {
    console.log('✅ Tabla carpetas accesible');
}).catch(e => {
    console.warn('Error inicial:', e.message);
});

console.log('✅ Conexión con Supabase establecida');
