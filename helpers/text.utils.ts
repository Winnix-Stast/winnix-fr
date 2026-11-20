/**
 * Utilidades de formateo y normalización de texto para Winnix.
 */

/**
 * Convierte un texto a Capitalize / Title Case (ej: "sebas capitan" -> "Sebas Capitan").
 * Normaliza nombres, apellidos y apodos asegurando mayúscula inicial en cada término.
 */
export const toTitleCase = (str?: string | null): string => {
  if (!str || typeof str !== 'string') return '';
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
