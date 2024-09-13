export default interface OffsetPagination<T> {
  items: T[];
  limit: number;
  offset: number;
  total: number;
}
