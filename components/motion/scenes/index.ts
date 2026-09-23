import { productsIndex } from "./productsIndex";

// Реестр пин-сцен: data-m="pin" data-m-scene="<имя>". Сцены — единственное
// место со вкусовой хореографией, остальное делают общие раннеры.
export const scenes: Record<string, (el: HTMLElement) => void> = {
  "products-index": productsIndex,
};
