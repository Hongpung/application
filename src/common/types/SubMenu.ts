export interface SubMenu<T> {
  name: string;
  link:  keyof T;
} 