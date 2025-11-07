```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const GuardPanel: React.FC = () => {
  const navigate = useNavigate();

  const handleVolver = () => {
    // Regresa a la pantalla de selección de paneles (con las 3 tarjetas)
    navigate('/beneficios-empleados', { replace: true });
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Guardia</h1>
        <button
          onClick={handleVolver}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Volver
        </button>
      </div>
      {/* ...existing code... */}
    </div>
  );
};

export default GuardPanel;
```