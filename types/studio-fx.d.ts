// Идентификатор страховочного таймера, который вооружает скрытие контента.
// Ставится инлайн-скриптом в <head>, отменяется StudioFx при монтировании.
declare global {
  interface Window {
    __studioFxSafety?: number;
  }
}

export {};
