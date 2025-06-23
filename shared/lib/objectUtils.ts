import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

export const toCamel = <T = any>(data: any): T =>
  camelcaseKeys(data, { deep: true }) as T;

export const toSnake = (data: any) =>
  snakecaseKeys(data, { deep: true });
