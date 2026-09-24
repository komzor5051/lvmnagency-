import { NextResponse } from "next/server";
import { createInvoice, lavaOfferId, type ClientUtm } from "@/lib/lava";
import { getProduct } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://vladlyamin.ru";

function str(v: unknown, max = 200): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Создаёт счёт в lava.top и отдаёт ссылку на оплату.
 *
 * Возвращает 200 с fallbackUrl, если счёт создать не удалось: продажу нельзя
 * терять из-за того, что сломалась аналитика. Фронт в этом случае уводит
 * человека на прямую ссылку продукта, оплата пройдёт без атрибуции.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const productId = str(b.product, 64);
  const email = str(b.email, 200).toLowerCase();
  const product = getProduct(productId);

  if (!product) {
    return NextResponse.json({ ok: false, error: "unknown_product" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const fallbackUrl =
    product.buy.kind === "lava" && product.buy.url ? product.buy.url : "";
  const offerId = lavaOfferId(productId);
  if (!offerId) {
    return NextResponse.json({ ok: true, paymentUrl: null, fallbackUrl });
  }

  const rawUtm = (b.utm ?? {}) as Record<string, unknown>;
  const clientUtm: ClientUtm = {
    utm_source: str(rawUtm.utm_source, 120),
    utm_medium: str(rawUtm.utm_medium, 120),
    utm_campaign: str(rawUtm.utm_campaign, 120),
    utm_term: str(rawUtm.utm_term, 120),
    utm_content: str(rawUtm.utm_content, 120),
  };

  const clickId = clientUtm.utm_term || "";
  const successUrl =
    `${SITE}/thanks?product=${encodeURIComponent(productId)}` +
    (clickId ? `&cid=${encodeURIComponent(clickId)}` : "");

  try {
    const invoice = await createInvoice({
      offerId,
      email,
      clientUtm,
      successUrl,
      failureUrl: `${SITE}/products/${productId}?pay=failed`,
    });
    if (!invoice.paymentUrl) throw new Error("empty paymentUrl");
    return NextResponse.json({
      ok: true,
      paymentUrl: invoice.paymentUrl,
      contractId: invoice.id,
      fallbackUrl,
    });
  } catch (e) {
    console.error("[checkout] lava invoice failed", e);
    return NextResponse.json({ ok: true, paymentUrl: null, fallbackUrl });
  }
}
