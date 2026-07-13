import type { Metadata } from "next";
import { Footer } from "@/components/home/Footer";
import { Reveal } from "@/components/motion/Reveal";

// Unlisted lead-magnet page: reachable only via the direct URL handed out by
// the ChatPlace "ГАЙД" Instagram automation after a subscription check. Not
// in HudFrame PATH_NAMES, not in HudMenu LINKS, not in app/sitemap.ts, not in
// any on-site nav/footer/product listing — noindex below is defense in depth,
// not the only gate. Do NOT link this route from anywhere on the public site.
export const metadata: Metadata = {
  title: "Второй мозг: Claude + Obsidian",
  description:
    "Гайд из 11 шагов: наведите Claude на хранилище Obsidian и больше не объясняйте себя заново.",
  robots: { index: false, follow: false },
};

type Step = {
  n: string;
  title: string;
  body: string[];
  code?: { text: string; wrap?: boolean };
};

const steps: Step[] = [
  {
    n: "01",
    title: "Два инструмента, две роли",
    body: [
      "Obsidian — это хранилище. Бесплатное приложение для заметок, которое держит всё как обычные markdown-файлы прямо на вашем компьютере. Заметки связаны друг с другом через [[double brackets]], и эти связи образуют граф, который можно увидеть.",
      "Claude — это мозг поверх этого. Он читает всё хранилище целиком, раскладывает новый материал туда, где ему место, связывает его с тем, что уже есть, и отвечает на вопросы по всему массиву сразу.",
      "Вся система — это текстовые файлы, поэтому ни одна модель не владеет ею единолично. Наведите на ту же папку другую через год — и всё по-прежнему работает.",
    ],
  },
  {
    n: "02",
    title: "Установите Claude Code",
    body: [
      "Скачайте десктоп-приложение Claude с claude.com/download и откройте вкладку Code. Эта вкладка и есть Claude Code — версия, которая читает и пишет файлы на вашем компьютере.",
      "Нужен платный план. Claude Pro стоит $20 в месяц или $17 при оплате за год, а на бесплатном тарифе Claude Code не запустится. Это единственная статья расходов во всей сборке. Всё остальное ниже — бесплатно.",
    ],
  },
  {
    n: "03",
    title: "Создайте хранилище",
    body: [
      "Скачайте Obsidian с obsidian.md. Создайте новое хранилище, назовите его brain, выберите папку, где оно будет лежать. Эта папка отныне — ваш второй мозг.",
      "Создайте одну заметку, наберите фразу, а затем наберите [[goals]]. Слово в скобках превращается в ссылку. Именно эта простая механика — заметки, ссылающиеся на заметки, — и есть то, что Claude будет делать за вас в большом масштабе.",
    ],
  },
  {
    n: "04",
    title: "Откройте дверь в хранилище",
    body: [
      "Claude дотягивается до хранилища через плагин. В Obsidian откройте Settings, нажмите Community plugins, включите их, затем зайдите в Browse и установите Local REST API.",
      "Включите плагин, откройте его настройки и скопируйте API key. Не закрывайте Obsidian. Дверь работает, только пока приложение открыто.",
    ],
  },
  {
    n: "05",
    title: "Подключите Claude через MCP",
    body: [
      "На вкладке Code вставьте это, подставив свой ключ:",
    ],
    code: {
      text: `claude mcp add-json obsidian-vault '{
  "type": "stdio",
  "command": "uvx",
  "args": ["mcp-obsidian"],
  "env": {
    "OBSIDIAN_API_KEY": "PASTE-YOUR-KEY",
    "OBSIDIAN_HOST": "127.0.0.1",
    "OBSIDIAN_PORT": "27124"
  }
}'`,
    },
  },
  {
    n: "05",
    title: "",
    body: [
      "Плагин показывает ключ со словом Bearer перед ним. Это слово выбросьте. Вставляйте только строку из букв и цифр, которая идёт после него.",
      "mcp-obsidian — самый проверенный мост, с тысячами звёзд на GitHub. Проверьте его: наберите «выведи список всех файлов в моём хранилище». Если Claude зачитает вам ваши заметки в ответ — дверь открыта.",
    ],
  },
  {
    n: "06",
    title: "Загрузите себя в этот мозг",
    body: ["Пустой мозг бесполезен, и не нужно вбивать весь свой профиль руками. Пусть Claude сам возьмёт у вас интервью. Вставьте:"],
    code: {
      wrap: true,
      text: `Ты настраиваешь мой второй мозг. Бери у меня интервью по ОДНОМУ вопросу за раз,
чтобы собрать мой профиль: кто я и чем занимаюсь, мои цели на этот год, как я хочу,
чтобы ты со мной общался, мои сильные и слабые стороны, мои текущие проекты. Жди
каждого ответа. Когда закончишь, запиши всё это в CLAUDE.md в корне хранилища, с
заголовками, чтобы ты подгружал это в каждой сессии.`,
    },
  },
  {
    n: "06",
    title: "",
    body: [
      "Отвечайте так, будто вводите в курс дела нового сооснователя. Чем честнее ответы, тем лучше мозг вас знает. Когда интервью закончится, в CLAUDE.md будет ваш контекст — и вам больше не придётся объяснять себя заново.",
    ],
  },
  {
    n: "07",
    title: "Украдите структуру Карпати",
    body: [
      "В апреле 2026 года Андрей Карпати опубликовал паттерн, который назвал LLM Wiki. Держится он на двух папках.",
      "raw/ хранит неизменяемые источники — статьи, транскрипты, PDF и скриншоты, которые Claude читает, но никогда не правит. wiki/ хранит страницы, которые Claude пишет на их основе: саммари, страницы-концепции, перекрёстные ссылки.",
      "Вики вы не пишете никогда. Claude собирает её в тот момент, когда появляется новый источник, а затем прогоняет проход-проверку (lint), который ловит битые ссылки и противоречия. У самого Карпати в одном прогоне тема разрослась примерно до 100 статей и 400 000 слов — и он не написал ни одной страницы вручную.",
      "Скажите Claude: «Настрой raw/ и wiki/. Когда я кладу файл в raw/, прочитай его, напиши или обнови соответствующие страницы wiki/ и свяжи их ссылками».",
    ],
  },
  {
    n: "08",
    title: "Научите Claude диалекту Obsidian",
    body: [
      "Claude пишет на обычном markdown. Он не знает ни [[wikilinks]], ни callout-блоков, ни Bases, ни Canvas — пока вы ему это не покажете.",
      "Стеф Анго, CEO Obsidian, это исправил. В его репозитории kepano/obsidian-skills лежат 5 официальных Agent Skills под форматы Obsidian: markdown, Bases, Canvas, CLI и извлечение из веба. Просто положите содержимое репозитория в папку .claude в корне хранилища.",
      "Теперь заметки Claude получаются собранными вручную, а не «почти правильными». Скиллы следуют открытой спецификации Agent Skills, поэтому работают и в Codex, и в других агентах — а вы остаётесь ни к чему не привязаны.",
    ],
  },
  {
    n: "09",
    title: "Прокачайте мост",
    body: [
      "mcp-obsidian из шага 05 — это дверь. Дальше можно добавить то, что видит сквозь неё смысл, а не только файлы.",
      "obsidian-mcp-tools (jacksteamdev, 800+ звёзд на GitHub) ставится поверх того же Local REST API и добавляет Claude поиск по смыслу заметки, а не по точному слову, плюс запуск ваших собственных Templater-шаблонов прямо из чата.",
      "Семантический поиск ему даёт плагин Smart Connections (5000+ звёзд) — он строит локальную векторную базу вашего хранилища на устройстве, без API-ключей и без отправки заметок наружу. Поставьте его первым, obsidian-mcp-tools подключится к нему сам.",
      "И один плагин на другом конце: официальный Obsidian Web Clipper сохраняет статьи и транскрипты YouTube в чистый markdown с готовым frontmatter прямо в raw/. Меньше рутины перед тем, как Claude возьмётся за файл.",
    ],
  },
  {
    n: "10",
    title: "Добавьте живые данные — и уходите",
    body: ["Статичные заметки — это половина мозга. Подключите то, что меняется. Для Google Calendar выполните:"],
    code: { text: "claude mcp add google-workspace uvx workspace-mcp --tools calendar" },
  },
  {
    n: "10",
    title: "",
    body: [
      "Дайте доступ на чтение, а затем скажите: «Прочитай сегодняшний календарь, занеси в мои задачи всё, что я пообещал на каждой встрече, и пометь всё, у кого нет ясного следующего шага».",
      "Когда ваши процессы устоятся — поставьте их на расписание. Откройте вкладку Schedule, добавьте ежедневную задачу на 7 утра и велите ей раскладывать всё новое по raw/, проставлять ссылки, помечать заметки, которые устарели, и писать сводку в три строки о том, что изменилось за ночь.",
      "Одно правило, которое вы не нарушаете: доступом управляют ключи, а не промпты. «Не удаляй это» — это пожелание. Ключ только на чтение, с ограниченной областью — это настройка. Если агент может удалить файл — однажды он это сделает.",
    ],
  },
  {
    n: "11",
    title: "Пропустите всю настройку: четыре бесплатных репозитория",
    body: [
      "Если собирать с нуля не хочется, сообщество уже упаковало всё целиком.",
      "AgriciDaniel/claude-obsidian — это самоорганизующийся мозг по паттерну Карпати: 15 скиллов Claude Code и пресеты под PARA, Zettelkasten и другие методы.",
      "eugeniughelbur/obsidian-second-brain даёт 43 команды вроде /obsidian-save, /obsidian-daily и /obsidian-find и работает сразу в Claude, Codex и Gemini.",
      "coleam00/second-brain-starter проводит с вами интервью, пишет план сборки, а затем разворачивает всё целиком из markdown и Python.",
      "ballred/obsidian-claude-pkm (1500+ звёзд) — самый укомплектованный вариант: 4 агента с памятью, 10 скиллов, автокоммит изменений в git и готовые еженедельные и ежемесячные обзоры хранилища.",
      "Склонируйте любой. И перекроите под себя.",
    ],
  },
];

function CodeBlock({ text, wrap }: { text: string; wrap?: boolean }) {
  return (
    <pre
      className={`mt-5 overflow-x-auto border border-line bg-ink px-5 py-4 font-mono text-[13px] leading-relaxed text-paper ${
        wrap ? "whitespace-pre-wrap" : ""
      }`}
    >
      {text}
    </pre>
  );
}

export default function SecondBrainGuidePage() {
  return (
    <div className="bg-paper text-ink">
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-5 pb-12 pt-24 md:px-10 md:pt-28">
          <Reveal>
            <p data-reveal className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
              Гайд из 11 шагов
            </p>
            <h1
              data-reveal
              className="font-heading mt-6 text-[32px] font-black leading-[1.05] tracking-[-0.03em] text-ink sm:text-[40px] lg:text-[48px]"
            >
              Второй мозг: наведите Claude на хранилище Obsidian и больше не объясняйте себя заново
            </h1>
            <p data-reveal className="mt-6 max-w-xl text-[17px] leading-[1.55] text-ink-muted">
              Один вечер настройки — и хранилище, которое раскладывает себя в 7 утра, и модель, что
              с первой секунды знает вашу работу.
            </p>
          </Reveal>
        </section>

        {/* Intro */}
        <section className="border-t border-line">
          <Reveal className="mx-auto max-w-3xl px-5 py-12 md:px-10 md:py-16">
            <div data-reveal className="space-y-5 text-[16px] leading-relaxed text-ink">
              <p>
                30-летний фрилансер-разработчик из Лиссабона держал свои лучшие мысли сразу в 5
                местах. Приложение для заметок, 30 вкладок в браузере, доска в Notion, которую он
                перестал открывать, и 40 заброшенных чатов с Claude, которые он уже никогда не
                найдёт. Каждый проект начинался одинаково: 20 минут на то, чтобы по памяти
                восстановить контекст, а к пятнице большая часть его всё равно терялась.
              </p>
              <p>
                Потом он перестал вываливать свою жизнь в окно чата и начал наводить Claude на
                папку. Один вечер настройки. К концу месяца он открыл свой граф в Obsidian и замер,
                потому что эта штука знала связи, о которых он сам уже забыл.
              </p>
              <p>
                Та же сборка, шаг за шагом, написанная для того, кто никогда не открывал ни Claude
                Code, ни Obsidian. Один вечер настройки — и вы получаете хранилище, которое
                раскладывает себя само в 7 утра, и модель, которая открывает каждую сессию, уже
                зная вашу работу.
              </p>
            </div>
          </Reveal>
        </section>

        {/* Steps */}
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-3xl px-5 py-12 md:px-10 md:py-16">
            {steps.map((step, i) => (
              <Reveal key={i}>
                <div
                  data-reveal
                  className={`grid gap-6 py-8 md:grid-cols-[88px_1fr] ${
                    i > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <p className="font-mono text-2xl font-bold text-accent">
                    {step.title ? step.n : ""}
                  </p>
                  <div>
                    {step.title && (
                      <h2 className="font-heading text-xl font-bold tracking-[-0.02em] text-ink md:text-2xl">
                        {step.title}
                      </h2>
                    )}
                    <div className={`space-y-4 text-[16px] leading-relaxed text-ink ${step.title ? "mt-4" : ""}`}>
                      {step.body.map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>
                    {step.code && <CodeBlock text={step.code.text} wrap={step.code.wrap} />}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Outro */}
        <section className="border-t border-line">
          <Reveal className="mx-auto max-w-3xl px-5 py-12 md:px-10 md:py-16">
            <h2 data-reveal className="font-heading text-2xl font-extrabold tracking-[-0.02em] text-ink md:text-3xl">
              Что у вас в итоге
            </h2>
            <div data-reveal className="mt-6 space-y-5 text-[16px] leading-relaxed text-ink">
              <p>
                До этого Claude забывает вас в ту же секунду, как вы закрываете вкладку. Весь
                контекст держите вы — и большую часть его теряете.
              </p>
              <p>После — хранилище держит всё, а модель подхватывает с того места, где остановилась.</p>
              <p>
                Поработайте так неделю — и это приложение для заметок. Поработайте месяц — и это
                справочная система. Поработайте полгода — и это движок знаний, который не заменит
                никакой объём гугления, потому что каждая новая заметка связывается со всем, что уже
                накоплено.
              </p>
              <p className="lime-mark inline font-bold">Та же подписка. Совершенно другая машина.</p>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
