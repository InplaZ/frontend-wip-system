
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
  movimientos_count?: number;
  cot_ref?: string;
  cantidad_solicitada_kg?: string | null;
  cantidad_solicitada_unidades?: number | null;
  fecha_entrega?: string | null;
  valor_pedido_bs?: string | null;
  codigo_producto_homologado?: string;
};

export type Movement = {
  id: number;
  fecha: string;
  duracion_minutos?: number | null;
  creado_en?: string;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  criticidad?: string;
  tipo_movimiento: 'INGRESO' | 'SALIDA' | 'TRASPASO';
  id_producto?: string;
  producto_id: string;
  descripcion_referencia: string;
  pedido?: Product;
  detalle_producto: string;
  registrado_por?: string;
  registrado_por_usuario?: number | null;
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
  usuario_destino?: string;
  destinatario_id?: number;
  estado_recepcion?: string;
  respuesta_recepcion?: string;
  respondido_por?: string | null;
  fecha_respuesta?: string | null;
  codigo_talonario?: string;
  codigo_producto_homologado?: string;
  cot_ref?: string;
  evidencias?: { nombre: string; mime: string; datos: string }[];
};

export type RecipientUser = { id: number; username: string; nombre: string; grupos: string[] };
export type NotificationItem = {
  id: number;
  tipo: 'MOVIMIENTO_RECIBIDO' | 'RESPUESTA_MOVIMIENTO' | 'MOVIMIENTO_REABIERTO';
  titulo: string;
  mensaje: string;
  creado_en: string;
  fecha_lectura: string | null;
  no_leida: boolean;
  movimiento: number;
  movimiento_detalle: Movement;
  respuesta_detalle: { id: number; accion: string; usuario: number | null; nombre_usuario: string; comentario: string; creado_en: string } | null;
  historial_respuestas: { id: number; accion: string; usuario: number | null; nombre_usuario: string; comentario: string; creado_en: string }[];
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
