import type { Metadata } from "next";
import Link from "next/link";
import { getProduct, TELEGRAM_URL } from "@/lib/products";
import { ThanksClient } from "./ThanksClient";

export const metadata: Metadata = {
  title: "Оплата прошла",
  robots: { index: false, follow: false },
};

// Адрес возврата после оплаты на lava.top. Сюда же lava дописывает свои
// invoiceId и status.
export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

  const productId = one(sp.product);
  const product = getProduct(productId);
  const status = one(sp.status);
  const failed = Boolean(status) && status !== "success";

  return (
    <main className="rz">
      <ThanksClient product={productId} clickId={one(sp.cid)} status={status} />
      <section className="rz-section">
        <div className="rz-wrap" style={{ maxWidth: 720 }}>
          <p className="rz-mono">{failed ? "Оплата не прошла" : "Оплата прошла"}</p>
          <h1 className="rz-h1" style={{ marginBottom: 24 }}>
            {failed ? (
              <>Платёж не завершился</>
            ) : (
              <>
                Спасибо. <span className="rz-mark">{product?.title ?? "Заказ"}</span> оплачен
              </>
            )}
          </h1>

          {failed ? (
            <p className="rz-lead">
              Деньги не списались. Попробуй ещё раз или напиши мне, разберёмся вручную.
            </p>
          ) : (
            <p className="rz-lead">
              Чек и доступ ушли на почту, которую ты указал. Если письма нет через
              десять минут, проверь спам и напиши мне — отправлю руками.
            </p>
          )}

          <p style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
            {failed && productId && (
              <Link href={`/products/${productId}`} className="rz-btn rz-btn--solid">
                Вернуться к оплате
              </Link>
            )}
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="rz-btn">
              Написать мне в Telegram
            </a>
            <Link href="/products" className="rz-btn">
              Все продукты
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
