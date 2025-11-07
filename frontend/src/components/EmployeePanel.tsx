```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowLeft, Briefcase, Calendar, Download, Package, QrCode, User } from 'lucide-react';
import QRCode from 'qrcode';

const datosEmpleado = {
  nombre: 'María Fernanda González',
  rut: '16.234.567-8',
  cargo: 'Operador de Producción',
  tipoContrato: 'Planta',
  beneficioAsignado: 'Caja Navidad 2024',
  estadoBeneficio: 'Pendiente',
  fechaLimite: '20 de Diciembre, 2024',
  tipoCaja: 'Caja Grande (Planta)'
};

const EmployeePanel: React.FC = () => {
  const navigate = useNavigate();
  const [codigoQR, setCodigoQR] = React.useState('');
  const [generando, setGenerando] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const handleVolver = () => {
    // Regresa a la pantalla de selección de paneles (con las 3 tarjetas)
    navigate('/beneficios-empleados', { replace: true });
  };

  const generarCodigoQR = async () => {
    setGenerando(true);
    
    // Incluir toda la información relevante en el QR
    const datosQR = {
      nombre: datosEmpleado.nombre,
      rut: datosEmpleado.rut,
      cargo: datosEmpleado.cargo,
      tipoContrato: datosEmpleado.tipoContrato,
      beneficioAsignado: datosEmpleado.beneficioAsignado,
      estadoBeneficio: datosEmpleado.estadoBeneficio,
      fechaLimite: datosEmpleado.fechaLimite,
      tipoCaja: datosEmpleado.tipoCaja,
      timestamp: new Date().toISOString()
    };

    try {
      const qrDataURL = await QRCode.toDataURL(JSON.stringify(datosQR), {
        width: 250,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setCodigoQR(qrDataURL);
    } catch (error) {
      console.error('Error al generar QR:', error);
      alert('Error al generar el código QR');
    } finally {
      setGenerando(false);
    }
  };

  const descargarQRConDatos = () => {
    if (!canvasRef.current || !codigoQR) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const qrImage = new Image();
    qrImage.crossOrigin = 'anonymous';
    
    qrImage.onload = () => {
      try {
        canvas.width = 800;
        canvas.height = 1100;

        // Fondo blanco
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Borde exterior
        ctx.strokeStyle = '#D32027';
        ctx.lineWidth = 6;
        ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

        // Título principal
        ctx.fillStyle = '#D32027';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Sistema de Gestión de Beneficios', canvas.width / 2, 70);

        // Subtítulo
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#666666';
        ctx.fillText('Tresmontes Lucchetti', canvas.width / 2, 100);

        // Línea divisoria
        ctx.beginPath();
        ctx.moveTo(60, 130);
        ctx.lineTo(canvas.width - 60, 130);
        ctx.strokeStyle = '#E5E5E5';
        ctx.lineWidth = 3;
        ctx.stroke();

        // CÓDIGO QR CENTRADO (primera prioridad visual)
        let yPos = 180;
        ctx.fillStyle = '#D32027';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CÓDIGO QR PARA RETIRO', canvas.width / 2, yPos);
        yPos += 50;

        // Dibujar el código QR centrado y más grande
        const qrSize = 350;
        const qrX = (canvas.width - qrSize) / 2;
        const qrY = yPos;

        // Fondo blanco para el QR
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40);

        // Borde del QR
        ctx.strokeStyle = '#D32027';
        ctx.lineWidth = 4;
        ctx.strokeRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40);

        // Dibujar QR
        ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

        // Texto debajo del QR
        yPos = qrY + qrSize + 50;
        ctx.fillStyle = '#008C45';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Presenta este código en portería para retirar tu beneficio', canvas.width / 2, yPos);

        // Línea divisoria
        yPos += 40;
        ctx.beginPath();
        ctx.moveTo(60, yPos);
        ctx.lineTo(canvas.width - 60, yPos);
        ctx.strokeStyle = '#E5E5E5';
        ctx.lineWidth = 2;
        ctx.stroke();
        yPos += 40;

        // Datos del empleado (compactos)
        ctx.fillStyle = '#D32027';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('INFORMACIÓN DEL EMPLEADO', canvas.width / 2, yPos);
        yPos += 35;

        const lineHeight = 28;
        ctx.fillStyle = '#333333';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        
        ctx.fillText(`${datosEmpleado.nombre} • ${datosEmpleado.rut}`, canvas.width / 2, yPos);
        yPos += lineHeight;
        
        ctx.fillText(`${datosEmpleado.cargo} • ${datosEmpleado.tipoContrato}`, canvas.width / 2, yPos);
        yPos += lineHeight;
        
        ctx.fillText(`${datosEmpleado.beneficioAsignado} • ${datosEmpleado.tipoCaja}`, canvas.width / 2, yPos);
        yPos += lineHeight;
        
        ctx.fillStyle = '#D32027';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`Fecha Límite: ${datosEmpleado.fechaLimite}`, canvas.width / 2, yPos);

        // Fecha de generación (pie de página)
        yPos = canvas.height - 50;
        ctx.font = '14px Arial';
        ctx.fillStyle = '#999999';
        const fechaGeneracion = new Date().toLocaleString('es-CL');
        ctx.fillText(`Generado el: ${fechaGeneracion}`, canvas.width / 2, yPos);

        // Descargar
        const link = document.createElement('a');
        link.download = `QR-Beneficio-${datosEmpleado.rut.replace(/\./g, '')}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } catch (error) {
        console.error('Error al generar la imagen:', error);
        alert('Error al generar la imagen. Por favor, intenta de nuevo.');
      }
    };

    qrImage.onerror = () => {
      console.error('Error al cargar la imagen del QR');
      alert('Error al cargar el código QR. Por favor, intenta de nuevo.');
    };

    qrImage.src = codigoQR;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="max-w-4xl mx-auto">
        {/* Botón Volver */}
        <div className="mb-6 flex items-center gap-4">
          <Button onClick={handleVolver} variant="ghost" className="text-[#D32027] hover:bg-[#D32027]/10">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
        </div>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-[#D32027] mb-2">Portal del Empleado</h1>
          <p className="text-gray-600">Consulta tus datos y genera tu código QR para retiro de beneficios</p>
        </div>

        {/* Datos Personales */}
        <Card className="p-6 mb-6 bg-white shadow-md rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#D32027]/10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-[#D32027]" />
            </div>
            <h2 className="text-[#D32027]">Mis Datos Personales</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-600 block mb-1">Nombre Completo</label>
              <p className="text-gray-900">{datosEmpleado.nombre}</p>
            </div>
            <div>
              <label className="text-gray-600 block mb-1">RUT</label>
              <p className="text-gray-900">{datosEmpleado.rut}</p>
            </div>
            <div>
              <label className="text-gray-600 block mb-1">Cargo</label>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#008C45]" />
                <p className="text-gray-900">{datosEmpleado.cargo}</p>
              </div>
            </div>
            <div>
              <label className="text-gray-600 block mb-1">Tipo de Contrato</label>
              <span className="inline-block px-3 py-1 rounded-full bg-[#008C45]/20 text-[#008C45]">
                {datosEmpleado.tipoContrato}
              </span>
            </div>
          </div>
        </Card>

        {/* Mi Beneficio */}
        <Card className="p-6 mb-6 bg-white shadow-md rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#008C45]/10 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-[#008C45]" />
            </div>
            <h2 className="text-[#D32027]">Mi Beneficio</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-gray-600 block mb-1">Beneficio Asignado</label>
              <p className="text-gray-900">{datosEmpleado.beneficioAsignado}</p>
            </div>
            <div>
              <label className="text-gray-600 block mb-1">Estado</label>
              <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                {datosEmpleado.estadoBeneficio}
              </span>
            </div>
            <div>
              <label className="text-gray-600 block mb-1">Tipo de Caja</label>
              <p className="text-gray-900">{datosEmpleado.tipoCaja}</p>
            </div>
            <div>
              <label className="text-gray-600 block mb-1">Fecha Límite de Retiro</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D32027]" />
                <p className="text-gray-900">{datosEmpleado.fechaLimite}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#008C45]/10 rounded-lg p-4">
            <h3 className="text-[#D32027] mb-2">Instrucciones para el Retiro</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Genera tu código QR antes de dirigirte a portería</li>
              <li>• Presenta el código QR al guardia de seguridad</li>
              <li>• El guardia verificará tu identidad y te entregará tu beneficio</li>
              <li>• Recuerda retirar antes de la fecha límite</li>
            </ul>
          </div>
        </Card>

        {/* Mi Código QR */}
        <Card className="p-6 bg-white shadow-md rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#D32027]/10 rounded-full flex items-center justify-center">
              <QrCode className="w-6 h-6 text-[#D32027]" />
            </div>
            <h2 className="text-[#D32027]">Mi Código QR</h2>
          </div>

          {codigoQR ? (
            <div className="space-y-6">
              {/* Vista previa con información */}
              <div className="bg-white border-2 border-[#D32027] rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Información del empleado */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-[#D32027] mb-4">Información del Empleado</h3>
                    <div>
                      <p className="text-sm text-gray-600">Nombre</p>
                      <p className="font-medium text-gray-900">{datosEmpleado.nombre}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">RUT</p>
                      <p className="font-medium text-gray-900">{datosEmpleado.rut}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Beneficio</p>
                      <p className="font-medium text-gray-900">{datosEmpleado.beneficioAsignado}</p>
                    </div>
                  </div>

                  {/* Código QR */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                      <img src={codigoQR} alt="Código QR" className="w-64 h-64" />
                    </div>
                    <p className="text-sm text-gray-600 mt-3 text-center">Código QR para retiro</p>
                  </div>
                </div>

                <div className="bg-[#008C45]/10 rounded-lg p-4 mt-4">
                  <p className="text-sm text-gray-700 text-center">
                    <strong>Instrucción:</strong> Muestra este código al guardia para retirar tu beneficio
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={descargarQRConDatos}
                  variant="outline"
                  className="border-[#008C45] text-[#008C45] hover:bg-[#008C45]/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar QR con Datos
                </Button>
                <Button
                  onClick={() => setCodigoQR('')}
                  variant="outline"
                  className="border-gray-400 text-gray-700 hover:bg-gray-100"
                >
                  Generar Nuevo
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-32 h-32 bg-[#008C45]/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-[#008C45]/40" />
              </div>
              <p className="text-gray-600 mb-6">Genera tu código QR para retiro de beneficios</p>
              <Button
                onClick={generarCodigoQR}
                disabled={generando}
                className="bg-[#D32027] hover:bg-[#D32027]/90 text-white px-8"
              >
                {generando ? 'Generando...' : 'Generar Mi Código QR'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EmployeePanel;
```