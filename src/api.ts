
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 15000,
});

// Adjunta el token a cada petición si existe una sesión iniciada.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wip_token');

  if (token) {
    config.headers.set('Authorization', `Token ${token}`);
  }

  return config;
});

export type Product = {
  id: number;
  id_producto: string;
  descripcion_referencia: string;
  activo: boolean;
  ultimo_detalle?: string;
};

export type Movement = {
  id: number;
  fecha: string;
  tipo_movimiento: 'INGRESO' | 'SALIDA' | 'TRASPASO';
  id_producto?: string;
  producto_id: string;
  descripcion_referencia: string;
  detalle_producto: string;
  cantidad_kg: string;
  ufe: string;
  scrap_kg: string;
  area_origen: string;
  area_destino: string;
  area_posterior: string;
  entregado_por: string;
  recibido_por: string;
  referencia_ht: string;
  observaciones: string;
  costo_bs_kg: string | null;
  ufe_calculada: string;
  movimiento_almacen: string;
  costo_total_bs: string | null;
};

export type Page<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export function errorMessage(e: unknown): string {
  if (axios.isAxiosError(e)) {
    const d = e.response?.data;

    if (typeof d?.detail === 'string') return d.detail;

    if (d && typeof d === 'object') {
      return Object.entries(d)
        .map(([k, v]) =>
          `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`
        )
        .join(' · ');
    }

    return e.message || 'No se pudo conectar con el servidor.';
  }

  return 'Ocurrió un error inesperado.';
}
