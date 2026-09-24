import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProduct } from "@/lib/products";
import { Accordion, Crosshair } from "@/components/kalka/Interactive";
import { Rulers } from "@/components/kalka/Rulers";
import { SITE_URL } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";
import { steps, examples, included, forWhom, notFor } from "./content";
import { ProgramView, ProgramButtons } from "./ProgramClient";
import { ProgramMotion, TiltCard } from "./ProgramMotion";
import "../products-kalka.css";
import "./program.css";
import "./program-kalka.css";

const product = getProduct("personal-program")!;
const url = `${SITE_URL}/products/personal-program`;

export const metadata: Metadata = {
  title: "Личная программа по Claude и Codex — 6 недель",
  description: product.tagline,
  alternates: { canonical: url },
  openGraph: { title: product.title, description: product.tagline, type: "website", url, locale: "ru_RU", images: [{ url: "/program-cover.webp", width: 1440, height: 810 }] },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${url}#offer`,
  name: product.title,
  description: product.tagline,
  url,
  inLanguage: "ru",
  provider: { "@id": `${SITE_URL}/#business` },
  serviceType: "консультация",
  areaServed: "Worldwide",
  offers: {
    "@type": "Offer",
    url,
    price: product.price,
    priceCurrency: "RUB",
    availability: "https://schema.org/InStock",
    seller: { "@id": `${SITE_URL}/#business` },
  },
};

const H2 =
  "font-heading mt-5 max-w-3xl text-balance text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-5xl";

const faqItems = (product.faq ?? []).map((f) => ({ title: f.q, body: f.a }));

export default function PersonalProgramPage() {
  return (
    <div className="k-page">
      <Crosshair />
      <ProgramView product={product} />
      <ProgramMotion />

      <main className="program-page">
        <section className="relative min-h-[min(92vh,900px)] overflow-hidden border-b border-[#15161a]">
          <Rulers />
          <div className="relative z-[2] mx-auto max-w-7xl px-5 pb-20 pl-10 pt-24 md:px-14 md:pt-28">
            <nav aria-label="Хлебные крошки" data-hero>
              <Link href="/products" className="k-mono -my-3 inline-block bg-white py-3 pr-2 hover:!text-[#15161a]">
                &larr; Все форматы
              </Link>
            </nav>

            <div className="program-hero-grid pt-10 md:pt-16">
              <header>
                <p className="k-mono !text-[#15161a]" data-hero>
                  Личная работа · 6 недель · 1:1
                </p>
                <h1
                  className="font-heading mt-6 max-w-[16ch] text-balance text-[38px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[48px] lg:text-[64px]"
                >
                  <span className="program-h1-line" data-hero>Claude и Codex.</span>
                  <span className="program-h1-line" data-hero>Две твои задачи.</span>
                  <span className="program-h1-line" data-hero>
                    <span className="program-h1-mark">Делаешь сам.</span>
                  </span>
                </h1>
                <p className="mt-6 max-w-lg bg-white/85 py-1 text-[17px] leading-[1.6] text-[#6b6e78] md:text-[18px]" data-hero>
                  За 6 недель встроишь Claude и Codex в две свои рабочие задачи. На твоих материалах.
                  С практикой, проверкой и поддержкой между встречами.
                </p>
                <div className="mt-8" data-hero>
                  <ProgramButtons product={product} position="hero" />
                </div>
                <p className="program-caption" data-hero>
                  Не уверен, подходит ли программа? Напиши в Telegram, разберём твои задачи до оплаты.
                </p>
              </header>
              <TiltCard className="program-hero-note">
                <div className="program-note-top"><span>Формат 1:1</span><span>6 встреч</span></div>
                <div className="program-note-title">Твой маршрут<br />на 6 недель</div>
                <ol className="program-note-flow">
                  <li><span>01</span><div>Собираем вместе<small>На твоих задачах и материалах</small></div></li>
                  <li><span>02</span><div>Ты повторяешь<small>На новом примере между встречами</small></div></li>
                  <li><span>03</span><div>Проверяем результат<small>Разбираем ошибки и закрепляем</small></div></li>
                </ol>
                <div className="program-note-bottom"><strong>{product.priceLabel}</strong><span>за всю программу<br />оплата до старта</span></div>
              </TiltCard>
            </div>

            <div className="rz-facts program-facts mt-16">
              <div><strong>6 × 60</strong><p>минут личных встреч</p></div>
              <div><strong>2</strong><p>процесса на твоих материалах</p></div>
              <div><strong>24 ч</strong><p>ответ в Telegram между встречами</p></div>
              <div><strong>6</strong><p>записей и саммари, по одной на встречу</p></div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
              <div>
                <p className="k-mono inline-block bg-white pr-2">Знакомая ситуация</p>
                <h2 data-m="lines" className="k-h3 mt-5">Новый чат. И опять всё сначала.</h2>
              </div>
              <div data-m="reveal" className="space-y-4 text-[16px] leading-relaxed text-[#6b6e78]">
                <p>Открываешь Claude и опять объясняешь, кто ты. Копируешь чужой промпт. Получаешь общий ответ, немного правишь и на следующий день начинаешь заново.</p>
                <p>Статистика Instagram лежит отдельно. Черновики отдельно. Идеи отдельно. Claude ничего об этом не знает, пока ты снова не перескажешь всё руками.</p>
                <p>В 9 из 16 диалогов о консультациях люди просили одного: научить их самих. Поэтому после каждой встречи ты пробуешь повторить процесс, а я разбираю твою попытку.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">Две задачи, которые повторяются</p>
            <h2 data-m="lines" className={H2}>Выберем их до старта и пройдём путь до результата</h2>
            <p data-m="reveal" data-m-delay="0.15" className="mt-4 max-w-2xl bg-white/85 text-[16px] leading-relaxed text-[#6b6e78]">
              Пройдём путь от исходных материалов до результата и проверим, что ты можешь повторить его без меня.
            </p>
            <div data-m="stagger" className="program-examples mt-14 grid">
              {examples.map(([category, from, to]) => (
                <div key={category} data-m-item>
                  <span className="k-mono !text-[#15161a]">{category}</span>
                  <h3 className="text-2xl">{from}</h3>
                  <span className="program-arrow" aria-hidden="true">↓</span>
                  <p>{to}</p>
                </div>
              ))}
            </div>
            <p className="program-caption mt-6">Это примеры. В программу возьмём две твои задачи и заранее определим, как будем проверять результат.</p>
          </div>
        </section>

        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
              <div>
                <p className="k-mono inline-block bg-white pr-2">Работа между встречами</p>
                <h2 data-m="lines" className="k-h3 mt-5">Созвон закончился. Работа продолжается.</h2>
              </div>
              <div data-m="reveal" className="space-y-4 text-[16px] leading-relaxed text-[#6b6e78]">
                <p>Ты повторяешь действия на новых материалах и присылаешь попытку. Я проверяю результат и помогаю исправить ошибки.</p>
                <p>Если что-то ломается во вторник, пишешь в Telegram. Я отвечаю в течение 24 часов.</p>
                <p>В {product.priceLabel} входят диагностика до старта, маршрут на 6 недель, проверка практики, поддержка и материалы по двум процессам.</p>
                <p><Link className="underline underline-offset-4" href="/products/consultation">Нужен один разбор? Есть консультация за 3 850 ₽</Link></p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <div className="program-video-grid grid">
              <div className="program-video-placeholder text-white">
                <span className="k-mono !text-white/50">Видео о программе · скоро</span>
                <p className="text-3xl md:text-4xl">Как мы будем работать вместе</p>
                <span className="program-caption !text-white/50">Здесь появится видео Влада. Пока весь маршрут ниже.</span>
              </div>
              <div>
                <p className="k-mono inline-block bg-white pr-2">Перед первой встречей</p>
                <h2 className="font-heading mt-5 text-2xl font-bold tracking-[-0.02em] md:text-3xl">Начнём с твоей ситуации.</h2>
                <div className="program-copy-plain space-y-3 text-[16px] leading-relaxed text-[#6b6e78]">
                  <p>До первой встречи обсудим задачи в Telegram и подготовим доступ к Claude и Codex.</p>
                  <p>Первые 60 минут не уйдут на регистрацию аккаунтов.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">Маршрут</p>
            <h2 data-m="lines" className={H2}>От первой попытки к самостоятельной работе</h2>
            <p data-m="reveal" data-m-delay="0.15" className="mt-4 max-w-2xl bg-white/85 text-[16px] leading-relaxed text-[#6b6e78]">
              6 встреч по 60 минут. Между ними твоя практика и моя обратная связь.
            </p>
            <ol className="rz-tl program-timeline mt-12" data-m="stagger">
              {steps.map(([title, text], i) => (
                <li key={title} className="rz-tl-row grid gap-2 md:grid-cols-[90px_360px_1fr] md:items-baseline" data-m-item>
                  <span className="rz-tl-year">0{i + 1}</span>
                  <h3 className="text-xl">{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className="k-h3">Кому подойдёт</h2>
                <ul className="rz-list mt-6" data-m="stagger">{forWhom.map((t) => <li key={t} data-m-item>{t}</li>)}</ul>
              </div>
              <div>
                <h2 className="k-h3">Границы формата</h2>
                <ul className="rz-list mt-6" data-m="stagger">{notFor.map((t) => <li key={t} data-m-item>{t}</li>)}</ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
              <div className="program-portrait" data-m="reveal">
                <Image src="/portrait-editorial.jpg" width={1012} height={1350} alt="Влад Лямин" sizes="(max-width: 900px) 90vw, 560px" />
              </div>
              <div>
                <p className="k-mono inline-block bg-white pr-2">Кто будет рядом</p>
                <h2 data-m="lines" className={H2}>Я сам работаю так каждый день.</h2>
                <p className="rz-thesis">«Это были самые продуктивные 60 минут за последнюю неделю».</p>
                <p className="program-cite">Клиент после разовой консультации, имя скрыто</p>
                <div className="program-copy-plain space-y-3 text-[16px] leading-relaxed text-[#6b6e78]">
                  <p>Четвёртый год я работаю с Claude каждый день. На нём лежат мой контент, исследования, клиентские проекты и часть операционки.</p>
                  <p>Я сам собирал плохие настройки. Недавно нашёл семь подключённых сервисов, которые съедали 67 300 токенов до первого сообщения.</p>
                  <p>Рабочий пример на созвоне ещё не доказывает, что ты сможешь повторить его завтра. Поэтому на программе я проверяю самостоятельные попытки.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">Что входит</p>
            <h2 data-m="lines" className={H2}>Подписки на Claude, Codex и сторонние сервисы — отдельно</h2>
            <ul className="rz-list rz-list--cols mt-12" data-m="stagger">
              {included.map((t) => <li key={t} data-m-item>{t}</li>)}
            </ul>
          </div>
        </section>

        <section className="border-b border-[#15161a]">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-14 md:py-28">
            <p className="k-mono inline-block bg-white pr-2">Вопросы</p>
            <h2 data-m="lines" className={H2}>Оплата, границы формата и что будет, если нужна одна встреча</h2>
            <div data-m="stagger" className="mt-12">
              <Accordion items={faqItems} />
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-14 md:py-32">
            <div data-m="reveal" className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-end">
              <div>
                <p className="k-mono !text-[#15161a]">Личная работа · 6 недель · 1:1</p>
                <h2 className="k-h2 mt-4">{product.title}</h2>
              </div>
              <div className="pk-buy-sheet">
                <p className="pk-price">{product.priceLabel}</p>
                <ProgramButtons product={product} position="final" />
                <small>Оплата онлайн на lava.top, чек приходит на почту. Полная оплата до первой встречи.</small>
              </div>
            </div>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    </div>
  );
}
