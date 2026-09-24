"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Считает оплату на стороне браузера. Дублирует вебхук намеренно: вебхук
 * точнее, но он серверный, и в Метрику цель оттуда не поставить — у неё
 * конверсия привязана к визиту. Поэтому число оплат в Метрике берётся
 * отсюда, а сверка и деньги — из вебхука.
 *
 * Параметр status в адресе подделывается руками, поэтому по нему нельзя
 * выдавать доступ. Для счётчика этого достаточно.
 */
export function ThanksClient({
  product,
  clickId,
  status,
}: {
  product: string;
  clickId: string;
  status: string;
}) {
  useEffect(() => {
    if (status && status !== "success") {
      track("purchase_return_failed", { product, click_id: clickId, status });
      return;
    }
    track("purchase", { product, click_id: clickId, source: "return_url" });
  }, [product, clickId, status]);

  return null;
}
