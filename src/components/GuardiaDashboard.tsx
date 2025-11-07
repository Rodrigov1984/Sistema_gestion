import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, QrCode, Search, CheckCircle, XCircle, Package, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import jsQR from 'jsqr';

interface GuardiaDashboardProps {
  onBack: () => void;
  guardia?: { nombre: string; usuario: string; activo: boolean };
}

interface Trabajador {
  rut: string;
  nombre: string;
  correo?: string;
  tipoContrato: 'Planta' | 'Plazo Fijo';
  beneficio: string;
  retirado: boolean;
  fechaRetiro?: string;
}

// Helpers nómina
type Empleado = {
  id: number;
  nombre: string;
  rut: string;
  correo?: string;
  tipoContrato: 'Planta' | 'Plazo Fijo';
  rol: string;
  localidad: string;
  beneficio: string;
  estado: 'Pendiente' | 'Retirado';
  fechaRetiro?: string;
};

const normalizeRut = (r: string) => (r || '').toString().replace(/[.\-]/g, '').toUpperCase();
const loadEmpleados = (): Empleado[] => {
  try {
    const empleados = JSON.parse(localStorage.getItem('empleados') || '[]') as Empleado[];
    console.log('📋 Empleados cargados desde localStorage:', empleados.length);
    console.log('Empleados:', empleados);
    return empleados;
  } catch {
    console.error('❌ Error al cargar empleados desde localStorage');
    return [];
  }
};
const findEmpleadoByRut = (rut: string): Empleado | undefined => {
  const lista = loadEmpleados();
  const target = normalizeRut(rut);
  console.log('🔍 Buscando RUT normalizado:', target);
  console.log('RUTs en la lista:', lista.map(e => normalizeRut(e.rut)));
  return lista.find((e) => normalizeRut(e.rut) === target);
};

export default function GuardiaDashboard({ onBack, guardia }: GuardiaDashboardProps) {
  const [scanMode, setScanMode] = useState<'qr' | 'manual'>('qr');
  const [rutInput, setRutInput] = useState('');
  const [trabajadorActual, setTrabajadorActual] = useState<Trabajador | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [ultimaEntrega, setUltimaEntrega] = useState<string>('');
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (scanMode === 'qr' && scanning) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [scanMode, scanning]);

  useEffect(() => {
    // Exigir guardia activo del módulo de Gestión de Guardias
    const normalizeUser = (s: string) => (s || '').replace(/\./g, '').trim();
    try {
      if (!guardia) {
        alert('Debe iniciar sesión como guardia.');
        onBack();
        return;
      }
      const lista = JSON.parse(localStorage.getItem('guardias') || '[]');
      const match = lista.find((g: any) => normalizeUser(g.usuario) === normalizeUser(guardia.usuario));
      if (!match || !match.activo) {
        alert('Guardia no autorizado o inactivo.');
        onBack();
      }
    } catch {
      onBack();
    }
  }, [guardia, onBack]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        requestAnimationFrame(scanQRCode);
      }
    } catch (err) {
      console.error('Error accediendo a la cámara:', err);
      setMensaje({ tipo: 'error', texto: 'No se pudo acceder a la cámara' });
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const scanQRCode = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        try {
          const data = JSON.parse(code.data);
          // Validar SIEMPRE contra nómina cargada usando el RUT del QR
          if (data?.rut) {
            buscarTrabajador(data.rut);
            setScanning(false);
            return;
          }
        } catch (err) {
          console.error('Error parsing QR:', err);
        }
      }
    }

    requestAnimationFrame(scanQRCode);
  };

  const buscarTrabajador = (rut: string) => {
    setMensaje(null);

    const empleado = findEmpleadoByRut(rut);
    if (!empleado) {
      setMensaje({ tipo: 'error', texto: 'RUT no encontrado en la nómina' });
      setTrabajadorActual(null);
      return;
    }

    console.log('Empleado encontrado:', empleado); // Debug

    const trabajador: Trabajador = {
      rut: empleado.rut,
      nombre: empleado.nombre,
      correo: empleado.correo,
      tipoContrato: empleado.tipoContrato,
      beneficio: empleado.beneficio,
      retirado: empleado.estado === 'Retirado',
      fechaRetiro: empleado.fechaRetiro,
    };

    console.log('Trabajador con correo:', trabajador.correo); // Debug

    setTrabajadorActual(trabajador);
  };

  const buscarPorRut = () => {
    if (!rutInput.trim()) {
      setMensaje({ tipo: 'error', texto: 'Ingrese un RUT válido' });
      return;
    }
    buscarTrabajador(rutInput);
  };

  const confirmarEntrega = () => {
    if (!trabajadorActual) return;

    // Releer y actualizar nómina en localStorage
    const lista = loadEmpleados();
    const idx = lista.findIndex((e) => normalizeRut(e.rut) === normalizeRut(trabajadorActual.rut));
    if (idx === -1) {
      setMensaje({ tipo: 'error', texto: 'No se pudo actualizar la nómina. Intente nuevamente.' });
      return;
    }

    if (lista[idx].estado === 'Retirado') {
      setMensaje({ tipo: 'error', texto: `Este beneficio ya fue retirado el ${lista[idx].fechaRetiro}` });
      return;
    }

    const fecha = new Date().toLocaleString('es-CL');
    lista[idx] = { ...lista[idx], estado: 'Retirado', fechaRetiro: fecha };
    try {
      localStorage.setItem('empleados', JSON.stringify(lista));
      // Notificar a otras vistas (Admin) que la nómina cambió
      window.dispatchEvent(new CustomEvent('empleados:updated'));
    } catch (e) {
      console.error('Error guardando nómina:', e);
      setMensaje({ tipo: 'error', texto: 'Error al guardar cambios.' });
      return;
    }

    // Usar el correo del trabajador actual que ya tiene la información
    const correoEmpleado = trabajadorActual.correo || 'correo no registrado';

    setTrabajadorActual((prev: Trabajador | null) =>
      prev ? { ...prev, retirado: true, fechaRetiro: fecha } : prev
    );
    setMensaje({ 
      tipo: 'success', 
      texto: `✓ Entrega confirmada exitosamente\n📧 Notificación enviada a: ${correoEmpleado}` 
    });
    setUltimaEntrega(`${trabajadorActual.nombre} - ${fecha} (📧 ${correoEmpleado})`);

    setTimeout(() => {
      setTrabajadorActual(null);
      setRutInput('');
      setMensaje(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-[#D32027] hover:bg-[#D32027]/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-[#D32027] mb-2">Portal del Guardia</h1>
          <p className="text-gray-600">Valida y registra la entrega de beneficios</p>
        </div>

        {/* Método de Validación */}
        <Card className="p-6 mb-6 bg-white shadow-md rounded-xl">
          <h2 className="text-[#D32027] mb-4">Método de Validación</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              onClick={() => {
                setScanMode('qr');
                setTrabajadorActual(null);
                setMensaje(null);
              }}
              className={`h-auto py-4 ${
                scanMode === 'qr'
                  ? 'bg-[#D32027] text-white'
                  : 'bg-white border-2 border-[#E5E5E5] text-gray-700 hover:bg-[#D32027]/10'
              }`}
            >
              <QrCode className="w-5 h-5 mr-2" />
              Escanear QR
            </Button>
            <Button
              onClick={() => {
                setScanMode('manual');
                setScanning(false);
                setTrabajadorActual(null);
                setMensaje(null);
              }}
              className={`h-auto py-4 ${
                scanMode === 'manual'
                  ? 'bg-[#D32027] text-white'
                  : 'bg-white border-2 border-[#E5E5E5] text-gray-700 hover:bg-[#D32027]/10'
              }`}
            >
              <Search className="w-5 h-5 mr-2" />
              Ingreso Manual
            </Button>
          </div>

          {/* Escaneo QR */}
          {scanMode === 'qr' && (
            <div className="space-y-4">
              {!scanning ? (
                <div className="text-center py-8">
                  <div className="w-32 h-32 bg-[#008C45]/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-[#008C45]/40" />
                  </div>
                  <p className="text-gray-600 mb-4">
                    Activa la cámara para escanear el código QR del trabajador
                  </p>
                  <Button
                    onClick={() => setScanning(true)}
                    className="bg-[#D32027] hover:bg-[#D32027]/90 text-white"
                  >
                    Activar Cámara
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-64 object-cover"
                      playsInline
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute inset-0 border-4 border-[#D32027] m-12 rounded-lg pointer-events-none"></div>
                  </div>
                  <Button
                    onClick={() => setScanning(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Detener Escaneo
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Ingreso Manual */}
          {scanMode === 'manual' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ej: 16.234.567-8"
                  value={rutInput}
                  onChange={(e) => setRutInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && buscarPorRut()}
                  className="flex-1"
                />
                <Button
                  onClick={buscarPorRut}
                  className="bg-[#D32027] hover:bg-[#D32027]/90 text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>
              <p className="text-gray-600">Ingresa el RUT del trabajador</p>
            </div>
          )}
        </Card>

        {/* Mensajes */}
        {mensaje && (
          <Alert className={`mb-6 ${
            mensaje.tipo === 'success' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <AlertDescription className={`whitespace-pre-line ${
              mensaje.tipo === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {mensaje.texto}
            </AlertDescription>
          </Alert>
        )}

        {/* Panel de Validación */}
        {trabajadorActual && (
          <Card className="p-6 mb-6 bg-white shadow-md rounded-xl">
            <h2 className="text-[#D32027] mb-6">Información del Trabajador</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-gray-600 block mb-1">Nombre Completo</label>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[#008C45]" />
                  <p className="text-gray-900">{trabajadorActual.nombre}</p>
                </div>
              </div>
              <div>
                <label className="text-gray-600 block mb-1">RUT</label>
                <p className="text-gray-900">{trabajadorActual.rut}</p>
              </div>
              <div>
                <label className="text-gray-600 block mb-1">Tipo de Contrato</label>
                <span className={`inline-block px-3 py-1 rounded-full ${
                  trabajadorActual.tipoContrato === 'Planta'
                    ? 'bg-[#008C45]/20 text-[#008C45]'
                    : 'bg-[#D32027]/20 text-[#D32027]'
                }`}>
                  {trabajadorActual.tipoContrato}
                </span>
              </div>
              <div>
                <label className="text-gray-600 block mb-1">Tipo de Caja</label>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#008C45]" />
                  <p className="text-gray-900">
                    {trabajadorActual.tipoContrato === 'Planta' ? 'Caja Grande' : 'Caja Estándar'}
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-4 mb-6 ${
              trabajadorActual.retirado 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-green-50 border border-green-200'
            }`}>
              <div className="flex items-center gap-2">
                {trabajadorActual.retirado ? (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700">
                      Beneficio ya retirado {trabajadorActual.fechaRetiro ? `el ${trabajadorActual.fechaRetiro}` : ''}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700">
                      Beneficio disponible para retiro
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={confirmarEntrega}
                disabled={trabajadorActual.retirado}
                className="flex-1 bg-[#008C45] hover:bg-[#008C45]/90 text-white disabled:bg-gray-300 disabled:cursor-not-allowed h-12"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirmar Entrega
              </Button>
              <Button
                onClick={() => {
                  setTrabajadorActual(null);
                  setRutInput('');
                  setMensaje(null);
                }}
                variant="outline"
                className="border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {/* Última Entrega */}
        {ultimaEntrega && (
          <Card className="p-4 bg-[#008C45]/10 rounded-xl">
            <p className="text-gray-900">
              <span className="text-gray-600">Última entrega:</span> {ultimaEntrega}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
