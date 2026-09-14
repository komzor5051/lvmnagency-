import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProduct } from "@/lib/products";
import { RzFaq } from "@/components/rz/RzFaq";
import { SITE_URL } from "@/lib/site";
import { jsonLd } from "@/lib/json-ld";
import { steps, examples, included, forWhom, notFor } from "./content";
import { ProgramView, ProgramButtons } from "./ProgramClient";
import { ProgramMotion, TiltCard } from "./ProgramMotion";
import "./program.css";

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

export default function PersonalProgramPage() {
  return (
    <main className="rz rz-product program-page">
      <ProgramView product={product} />
      <ProgramMotion />

      <section className="rz-product-hero">
        <div className="rz-wrap">
          <nav aria-label="Хлебные крошки" className="rz-crumb" data-hero>
            <Link href="/products" className="rz-link">← Все форматы</Link>
          </nav>
          <div className="program-hero-grid">
            <header>
              <p className="rz-mono" data-hero>Личная работа · 6 недель · 1:1</p>
              <h1 className="rz-h1 rz-product-title">
                <span className="program-h1-line" data-hero>Claude и Codex.</span>
                <span className="program-h1-line" data-hero>Две твои задачи.</span>
                <span className="program-h1-line" data-hero><span className="program-h1-mark">Делаешь сам.</span></span>
              </h1>
              <p className="rz-lead" data-hero>
                За 6 недель встроишь Claude и Codex в две свои рабочие задачи. На твоих материалах.
                С практикой, проверкой и поддержкой между встречами.
              </p>
              <div data-hero><ProgramButtons product={product} position="hero" /></div>
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
          <div className="rz-facts program-facts">
            <div><strong>6 × 60</strong><p>минут личных встреч</p></div>
            <div><strong>2</strong><p>процесса на твоих материалах</p></div>
            <div><strong>24 ч</strong><p>ответ в Telegram между встречами</p></div>
            <div><strong>6</strong><p>записей и саммари, по одной на встречу</p></div>
          </div>
        </div>
      </section>

      <section className="rz-section">
        <div className="rz-wrap rz-two">
          <div data-reveal>
            <p className="rz-mono program-eyebrow">Знакомая ситуация</p>
            <h2 className="rz-h2">Новый чат. И опять всё сначала.</h2>
          </div>
          <div className="rz-copy" data-reveal>
            <p>Открываешь Claude и опять объясняешь, кто ты. Копируешь чужой промпт. Получаешь общий ответ, немного правишь и на следующий день начинаешь заново.</p>
            <p>Статистика Instagram лежит отдельно. Черновики отдельно. Идеи отдельно. Claude ничего об этом не знает, пока ты снова не перескажешь всё руками.</p>
            <p>В 9 из 16 диалогов о консультациях люди просили одного: научить их самих. Поэтому после каждой встречи ты пробуешь повторить процесс, а я разбираю твою попытку.</p>
          </div>
        </div>
      </section>

      <section className="rz-section">
        <div className="rz-wrap">
          <div className="rz-sec-head" data-reveal>
            <h2 className="rz-h2">Две задачи, которые повторяются</h2>
            <p>Выберем их до старта. Пройдём путь от исходных материалов до результата и проверим, что ты можешь повторить его без меня.</p>
          </div>
          <div className="rz-pick program-examples" data-stagger>
            {examples.map(([category, from, to]) => (
              <div key={category} data-reveal>
                <span className="rz-mono">{category}</span>
                <h3>{from}</h3>
                <span className="program-arrow" aria-hidden="true">↓</span>
                <p>{to}</p>
              </div>
            ))}
          </div>
          <p className="program-caption" data-reveal>Это примеры. В программу возьмём две твои задачи и заранее определим, как будем проверять результат.</p>
        </div>
      </section>

      <section className="rz-section">
        <div className="rz-wrap rz-two">
          <div data-reveal>
            <p className="rz-mono program-eyebrow">Работа между встречами</p>
            <h2 className="rz-h2">Созвон закончился. Работа продолжается.</h2>
          </div>
          <div className="rz-copy" data-reveal>
            <p>Ты повторяешь действия на новых материалах и присылаешь попытку. Я проверяю результат и помогаю исправить ошибки.</p>
            <p>Если что-то ломается во вторник, пишешь в Telegram. Я отвечаю в течение 24 часов.</p>
            <p>В {product.priceLabel} входят диагностика до старта, маршрут на 6 недель, проверка практики, поддержка и материалы по двум процессам.</p>
            <p><Link className="rz-link" href="/products/consultation">Нужен один разбор? Есть консультация за 3 850 ₽</Link></p>
          </div>
        </div>
      </section>

      <section className="rz-section">
        <div className="rz-wrap program-video-grid">
          <div className="program-video-placeholder" data-reveal>
            <span className="rz-mono">Видео о программе · скоро</span>
            <p>Как мы будем работать вместе</p>
            <span className="program-caption">Здесь появится видео Влада. Пока весь маршрут ниже.</span>
          </div>
          <div data-reveal>
            <p className="rz-mono program-eyebrow">Перед первой встречей</p>
            <h2 className="rz-h2 rz-h2--sm">Начнём с твоей ситуации.</h2>
            <div className="rz-copy program-copy-plain">
              <p>До первой встречи обсудим задачи в Telegram и подготовим доступ к Claude и Codex.</p>
              <p>Первые 60 минут не уйдут на регистрацию аккаунтов.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rz-section">
        <div className="rz-wrap">
          <div className="rz-sec-head" data-reveal>
            <h2 className="rz-h2">От первой попытки к самостоятельной работе</h2>
            <p>6 встреч по 60 минут. Между ними твоя практика и моя обратная связь.</p>
          </div>
          <ol className="rz-tl program-timeline" data-stagger>
            {steps.map(([title, text], i) => (
              <li key={title} className="rz-tl-row" data-reveal>
                <span className="rz-tl-year">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="rz-section">
        <div className="rz-wrap rz-two">
          <div data-reveal>
            <h2 className="rz-h2 rz-h2--sm">Кому подойдёт</h2>
            <ul className="rz-list">{forWhom.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div data-reveal>
            <h2 className="rz-h2 rz-h2--sm">Границы формата</h2>
            <ul className="rz-list">{notFor.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="rz-section rz-about">
        <div className="rz-wrap rz-about-grid">
          <div className="rz-portrait program-portrait" data-reveal>
            <Image src="/portrait-editorial.jpg" width={1012} height={1350} alt="Влад Лямин" sizes="(max-width: 900px) 90vw, 560px" />
          </div>
          <div data-reveal>
            <p className="rz-mono">Кто будет рядом</p>
            <h2 className="rz-h2">Я сам работаю так каждый день.</h2>
            <p className="rz-thesis">«Это были самые продуктивные 60 минут за последнюю неделю».</p>
            <p className="program-cite">Клиент после разовой консультации, имя скрыто</p>
            <div className="rz-copy program-copy-plain">
              <p>Четвёртый год я работаю с Claude каждый день. На нём лежат мой контент, исследования, клиентские проекты и часть операционки.</p>
              <p>Я сам собирал плохие настройки. Недавно нашёл семь подключённых сервисов, которые съедали 67 300 токенов до первого сообщения.</p>
              <p>Рабочий пример на созвоне ещё не доказывает, что ты сможешь повторить его завтра. Поэтому на программе я проверяю самостоятельные попытки.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rz-section">
        <div className="rz-wrap">
          <div className="rz-sec-head" data-reveal>
            <h2 className="rz-h2">Что входит</h2>
            <p>Подписки на Claude, Codex и сторонние сервисы оплачиваются отдельно.</p>
          </div>
          <ul className="rz-list rz-list--cols" data-stagger>
            {included.map((t) => <li key={t} data-reveal>{t}</li>)}
          </ul>
        </div>
      </section>

      <section className="rz-section">
        <div className="rz-wrap">
          <div className="rz-sec-head" data-reveal>
            <h2 className="rz-h2">Вопросы</h2>
            <p>Оплата, границы формата и что будет, если нужна одна встреча.</p>
          </div>
          <div data-reveal><RzFaq items={product.faq ?? []} schemaId="/products/personal-program#faq" /></div>
        </div>
      </section>

      <section className="rz-section rz-product-final">
        <div className="rz-wrap rz-two" data-reveal>
          <div>
            <p className="rz-mono">Личная работа · 6 недель · 1:1</p>
            <h2 className="rz-h2">{product.title}</h2>
          </div>
          <div className="rz-product-buy">
            <p className="rz-product-price">{product.priceLabel}</p>
            <ProgramButtons product={product} position="final" />
            <small>Оплата онлайн на lava.top, чек приходит на почту. Полная оплата до первой встречи.</small>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
    </main>
  );
}
