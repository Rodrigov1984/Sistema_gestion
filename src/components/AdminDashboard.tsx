import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Edit, 
  Trash2, 
  Users, 
  Package, 
  CheckCircle, 
  Clock,
  FileText,
  Plus
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminDashboardProps {
  onBack: () => void;
}

interface Empleado {
  id: number;
  nombre: string;
  rut: string;
  correo: string;
  tipoContrato: 'Planta' | 'Plazo Fijo';
  rol: 'Guardia' | 'Personal de Base' | 'Oficina' | 'Supervisión' | 'Administración';
  localidad: string;
  beneficio: string;
  estado: 'Pendiente' | 'Retirado';
  fechaRetiro?: string;
}

interface Guardia {
  id: number;
  nombre: string;
  rut: string;
  usuario: string;
  password: string;
  activo: boolean;
  fechaCreacion: string;
}

// Mock data
const empleadosIniciales: Empleado[] = [
  {
    id: 1,
    nombre: 'María Fernanda González',
    rut: '16.234.567-8',
    correo: 'maria.gonzalez@empresa.cl',
    tipoContrato: 'Planta',
    rol: 'Personal de Base',
    localidad: 'Valparaíso',
    beneficio: 'Caja Navidad 2024',
    estado: 'Pendiente',
  },
  {
    id: 2,
    nombre: 'Carlos Alberto Muñoz',
    rut: '18.345.678-9',
    correo: 'carlos.munoz@empresa.cl',
    tipoContrato: 'Plazo Fijo',
    rol: 'Guardia',
    localidad: 'Casablanca',
    beneficio: 'Caja Navidad 2024',
    estado: 'Retirado',
    fechaRetiro: '15/12/2024',
  },
  {
    id: 3,
    nombre: 'Ana María Silva',
    rut: '17.456.789-0',
    correo: 'ana.silva@empresa.cl',
    tipoContrato: 'Planta',
    rol: 'Oficina',
    localidad: 'Valparaíso',
    beneficio: 'Caja Navidad 2024',
    estado: 'Pendiente',
  },
  {
    id: 4,
    nombre: 'Roberto Díaz',
    rut: '15.567.890-1',
    correo: 'roberto.diaz@empresa.cl',
    tipoContrato: 'Plazo Fijo',
    rol: 'Guardia',
    localidad: 'Valparaíso',
    beneficio: 'Caja Navidad 2024',
    estado: 'Retirado',
    fechaRetiro: '14/12/2024',
  },
  {
    id: 5,
    nombre: 'Patricia Rojas',
    rut: '19.678.901-2',
    correo: 'patricia.rojas@empresa.cl',
    tipoContrato: 'Planta',
    rol: 'Supervisión',
    localidad: 'Casablanca',
    beneficio: 'Caja Navidad 2024',
    estado: 'Pendiente',
  },
];

// Mock data inicial de guardias
const guardiasIniciales: Guardia[] = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    rut: '15123456-7',
    usuario: '15123456-7',
    password: '15123456',
    activo: true,
    fechaCreacion: '10/12/2024',
  },
  {
    id: 2,
    nombre: 'Pedro González',
    rut: '16234567-8',
    usuario: '16234567-8',
    password: '16234567',
    activo: true,
    fechaCreacion: '11/12/2024',
  },
];

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [empleados, setEmpleados] = useState<Empleado[]>(empleadosIniciales);
  const [filtroLocalidad, setFiltroLocalidad] = useState<string>('all');
  const [filtroContrato, setFiltroContrato] = useState<string>('all');
  const [filtroEstado, setFiltroEstado] = useState<string>('all');
  const [filtroRol, setFiltroRol] = useState<string>('all');
  const [vistaActual, setVistaActual] = useState<'dashboard' | 'empleados' | 'reportes'>('dashboard');
  const [guardias, setGuardias] = useState<Guardia[]>(guardiasIniciales);
  const [mostrarFormGuardia, setMostrarFormGuardia] = useState(false);
  const [nuevoGuardia, setNuevoGuardia] = useState({
    nombre: '',
    rut: '',
  });

  // Estado para edición de contraseña
  const [editPassId, setEditPassId] = useState<number | null>(null);
  const [editPassValue, setEditPassValue] = useState('');
  // Resumen última carga de nómina
  const [ultimaCarga, setUltimaCarga] = useState<{ total: number; preview: Empleado[] } | null>(null);

  // Al montar: cargar empleados desde localStorage o inicializar
  useEffect(() => {
    const stored = localStorage.getItem('empleados');
    if (stored) {
      try {
        const parsed: Empleado[] = JSON.parse(stored);
        // Migración: agregar campo correo si no existe
        const empleadosMigrados = parsed.map(emp => ({
          ...emp,
          correo: emp.correo || '' // Asegurar que todos tengan el campo correo
        }));
        setEmpleados(empleadosMigrados);
        // Actualizar localStorage con la migración
        localStorage.setItem('empleados', JSON.stringify(empleadosMigrados));
      } catch {
        localStorage.setItem('empleados', JSON.stringify(empleadosIniciales));
        setEmpleados(empleadosIniciales);
      }
    } else {
      localStorage.setItem('empleados', JSON.stringify(empleadosIniciales));
    }
  }, []);

  // Guardar empleados en localStorage ante cualquier cambio
  useEffect(() => {
    try {
      localStorage.setItem('empleados', JSON.stringify(empleados));
    } catch {
      // noop
    }
  }, [empleados]);

  // Recargar empleados desde localStorage cuando otra vista actualice la nómina
  useEffect(() => {
    const reloadFromStorage = () => {
      try {
        const parsed: Empleado[] = JSON.parse(localStorage.getItem('empleados') || '[]');
        if (Array.isArray(parsed)) setEmpleados(parsed);
      } catch {
        /* noop */
      }
    };
    const onUpdated = () => reloadFromStorage();
    const onFocus = () => reloadFromStorage();

    window.addEventListener('empleados:updated', onUpdated as EventListener);
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('empleados:updated', onUpdated as EventListener);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  // Al montar: cargar guardias desde localStorage o inicializar
  useEffect(() => {
    const stored = localStorage.getItem('guardias');
    if (stored) {
      try {
        const parsed: Guardia[] = JSON.parse(stored);
        setGuardias(parsed);
      } catch {
        localStorage.setItem('guardias', JSON.stringify(guardiasIniciales));
        setGuardias(guardiasIniciales);
      }
    } else {
      localStorage.setItem('guardias', JSON.stringify(guardiasIniciales));
      setGuardias(guardiasIniciales);
    }
  }, []);

  // Utils de mapeo/normalización desde Excel
  const normalize = (v: any) => String(v ?? '').trim().toLowerCase();
  const mapTipoContrato = (v: any): Empleado['tipoContrato'] => {
    const t = normalize(v);
    if (t.includes('plazo')) return 'Plazo Fijo';
    return 'Planta';
  };
  const mapRol = (v: any): Empleado['rol'] => {
    const t = normalize(v);
    if (t.includes('guard')) return 'Guardia';
    if (t.includes('oficin')) return 'Oficina';
    if (t.includes('superv')) return 'Supervisión';
    if (t.includes('admin')) return 'Administración';
    return 'Personal de Base';
  };
  const mapEstado = (v: any): Empleado['estado'] => {
    const t = normalize(v);
    if (t.startsWith('ret')) return 'Retirado';
    return 'Pendiente';
  };

  // Calcular estadísticas
  const totalEmpleados = empleados.length;
  const beneficiosEntregados = empleados.filter(e => e.estado === 'Retirado').length;
  const beneficiosPendientes = empleados.filter(e => e.estado === 'Pendiente').length;
  const empleadosPlanta = empleados.filter(e => e.tipoContrato === 'Planta').length;
  const empleadosPlazoFijo = empleados.filter(e => e.tipoContrato === 'Plazo Fijo').length;

  // Calcular estadísticas por rol
  const empleadosPorRol = {
    guardia: empleados.filter(e => e.rol === 'Guardia').length,
    personalBase: empleados.filter(e => e.rol === 'Personal de Base').length,
    oficina: empleados.filter(e => e.rol === 'Oficina').length,
    supervision: empleados.filter(e => e.rol === 'Supervisión').length,
    administracion: empleados.filter(e => e.rol === 'Administración').length,
  };

  // Datos para gráficos
  const dataLocalidad = [
    { name: 'Valparaíso', value: empleados.filter(e => e.localidad === 'Valparaíso').length },
    { name: 'Casablanca', value: empleados.filter(e => e.localidad === 'Casablanca').length },
  ];

  const dataEstado = [
    { name: 'Retirados', value: beneficiosEntregados },
    { name: 'Pendientes', value: beneficiosPendientes },
  ];

  const dataRol = [
    { name: 'Personal de Base', value: empleadosPorRol.personalBase },
    { name: 'Oficina', value: empleadosPorRol.oficina },
    { name: 'Guardia', value: empleadosPorRol.guardia },
    { name: 'Supervisión', value: empleadosPorRol.supervision },
    { name: 'Administración', value: empleadosPorRol.administracion },
  ].filter(item => item.value > 0);

  const COLORS = ['#21808D', '#5E5240'];

  // Filtrar empleados
  const empleadosFiltrados = empleados.filter(emp => {
    if (filtroLocalidad !== 'all' && emp.localidad !== filtroLocalidad) return false;
    if (filtroContrato !== 'all' && emp.tipoContrato !== filtroContrato) return false;
    if (filtroEstado !== 'all' && emp.estado !== filtroEstado) return false;
    if (filtroRol !== 'all' && emp.rol !== filtroRol) return false;
    return true;
  });

  const handleCargarNomina = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const ext = getExt(file.name);

        let rows: any[] = [];

        if (ext === 'csv') {
          // CSV: sin dependencias, offline
          const text = await file.text();
          rows = parseCSV(text);
        } else if (ext === 'xlsx' || ext === 'xls') {
          // XLSX/XLS: intentar cargar desde CDN (requiere internet)
          // @ts-ignore
          const XLSXMod = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/xlsx@0.20.2/+esm');
          // @ts-ignore
          const XLSX = (XLSXMod as any).default ?? XLSXMod;

          const data = await file.arrayBuffer();
          const wb = XLSX.read(data, { type: 'array' });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        } else {
          alert('Formato no soportado. Usa .xlsx, .xls o .csv');
          return;
        }

        // Mapear filas a Empleado (columnas flexibles)
        const startId = Math.max(0, ...empleados.map((e) => e.id));
        const parsed: Empleado[] = rows.map((r, idx) => {
          const nombre = r.Nombre ?? r['Nombre Completo'] ?? r.nombre ?? getValue(r, ['nombre', 'nombre completo']) ?? '';
          const rut = (r.RUT ?? r.Rut ?? r.rut ?? getValue(r, ['rut', 'rut trabajador']) ?? '').toString();
          const correo = r.Correo ?? r.Email ?? r['E-mail'] ?? r.email ?? getValue(r, ['correo', 'email', 'e-mail', 'mail']) ?? '';
          const tipoContrato = mapTipoContrato(r.TipoContrato ?? r['Tipo de Contrato'] ?? r.contrato ?? getValue(r, ['tipocontrato', 'tipo de contrato']));
          const rol = mapRol(r.Rol ?? r['Rol/Departamento'] ?? r.Departamento ?? r['Departamento/Rol'] ?? r.rol ?? getValue(r, ['rol', 'rol/departamento', 'departamento', 'departamento/rol']));
          const localidad = r.Localidad ?? r.Sede ?? r.Planta ?? r.Ubicacion ?? getValue(r, ['localidad', 'sede', 'planta', 'ubicacion']) ?? '';
          const beneficio = r.Beneficio ?? r['Beneficio Asignado'] ?? r.beneficio ?? getValue(r, ['beneficio', 'beneficio asignado']) ?? '';
          const estado = mapEstado(r.Estado ?? r['Estado Beneficio'] ?? r.estado ?? getValue(r, ['estado', 'estado beneficio']));
          const fechaRetiroRaw = r.FechaRetiro ?? r['Fecha Retiro'] ?? r['Fecha de Retiro'] ?? getValue(r, ['fecharetiro', 'fecha retiro', 'fecha de retiro']) ?? '';
          const fechaRetiro = fechaRetiroRaw ? String(fechaRetiroRaw) : undefined;

          return {
            id: startId + idx + 1,
            nombre,
            rut,
            correo,
            tipoContrato,
            rol,
            localidad,
            beneficio,
            estado,
            fechaRetiro,
          };
        }).filter(p => p.nombre && p.rut);

        if (parsed.length === 0) {
          alert('Archivo leído, pero no se encontraron filas válidas. Revisa los encabezados.');
          return;
        }

        setEmpleados((prev: Empleado[]) => [...prev, ...parsed]);
        setUltimaCarga({ total: parsed.length, preview: parsed.slice(0, 5) });
      } catch (err) {
        console.error('Error al procesar nómina:', err);
        alert('No fue posible leer el archivo. Si subes .xlsx/.xls asegúrate de tener internet; como alternativa usa .csv.');
      } finally {
        (e.target as HTMLInputElement).value = '';
      }
    };
    input.click();
  };

  const handleExportarReporte = () => {
    const csvContent = [
      ['Nombre', 'RUT', 'Correo', 'Tipo Contrato', 'Rol/Departamento', 'Localidad', 'Beneficio', 'Estado', 'Fecha Retiro'].join(','),
      ...empleadosFiltrados.map((e: Empleado) => 
        [e.nombre, e.rut, e.correo || '', e.tipoContrato, e.rol, e.localidad, e.beneficio, e.estado, e.fechaRetiro || '-'].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_beneficios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleLimpiarNomina = () => {
    const ok = confirm(
      '¿Deseas limpiar la nómina?\n\nEsto borrará todos los empleados cargados y reiniciará la tabla. Podrás volver a cargar una nómina luego.'
    );
    if (!ok) return;

    try {
      // Dejar nómina vacía para un reset real
      localStorage.setItem('empleados', JSON.stringify([]));
    } catch {
      /* noop */
    }

    setEmpleados([]);
    setUltimaCarga(null);

    // Notificar a otras vistas (Guardia) que la nómina cambió
    try {
      window.dispatchEvent(new CustomEvent('empleados:updated'));
    } catch {}

    alert('Nómina limpiada.');
  };

  const handleEliminar = (id: number) => {
    if (confirm('¿Está seguro de eliminar este empleado?')) {
      setEmpleados(empleados.filter((e: Empleado) => e.id !== id));
    }
  };

  const handleAgregarGuardia = () => {
    if (!nuevoGuardia.nombre || !nuevoGuardia.rut) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Limpiar RUT y generar usuario/contraseña
    const rutLimpio = nuevoGuardia.rut.replace(/\./g, '');
    const rutSinDigito = rutLimpio.replace(/-/g, '').slice(0, -1);

    const guardia: Guardia = {
      id: guardias.length + 1,
      nombre: nuevoGuardia.nombre,
      rut: rutLimpio,
      usuario: rutLimpio,
      password: rutSinDigito,
      activo: true,
      fechaCreacion: new Date().toLocaleDateString('es-CL'),
    };

    setGuardias([...guardias, guardia]);
    
    // Guardar en localStorage para persistencia
    const guardiasActualizados = [...guardias, guardia];
    localStorage.setItem('guardias', JSON.stringify(guardiasActualizados));
    
    alert(`Guardia agregado exitosamente!\n\nUsuario: ${guardia.usuario}\nContraseña: ${guardia.password}`);
    setNuevoGuardia({ nombre: '', rut: '' });
    setMostrarFormGuardia(false);
  };

  const handleToggleGuardia = (id: number) => {
    const guardiasActualizados = guardias.map((g: Guardia) =>
      g.id === id ? { ...g, activo: !g.activo } : g
    );
    setGuardias(guardiasActualizados);
    localStorage.setItem('guardias', JSON.stringify(guardiasActualizados));
  };

  const handleEliminarGuardia = (id: number) => {
    if (confirm('¿Está seguro de eliminar este guardia?')) {
      const guardiasActualizados = guardias.filter((g: Guardia) => g.id !== id);
      setGuardias(guardiasActualizados);
      localStorage.setItem('guardias', JSON.stringify(guardiasActualizados));
    }
  };

  // Iniciar edición de contraseña
  const startEditarPassword = (g: Guardia) => {
    setEditPassId(g.id);
    setEditPassValue(g.password);
  };

  // Cancelar edición de contraseña
  const cancelarEditarPassword = () => {
    setEditPassId(null);
    setEditPassValue('');
  };

  // Guardar nueva contraseña
  const guardarNuevaPassword = () => {
    if (editPassId === null) return;
    const nueva = editPassValue.trim();
    if (nueva.length < 4) {
      alert('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    const guardiasActualizados = guardias.map((g: Guardia) =>
      g.id === editPassId ? { ...g, password: nueva } : g
    );
    setGuardias(guardiasActualizados);
    localStorage.setItem('guardias', JSON.stringify(guardiasActualizados));
    setEditPassId(null);
    setEditPassValue('');
    alert('Contraseña actualizada correctamente.');
  };

  // Notificar beneficios pendientes por correo
  const handleNotificarBeneficios = () => {
    const empleadosPendientes = empleados.filter((e: Empleado) => e.estado === 'Pendiente');
    
    if (empleadosPendientes.length === 0) {
      alert('No hay empleados con beneficios pendientes para notificar.');
      return;
    }

    const empleadosConCorreo = empleadosPendientes.filter((e: Empleado) => e.correo && e.correo.trim() !== '');
    const empleadosSinCorreo = empleadosPendientes.filter((e: Empleado) => !e.correo || e.correo.trim() === '');

    if (empleadosConCorreo.length === 0) {
      alert(`Se encontraron ${empleadosPendientes.length} empleados con beneficios pendientes, pero ninguno tiene correo registrado.`);
      return;
    }

    const confirmar = confirm(
      `Se enviarán notificaciones a ${empleadosConCorreo.length} empleados con beneficios pendientes.\n\n` +
      `✓ Con correo: ${empleadosConCorreo.length}\n` +
      `${empleadosSinCorreo.length > 0 ? `✗ Sin correo: ${empleadosSinCorreo.length}\n` : ''}` +
      `\n¿Desea continuar?`
    );

    if (!confirmar) return;

    // Simular envío de correos
    console.log('📧 Enviando notificaciones de beneficios...');
    empleadosConCorreo.forEach((emp: Empleado) => {
      console.log(`✉️ Enviando a: ${emp.nombre} (${emp.correo})`);
      console.log(`   Beneficio: ${emp.beneficio}`);
      console.log(`   Localidad: ${emp.localidad}`);
    });

    let mensaje = `✓ Se han enviado ${empleadosConCorreo.length} notificaciones exitosamente.\n\n`;
    mensaje += `Resumen:\n`;
    mensaje += `• Notificados: ${empleadosConCorreo.length}\n`;
    if (empleadosSinCorreo.length > 0) {
      mensaje += `• Sin correo (no notificados): ${empleadosSinCorreo.length}\n`;
    }
    mensaje += `\nLos empleados han sido notificados sobre sus beneficios pendientes.`;

    alert(mensaje);
  };

  // Helpers CSV (sin dependencias)
  const getExt = (name?: string) => (name?.split('.').pop() || '').toLowerCase();
  const splitCSVLine = (line: string, delim: string) => {
    const out: string[] = [];
    let cur = '', inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if (ch === delim && !inQuotes) {
        out.push(cur); cur = '';
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out.map(s => s.replace(/^\uFEFF/, '').trim());
  };
  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return [] as any[];
    const headerLine = lines[0];
    const delimiter = (headerLine.includes(';') && !headerLine.includes(',')) ? ';' : ',';
    const headers = splitCSVLine(headerLine, delimiter);
    return lines.slice(1).map(line => {
      const cells = splitCSVLine(line, delimiter);
      const row: Record<string, any> = {};
      headers.forEach((h, i) => { row[h] = cells[i] ?? ''; });
      return row;
    });
  };
  const getValue = (row: Record<string, any>, candidates: string[]) => {
    const keys = Object.keys(row);
    for (const cand of candidates) {
      const idx = keys.findIndex(k => k.toLowerCase() === cand.toLowerCase());
      if (idx !== -1) return row[keys[idx]];
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-[#D32027] hover:bg-[#D32027]/10"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setVistaActual('dashboard')}
              variant={vistaActual === 'dashboard' ? 'default' : 'outline'}
              className={vistaActual === 'dashboard' ? 'bg-[#D32027] text-white' : ''}
            >
              Dashboard
            </Button>
            <Button
              onClick={() => setVistaActual('empleados')}
              variant={vistaActual === 'empleados' ? 'default' : 'outline'}
              className={vistaActual === 'empleados' ? 'bg-[#D32027] text-white' : ''}
            >
              Empleados
            </Button>
            <Button
              onClick={() => setVistaActual('reportes')}
              variant={vistaActual === 'reportes' ? 'default' : 'outline'}
              className={vistaActual === 'reportes' ? 'bg-[#D32027] text-white' : ''}
            >
              Reportes
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-[#D32027] mb-2">Panel de Administrador</h1>
          <p className="text-gray-600">Gestiona empleados, beneficios, guardias y genera reportes</p>
        </div>

        {/* Vista Dashboard */}
        {vistaActual === 'dashboard' && (
          <div className="space-y-6">
            {/* Estadísticas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6 bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Total Empleados</p>
                    <p className="text-gray-900">{totalEmpleados}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#D32027]/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#D32027]" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Beneficios Entregados</p>
                    <p className="text-gray-900">{beneficiosEntregados}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#008C45]/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-[#008C45]" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Pendientes</p>
                    <p className="text-gray-900">{beneficiosPendientes}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Tasa Retiro</p>
                    <p className="text-gray-900">
                      {totalEmpleados > 0 ? Math.round((beneficiosEntregados / totalEmpleados) * 100) : 0}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-[#008C45]/10 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-[#008C45]" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white shadow-md rounded-xl">
                <h2 className="text-[#D32027] mb-4">Distribución por Estado</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={dataEstado}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dataEstado.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#008C45' : '#FFC107'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-white shadow-md rounded-xl">
                <h2 className="text-[#D32027] mb-4">Empleados por Localidad</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dataLocalidad}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#D32027" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-white shadow-md rounded-xl">
                <h2 className="text-[#D32027] mb-4">Empleados por Rol/Departamento</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dataRol}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#008C45" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Resumen por Tipo de Contrato */}
            <Card className="p-6 bg-white shadow-md rounded-xl">
              <h2 className="text-[#D32027] mb-4">Resumen Detallado</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#008C45]/10 rounded-lg p-4">
                  <h3 className="text-[#D32027] mb-2">Personal de Base</h3>
                  <p className="text-gray-700 text-2xl font-bold">{empleadosPorRol.personalBase}</p>
                  <p className="text-gray-600 text-sm">Operadores y producción</p>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-4">
                  <h3 className="text-[#D32027] mb-2">Oficina</h3>
                  <p className="text-gray-700 text-2xl font-bold">{empleadosPorRol.oficina}</p>
                  <p className="text-gray-600 text-sm">Personal administrativo</p>
                </div>
                <div className="bg-[#D32027]/10 rounded-lg p-4">
                  <h3 className="text-[#D32027] mb-2">Guardia</h3>
                  <p className="text-gray-700 text-2xl font-bold">{empleadosPorRol.guardia}</p>
                  <p className="text-gray-600 text-sm">Seguridad y portería</p>
                </div>
              </div>
            </Card>

            {/* Nueva tarjeta de Guardias Activos */}
            <Card className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#D32027]">Guardias del Sistema</h2>
                <Button
                  onClick={() => setVistaActual('empleados')}
                  variant="outline"
                  className="border-[#008C45] text-[#008C45] hover:bg-[#008C45]/10"
                >
                  Ver Gestión de Guardias
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#008C45]/10 rounded-lg p-4">
                  <p className="text-gray-600 mb-1">Total Guardias</p>
                  <p className="text-2xl font-bold text-gray-900">{guardias.length}</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-4">
                  <p className="text-gray-600 mb-1">Activos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {guardias.filter(g => g.activo).length}
                  </p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-4">
                  <p className="text-gray-600 mb-1">Inactivos</p>
                  <p className="text-2xl font-bold text-red-600">
                    {guardias.filter(g => !g.activo).length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Vista Empleados con nueva pestaña de Guardias */}
        {vistaActual === 'empleados' && (
          <div className="space-y-6">
            {/* Tabs */}
            <Card className="p-4 bg-white shadow-md rounded-xl">
              <div className="flex gap-2">
                <Button
                  onClick={() => setVistaActual('empleados')}
                  className="bg-[#D32027] text-white"
                >
                  Nómina de Empleados
                </Button>
                <Button
                  onClick={() => {/* Se mantiene en empleados pero cambia vista */}}
                  variant="outline"
                  className="border-[#008C45] text-[#008C45] hover:bg-[#008C45]/10"
                >
                  Gestión de Guardias
                </Button>
                <Button
                  onClick={handleNotificarBeneficios}
                  variant="outline"
                  className="border-[#D32027] text-[#D32027] hover:bg-[#D32027]/10"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Notificar Beneficios
                </Button>
              </div>
            </Card>

            {/* Sección de Gestión de Guardias */}
            <Card className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#D32027]">Gestión de Guardias</h2>
                <Button
                  onClick={() => setMostrarFormGuardia(!mostrarFormGuardia)}
                  className="bg-[#008C45] hover:bg-[#008C45]/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {mostrarFormGuardia ? 'Cancelar' : 'Agregar Guardia'}
                </Button>
              </div>

              {/* Formulario de nuevo guardia */}
              {mostrarFormGuardia && (
                <Card className="p-6 mb-6 bg-[#008C45]/5 border-2 border-[#008C45]/20">
                  <h3 className="text-[#D32027] mb-4">Nuevo Guardia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-600 block mb-2">Nombre Completo</label>
                      <Input
                        type="text"
                        placeholder="Ej: Juan Pérez"
                        value={nuevoGuardia.nombre}
                        onChange={(e) => setNuevoGuardia({ ...nuevoGuardia, nombre: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 block mb-2">RUT (sin puntos, con guión)</label>
                      <Input
                        type="text"
                        placeholder="Ej: 15123456-7"
                        value={nuevoGuardia.rut}
                        onChange={(e) => setNuevoGuardia({ ...nuevoGuardia, rut: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Nota:</strong> Las credenciales se generarán automáticamente:
                    </p>
                    <ul className="text-xs text-gray-600 mt-2 space-y-1">
                      <li>• Usuario: RUT sin puntos (con guión)</li>
                      <li>• Contraseña: RUT sin puntos, sin guión y sin dígito verificador</li>
                    </ul>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleAgregarGuardia}
                      className="bg-[#008C45] hover:bg-[#008C45]/90 text-white"
                    >
                      Guardar Guardia
                    </Button>
                    <Button
                      onClick={() => {
                        setMostrarFormGuardia(false);
                        setNuevoGuardia({ nombre: '', rut: '' });
                      }}
                      variant="outline"
                    >
                      Cancelar
                    </Button>
                  </div>
                </Card>
              )}

              {/* Tabla de Guardias */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>RUT</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Contraseña</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Creación</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guardias.map((guardia) => (
                      <TableRow key={guardia.id}>
                        <TableCell>{guardia.nombre}</TableCell>
                        <TableCell>{guardia.rut}</TableCell>
                        <TableCell>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {guardia.usuario}
                          </code>
                        </TableCell>

                        {/* Contraseña editable */}
                        <TableCell>
                          {editPassId === guardia.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="text"
                                value={editPassValue}
                                onChange={(e) => setEditPassValue(e.target.value)}
                                placeholder="Nueva contraseña"
                                className="w-40"
                              />
                            </div>
                          ) : (
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {guardia.password}
                            </code>
                          )}
                        </TableCell>

                        <TableCell>
                          <Badge
                            className={
                              guardia.activo
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }
                          >
                            {guardia.activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell>{guardia.fechaCreacion}</TableCell>

                        {/* Acciones con editar contraseña */}
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {editPassId === guardia.id ? (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-[#008C45] hover:bg-[#008C45]/90 text-white"
                                  onClick={guardarNuevaPassword}
                                >
                                  Guardar
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelarEditarPassword}>
                                  Cancelar
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditarPassword(guardia)}
                              >
                                Cambiar
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleGuardia(guardia.id)}
                              className={
                                guardia.activo
                                  ? 'border-red-500 text-red-500 hover:bg-red-50'
                                  : 'border-green-500 text-green-500 hover:bg-green-50'
                              }
                            >
                              {guardia.activo ? 'Desactivar' : 'Activar'}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEliminarGuardia(guardia.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Vista Empleados */}
            <Card className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <h2 className="text-[#D32027]">Gestión de Nómina</h2>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCargarNomina}
                    className="bg-[#D32027] hover:bg-[#D32027]/90 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Cargar Nómina
                  </Button>
                  <Button
                    onClick={handleLimpiarNomina}
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50"
                    title="Vaciar nómina de empleados"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpiar Nómina
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#008C45] text-[#008C45] hover:bg-[#008C45]/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Empleado
                  </Button>
                </div>
              </div>
              {/* Leyenda de formatos y columnas */}
              <p className="text-xs text-gray-600 mt-2">
                Formatos admitidos: .xlsx, .xls, .csv. Columnas esperadas (nombres flexibles): 
                Nombre, RUT, Correo, TipoContrato, Rol, Localidad, Beneficio, Estado, FechaRetiro.
              </p>
            </Card>

            {/* Resumen última carga (si existe) */}
            {ultimaCarga && (
              <Card className="p-6 bg-white shadow-md rounded-xl">
                <h3 className="text-[#D32027] mb-2">Resumen de carga</h3>
                <p className="text-gray-700 mb-4">
                  Se agregaron {ultimaCarga.total} empleados desde el archivo.
                </p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>RUT</TableHead>
                        <TableHead>Correo</TableHead>
                        <TableHead>Tipo Contrato</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Localidad</TableHead>
                        <TableHead>Beneficio</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ultimaCarga.preview.map((emp: Empleado) => (
                        <TableRow key={emp.id}>
                          <TableCell>{emp.nombre}</TableCell>
                          <TableCell>{emp.rut}</TableCell>
                          <TableCell>{emp.correo}</TableCell>
                          <TableCell>{emp.tipoContrato}</TableCell>
                          <TableCell>{emp.rol}</TableCell>
                          <TableCell>{emp.localidad}</TableCell>
                          <TableCell>{emp.beneficio}</TableCell>
                          <TableCell>{emp.estado}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-xs text-gray-500 mt-2">Mostrando una vista previa (máx. 5). Revisa la tabla completa abajo.</p>
              </Card>
            )}

            {/* Filtros */}
            <Card className="p-6 bg-white shadow-md rounded-xl">
              <h3 className="text-[#D32027] mb-4">Filtros</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-gray-600 block mb-2">Localidad</label>
                  <Select value={filtroLocalidad} onValueChange={setFiltroLocalidad}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Valparaíso">Valparaíso</SelectItem>
                      <SelectItem value="Casablanca">Casablanca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-gray-600 block mb-2">Tipo de Contrato</label>
                  <Select value={filtroContrato} onValueChange={setFiltroContrato}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Planta">Planta</SelectItem>
                      <SelectItem value="Plazo Fijo">Plazo Fijo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-gray-600 block mb-2">Rol/Departamento</label>
                  <Select value={filtroRol} onValueChange={setFiltroRol}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Guardia">Guardia</SelectItem>
                      <SelectItem value="Personal de Base">Personal de Base</SelectItem>
                      <SelectItem value="Oficina">Oficina</SelectItem>
                      <SelectItem value="Supervisión">Supervisión</SelectItem>
                      <SelectItem value="Administración">Administración</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-gray-600 block mb-2">Estado</label>
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Retirado">Retirado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Tabla de Empleados (ya refleja lo cargado) */}
            <Card className="bg-white shadow-md rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>RUT</TableHead>
                      <TableHead>Correo</TableHead>
                      <TableHead>Tipo Contrato</TableHead>
                      <TableHead>Rol/Departamento</TableHead>
                      <TableHead>Localidad</TableHead>
                      <TableHead>Beneficio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {empleadosFiltrados.map((emp: Empleado) => (
                      <TableRow key={emp.id}>
                        <TableCell>{emp.nombre}</TableCell>
                        <TableCell>{emp.rut}</TableCell>
                        <TableCell>{emp.correo}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              emp.tipoContrato === 'Planta'
                                ? 'bg-[#008C45]/20 text-[#008C45]'
                                : 'bg-[#D32027]/20 text-[#D32027]'
                            }
                          >
                            {emp.tipoContrato}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              emp.rol === 'Guardia'
                                ? 'bg-red-500/10 text-red-600'
                                : emp.rol === 'Personal de Base'
                                ? 'bg-green-500/10 text-green-600'
                                : emp.rol === 'Oficina'
                                ? 'bg-yellow-500/10 text-yellow-600'
                                : 'bg-gray-500/10 text-gray-600'
                            }
                          >
                            {emp.rol}
                          </Badge>
                        </TableCell>
                        <TableCell>{emp.localidad}</TableCell>
                        <TableCell>{emp.beneficio}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              emp.estado === 'Retirado'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }
                          >
                            {emp.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEliminar(emp.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}

        {/* Vista Reportes */}
        {vistaActual === 'reportes' && (
          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-md rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#D32027]">Generación de Reportes</h2>
                <Button
                  onClick={handleExportarReporte}
                  className="bg-[#D32027] hover:bg-[#D32027]/90 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Reporte
                </Button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#008C45]/10 rounded-lg p-4">
                  <h3 className="text-[#D32027] mb-2">Empleados No Retirados</h3>
                  <div className="space-y-2">
                    {empleados.filter(e => e.estado === 'Pendiente').map(emp => (
                      <div key={emp.id} className="bg-white rounded p-3 flex items-center justify-between">
                        <div>
                          <p className="text-gray-900">{emp.nombre}</p>
                          <p className="text-gray-600">{emp.rut} • {emp.localidad}</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700">
                          Pendiente
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border-2 border-[#E5E5E5] rounded-lg p-4">
                    <FileText className="w-8 h-8 text-[#D32027] mb-2" />
                    <h3 className="text-[#D32027] mb-2">Reporte Detallado</h3>
                    <p className="text-gray-600 mb-4">
                      Incluye todos los empleados con detalles completos
                    </p>
                    <Button variant="outline" className="w-full border-[#008C45] text-[#008C45] hover:bg-[#008C45]/10">
                      Generar PDF
                    </Button>
                  </div>

                  <div className="bg-white border-2 border-[#E5E5E5] rounded-lg p-4">
                    <FileText className="w-8 h-8 text-[#D32027] mb-2" />
                    <h3 className="text-[#D32027] mb-2">Reporte Resumen</h3>
                    <p className="text-gray-600 mb-4">
                      Vista ejecutiva con estadísticas principales
                    </p>
                    <Button variant="outline" className="w-full border-[#008C45] text-[#008C45] hover:bg-[#008C45]/10">
                      Generar PDF
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
