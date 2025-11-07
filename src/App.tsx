import { useState, useEffect } from 'react';
import { User, Shield, Settings } from 'lucide-react';
import LandingPage from './components/LandingPage';
import LoginForm from './components/LoginForm';
import EmpleadoDashboard from './components/EmpleadoDashboard';
import GuardiaDashboard from './components/GuardiaDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

type Role = 'empleado' | 'guardia' | 'admin' | null;
type View = 'landing' | 'roles' | 'login';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [rutLogin, setRutLogin] = useState<string>('');
  // Estado para login de guardia
  const [guardUser, setGuardUser] = useState<string>('');
  const [guardPass, setGuardPass] = useState<string>('');
  const [guardError, setGuardError] = useState<string>('');

  // Inicializar guardias en localStorage si no existen
  useEffect(() => {
    const guardiasStorage = localStorage.getItem('guardias');
    if (!guardiasStorage) {
      const guardiasIniciales = [
        {
          id: 1,
          nombre: 'Juan Pérez',
          rut: '15123456-7',
          usuario: '15123456-7',
          password: '15123456',
          activo: true,
          fechaCreacion: new Date().toLocaleDateString('es-CL'),
        },
        {
          id: 2,
          nombre: 'Pedro González',
          rut: '16234567-8',
          usuario: '16234567-8',
          password: '16234567',
          activo: true,
          fechaCreacion: new Date().toLocaleDateString('es-CL'),
        },
      ];
      localStorage.setItem('guardias', JSON.stringify(guardiasIniciales));
    }
  }, []);

  // Show landing page
  if (currentView === 'landing') {
    return <LandingPage onNavigateToBeneficios={() => setCurrentView('roles')} />;
  }

  // Login solo por RUT para Empleado
  if (currentView === 'login' && selectedRole === 'empleado' && !isAuthenticated) {
    const normalizeRut = (r: string) => (r || '').toString().replace(/[.\-]/g, '').toUpperCase();

    const handleEmpleadoLogin = () => {
      let lista: any[] = [];
      try {
        lista = JSON.parse(localStorage.getItem('empleados') || '[]');
      } catch {
        lista = [];
      }
      if (!rutLogin.trim()) {
        alert('Ingrese su RUT.');
        return;
      }
      const rutInputNorm = normalizeRut(rutLogin);
      const registro = lista.find((e) => normalizeRut(e.rut) === rutInputNorm);

      if (!registro) {
        alert('RUT no encontrado en la nómina cargada. Contacte al administrador.');
        return;
      }

      setIsAuthenticated(true);
      setUserData(registro);
    };

    // Preparar RUTs demo a mostrar bajo la nota
    const demoRuts: { rut: string; password: string }[] = (() => {
      try {
        const raw = localStorage.getItem('empleados');
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list) && list.length > 0) {
            return list.slice(0, 3).map((e: any) => ({
              rut: e.rut,
              password: typeof e.rut === 'string' ? e.rut.split('-')[0].replace(/\./g, '') : ''
            }));
          }
        }
      } catch {}
      // Fallback si no hay nómina cargada
      return [
        { rut: '16.234.567-8', password: '16234567' },
        { rut: '18.345.678-9', password: '18345678' },
        { rut: '17.456.789-0', password: '17456789' },
      ];
    })();

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-[#D32027] mb-2">Acceso Empleado</h1>
            <p className="text-gray-600">Ingresa tu RUT para ver tu información y generar tu código QR</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="text-gray-600 block mb-2">RUT</label>
            <Input
              type="text"
              placeholder="Ej: 16.234.567-8"
              value={rutLogin}
              onChange={(e) => setRutLogin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEmpleadoLogin()}
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={handleEmpleadoLogin} className="bg-[#D32027] hover:bg-[#D32027]/90 text-white flex-1">
                Ingresar
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRutLogin('');
                  setCurrentView('roles');
                  setSelectedRole(null);
                }}
                className="flex-1"
              >
                ← Volver
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Nota: El RUT debe existir en la nómina cargada por el Administrador.
            </p>
            {/* RUTs Demo para pruebas */}
            <div className="mt-4 p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <p className="text-sm font-bold text-red-800 mb-3">👥 RUTs Demo - Empleados</p>
              <div className="space-y-3">
                {demoRuts.map((d, i) => (
                  <div key={d.rut + i} className="bg-white p-3 rounded-lg border-2 border-red-300 shadow-sm">
                    <p className="font-bold text-gray-800 mb-1">Empleado #{i + 1}</p>
                    <p className="text-sm text-gray-700">
                      <strong>RUT:</strong>{' '}
                      <code className="bg-gray-100 px-2 py-1 rounded text-red-700 font-bold">{d.rut}</code>
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Contraseña:</strong>{' '}
                      <code className="bg-gray-100 px-2 py-1 rounded text-red-700 font-bold">{d.password}</code>
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-red-700 mt-3 font-medium">
                ✓ Usa uno de estos RUTs demo o tu RUT real si fuiste cargado en la nómina.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login dedicado para Guardia (usuario + contraseña, validados contra Gestión de Guardias)
  if (currentView === 'login' && selectedRole === 'guardia' && !isAuthenticated) {
    const normalizeUser = (s: string) => (s || '').toString().replace(/\./g, '').trim();
    const sameUser = (a: string, b: string) =>
      normalizeUser(a) === normalizeUser(b) ||
      normalizeUser(a).replace(/-/g, '') === normalizeUser(b).replace(/-/g, '');

    const handleGuardLogin = () => {
      setGuardError('');
      let guardias: any[] = [];
      try {
        guardias = JSON.parse(localStorage.getItem('guardias') || '[]');
      } catch {
        guardias = [];
      }

      if (!guardUser.trim() || !guardPass.trim()) {
        setGuardError('Ingrese usuario (RUT) y contraseña.');
        return;
      }

      const registro = guardias.find(
        (g) => sameUser(g.usuario, guardUser) || sameUser(g.rut, guardUser)
      );

      if (!registro) {
        setGuardError('Guardia no enrolado. Contacte al administrador.');
        return;
      }
      if (!registro.activo) {
        setGuardError('Usuario de guardia inactivo. Contacte al administrador.');
        return;
      }

      if (registro.password !== guardPass.trim()) {
        setGuardError('Contraseña incorrecta.');
        return;
      }

      setIsAuthenticated(true);
      setUserData(registro);
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-[#008C45] mb-2">Acceso Guardia</h1>
            <p className="text-gray-600">Ingrese sus credenciales de Gestión de Guardias</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
            <div>
              <label className="text-gray-600 block mb-2">Usuario (RUT)</label>
              <Input
                type="text"
                placeholder="Ej: 15123456-7"
                value={guardUser}
                onChange={(e) => setGuardUser(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGuardLogin()}
              />
            </div>
            <div>
              <label className="text-gray-600 block mb-2">Contraseña</label>
              <Input
                type="password"
                placeholder="Contraseña"
                value={guardPass}
                onChange={(e) => setGuardPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGuardLogin()}
              />
            </div>

            {guardError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
                {guardError}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button onClick={handleGuardLogin} className="bg-[#008C45] hover:bg-[#008C45]/90 text-white flex-1">
                Iniciar Sesión
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setGuardUser('');
                  setGuardPass('');
                  setGuardError('');
                  setCurrentView('roles');
                  setSelectedRole(null);
                }}
                className="flex-1"
              >
                Volver
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Formato sugerido: Usuario = RUT sin puntos (con guión). La contraseña es la configurada en Gestión de Guardias.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show login form (se mantiene para admin; empleado/guardia ya tienen flujos dedicados)
  if (currentView === 'login' && selectedRole && !isAuthenticated) {
    return (
      <LoginForm
        role={selectedRole}
        onLoginSuccess={(data) => {
          // Solo Admin aquí; los otros roles ya se manejan arriba
          setIsAuthenticated(true);
          setUserData(data);
        }}
        onBack={() => {
          setCurrentView('roles');
          setSelectedRole(null);
        }}
      />
    );
  }

  // Show role-specific dashboards after authentication
  if (isAuthenticated && selectedRole === 'empleado') {
    return (
      <EmpleadoDashboard
        onBack={() => {
          setIsAuthenticated(false);
          setSelectedRole(null);
          setUserData(null);
          setCurrentView('roles');
        }}
        empleado={userData} // pasar registro real de la nómina
      />
    );
  }

  if (isAuthenticated && selectedRole === 'guardia') {
    return (
      <GuardiaDashboard
        guardia={userData} // pasar guardia autenticado
        onBack={() => {
          setIsAuthenticated(false);
          setSelectedRole(null);
          setUserData(null);
          setCurrentView('roles');
        }}
      />
    );
  }

  if (isAuthenticated && selectedRole === 'admin') {
    return (
      <AdminDashboard
        onBack={() => {
          setIsAuthenticated(false);
          setSelectedRole(null);
          setUserData(null);
          setCurrentView('roles');
        }}
      />
    );
  }

  // Show role selection
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[#D32027] mb-2">Sistema de Gestión de Beneficios</h1>
          <p className="text-gray-600">Tresmontes Lucchetti</p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-[#D32027] mb-6 text-center">Seleccione su Rol</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Empleado Card */}
            <button
              onClick={() => {
                setSelectedRole('empleado');
                setCurrentView('login');
              }}
              className="group relative bg-white border-2 border-[#E5E5E5] rounded-xl p-8 hover:border-[#D32027] hover:shadow-lg transition-all duration-300 flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-[#D32027]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#D32027]/20 transition-colors">
                <User className="w-10 h-10 text-[#D32027]" />
              </div>
              <h3 className="text-[#D32027] mb-2">Usuario/Empleado</h3>
              <p className="text-gray-600 text-center">
                Consulta tus datos y genera tu código QR
              </p>
            </button>

            {/* Guardia Card */}
            <button
              onClick={() => {
                setSelectedRole('guardia');
                setCurrentView('login');
              }}
              className="group relative bg-white border-2 border-[#E5E5E5] rounded-xl p-8 hover:border-[#008C45] hover:shadow-lg transition-all duration-300 flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-[#008C45]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#008C45]/20 transition-colors">
                <Shield className="w-10 h-10 text-[#008C45]" />
              </div>
              <h3 className="text-[#008C45] mb-2">Guardia</h3>
              <p className="text-gray-600 text-center">
                Valida y registra la entrega de beneficios
              </p>
            </button>

            {/* Admin Card */}
            <button
              onClick={() => {
                setSelectedRole('admin');
                setCurrentView('login');
              }}
              className="group relative bg-white border-2 border-[#E5E5E5] rounded-xl p-8 hover:border-[#D32027] hover:shadow-lg transition-all duration-300 flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                <Settings className="w-10 h-10 text-gray-700" />
              </div>
              <h3 className="text-gray-900 mb-2">Administrador</h3>
              <p className="text-gray-600 text-center">
                Gestiona empleados y beneficios
              </p>
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => setCurrentView('landing')}
            className="text-[#D32027] hover:underline"
          >
            ← Volver a la página principal
          </button>
        </div>
      </div>
    </div>
  );
}
