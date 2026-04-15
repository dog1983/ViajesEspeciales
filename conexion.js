// ============================================
// conexion.js - Cliente de Supabase
// ============================================

// 1. Importar la librería de Supabase desde una CDN (no necesitas instalarla)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// 2. Tus credenciales (cámbialas por las tuyas)
const supabaseUrl = 'https://mrxgdilnriuovkrvtzup.supabase.co'      // ← TU PROJECT URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yeGdkaWxucml1b3ZrcnZ0enVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDA1MzIsImV4cCI6MjA5MTc3NjUzMn0.pUU664KTiryYsOcpa89WgE-0p3rcRJsv66t9oZBGmKI'      // ← TU ANON KEY

// 3. Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 4. (Opcional) Mensaje en consola para verificar que cargó correctamente
console.log('✅ Conexión con Supabase establecida')
