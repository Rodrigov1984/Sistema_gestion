import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { User, Shield, Settings, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';

type Role = 'empleado' | 'guardia' | 'admin';

interface LoginFormProps {
  role: Role;
  onLoginSuccess: (userData?: any) => void;
  onBack: () => void;
}

// Base de datos mock de usuarios
const empleados = {
  '16234567-8': { nombre: 'María Fernanda González', password: '16234567', rol: 'Personal de Base' },
  '18345678-9': { nombre: 'Carlos Alberto Muñoz', password: '18345678', rol: 'Personal de Base' },
  '17456789-0': { nombre: 'Ana María Silva', password: '17456789', rol: 'Oficina' },
};

// Nota: Los guardias de demo ahora se muestran desde el enrolamiento del administrador en localStorage.

export default function LoginForm({ role, onLoginSuccess, onBack }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Preparar listado demo de empleados (dinámico desde localStorage si existe, fallback a mock estático)
  const demoEmpleados = (() => {
    try {
      const stored = localStorage.getItem('empleados');
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list) && list.length > 0) {
          return list.slice(0, 3).map((e: any) => ({
            rut: e.rut,
            password: (e.rut && typeof e.rut === 'string') ? e.rut.split('-')[0] : ''
          }));
        }
      }
    } catch (err) {
      // Silenciar errores de parseo
    }
    // Fallback a mock local si no hay empleados en storage
    return Object.keys(empleados).map(rut => ({
      rut,
      password: rut.split('-')[0]
    }));
  })();

  const getRoleConfig = () => {
    switch (role) {
      case 'empleado':
        return {
          title: 'Portal del Empleado',
          icon: User,
          color: '#D32027',
          usernamePlaceholder: 'Ej: 16234567-8',
          usernameLabel: 'RUT',
        };
      case 'guardia':
        return {
          title: 'Portal del Guardia',
          icon: Shield,
          color: '#008C45',
          usernamePlaceholder: 'Ej: 15123456-7',
          usernameLabel: 'RUT',
        };
      case 'admin':
        return {
          title: 'Portal del Administrador',
          icon: Settings,
          color: '#2C2C2C',
          usernamePlaceholder: 'admin',
          usernameLabel: 'Usuario',
        };
    }
  };

  const config = getRoleConfig();
  const Icon = config.icon;

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (role === 'admin') {
        if (username === 'admin' && password === '123456') {
          onLoginSuccess();
        } else {
          setError('Usuario o contraseña incorrectos');
        }
      } else if (role === 'empleado') {
        const empleado = empleados[username as keyof typeof empleados];
        if (empleado && empleado.password === password) {
          if (empleado.rol === 'Guardia') {
            setError('Los guardias deben usar el portal de guardia');
          } else {
            onLoginSuccess(empleado);
          }
        } else {
          setError('RUT o contraseña incorrectos');
        }
      } else if (role === 'guardia') {
        // Validar guardias enrolados por el administrador desde localStorage
        const guardiasStorage = localStorage.getItem('guardias');
        const guardiasRegistrados = guardiasStorage ? JSON.parse(guardiasStorage) : [];

        const guardiaByUser = guardiasRegistrados.find((g: any) => g.usuario === username);

        if (!guardiaByUser) {
          setError('Guardia no enrolado. Contacte al administrador.');
        } else if (guardiaByUser.password !== password) {
          setError('Contraseña incorrecta.');
        } else if (!guardiaByUser.activo) {
          setError('Tu usuario está inactivo. Contacte al administrador.');
        } else {
          onLoginSuccess(guardiaByUser);
        }
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white shadow-md rounded-xl">
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${config.color}15` }}
          >
            <Icon className="w-10 h-10" style={{ color: config.color }} />
          </div>
          <h1 className="text-2xl font-medium mb-2" style={{ color: config.color }}>
            {config.title}
          </h1>
          <p className="text-gray-600 text-center">Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-gray-700 block mb-2">{config.usernameLabel}</label>
            <Input
              type="text"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              placeholder={config.usernamePlaceholder}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="text-gray-700 block mb-2">Contraseña</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white"
              style={{ backgroundColor: config.color }}
            >
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </Button>
            <Button type="button" onClick={onBack} variant="outline" className="w-full">
              Volver
            </Button>
          </div>
        </form>

        {role !== 'admin' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Instrucciones:</strong>
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Usuario: Tu RUT sin puntos (con guión)</li>
              <li>• Contraseña: Tu RUT sin puntos, sin guión y sin dígito verificador</li>
              <li className="mt-2 text-gray-500">
                Ejemplo: RUT 16234567-8 → Contraseña: 16234567
              </li>
            </ul>
          </div>
        )}

        {role === 'empleado' && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg border-2 border-red-200">
            <p className="text-sm font-bold text-red-800 mb-3">👥 RUTs Demo - Empleados</p>
            <div className="space-y-3">
              {demoEmpleados.map((emp, idx) => (
                <div key={emp.rut + idx} className="bg-white p-3 rounded-lg border-2 border-red-300 shadow-sm">
                  <p className="font-bold text-gray-800 mb-1">Empleado #{idx + 1}</p>
                  <p className="text-sm text-gray-700">
                    <strong>RUT:</strong>{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded text-red-700 font-bold">{emp.rut}</code>
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Contraseña:</strong>{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded text-red-700 font-bold">{emp.password}</code>
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-red-700 mt-3 font-medium">
              ✓ Usa uno de estos RUTs demo o tu RUT real si fuiste cargado en la nómina.
            </p>
          </div>
        )}

        {role === 'admin' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
            <p className="text-sm font-bold text-gray-800 mb-3">🔑 Usuario Demo - Administrador</p>
            <div className="bg-white p-3 rounded-lg border-2 border-gray-400 shadow-sm">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Usuario:</strong>{' '}
                <code className="bg-gray-100 px-2 py-1 rounded text-gray-800 font-bold">admin</code>
              </p>
              <p className="text-sm text-gray-700">
                <strong>Contraseña:</strong>{' '}
                <code className="bg-gray-100 px-2 py-1 rounded text-gray-800 font-bold">123456</code>
              </p>
            </div>
            <p className="text-xs text-gray-600 mt-3 font-medium">
              ✓ Usa estas credenciales para acceder al panel de administración.
            </p>
          </div>
        )}

        {role === 'guardia' && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <p className="text-sm font-bold text-green-800 mb-3">
              👤 Usuarios Demo - Guardias
            </p>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border-2 border-green-300 shadow-sm">
                <p className="font-bold text-gray-800 mb-1">👨 Juan Pérez</p>
                <p className="text-sm text-gray-700">
                  <strong>Usuario:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-green-700 font-bold">15123456-7</code>
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Contraseña:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-green-700 font-bold">15123456</code>
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border-2 border-green-300 shadow-sm">
                <p className="font-bold text-gray-800 mb-1">👨 Pedro González</p>
                <p className="text-sm text-gray-700">
                  <strong>Usuario:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-green-700 font-bold">16234567-8</code>
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Contraseña:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-green-700 font-bold">16234567</code>
                </p>
              </div>
            </div>
            <p className="text-xs text-green-700 mt-3 font-medium">
              ✓ Usuarios configurados por el administrador
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
