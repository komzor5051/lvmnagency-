# Copy rework: «Второй мозг» positioning

Date: 2026-06-22
Scope: site-wide copy only (no layout/markup changes except one new thin
section on the home page). No code logic, no data model.

## Goal

Shift the whole site from positioning Влад as an **automator / AI-инженер who
builds automations** to a **person who helps founders and experts actually
start using AI in their work every day** — «AI как второй мозг».

Same offer, same audience (фаундеры, эксперты), same products. Only the
connective copy and headlines change. Keep everything that earns trust:
ProofStrip stats, TeachingStrip, CasesSection, the /about timeline, expertise,
«скучный AI» principles, stack, product cards and prices.

## Positioning decisions (locked with Влад)

- Core frame: **«Второй мозг»** — AI становится тем, к кому идёшь первым.
- Drop the hard job title «AI-инженер» from visible copy; describe Влад by
  what he does for the client, not by a profession label.
- Drop «Я не агентство» as a headline — but keep the idea as a **negation
  triad** device (Matt Gray pattern), see below.
- Voice: humanized, no AI-cliché buzzwords («встроить AI в мышление»,
  «перенести решения на AI» — banned). Concrete, first person, has a pulse.
- No location in visible text (CLAUDE.md rule). The current AboutTeaser line
  «Живу в Новосибирске» must be removed.

## Expert-pattern moves adopted (from research: Matt Gray, Justin Welsh, AI Edge)

1. **Negation triad** — new thin home section after ProofStrip.
2. **«I turn X into Y»** one-liner in AboutTeaser.

(Not adopted: numbers welded into hero subhead, money-back guarantee.)

## Final copy

### Home — Hero (`components/home/Hero.tsx`)
- Kicker: `Помогаю фаундерам и экспертам сделать AI вторым мозгом →`
- H1 (lime on «первым»):
  `AI становится тем, к кому идёте первым — за решением, текстом, разбором.`
- Subhead:
  `Меня зовут Влад. С 2022 года собрал 40+ AI-внедрений для бизнеса. Помогаю
  фаундерам и экспертам перестать держать всё в голове и вкладках — и реально
  начать пользоваться AI в работе каждый день. От часа консультации до системы
  под ключ.`
- CTA, chip «беру проекты на июль», hand note «↳ запись и план остаются у вас»:
  unchanged. Image alt → `Влад Лямин` (drop «AI-инженер»).

### Home — new negation triad (`components/home/NotStrip.tsx`, after ProofStrip)
Three hairline columns (TeachingStrip visual language):
- `Не агентство` — `Работаете со мной напрямую. Без менеджеров и пересылок: задачу делает и отвечает за неё один человек.`
- `Не очередной курс` — `Не продаю «изучите AI за 30 дней». Берём ваши реальные задачи и доводим до работающего результата.`
- `Не разовый проект` — `Подрядчик уходит — система умирает. Я остаюсь, пока вы и команда не сможете работать с AI без меня.`

### Home — ProductsSection (`components/home/ProductsSection.tsx`)
- Sub: `Форматы под разный масштаб: разобраться самому по гайду, за час собрать
  план под свою задачу или отдать разбор бизнеса мне.`

### Home — DarkBusiness (`components/home/DarkBusiness.tsx`)
- H2: `Нужно, чтобы AI заработал у всей команды, а не один созвон?`
- Body: `Внедряю AI-системы под ключ от 50 000 ₽, учу команду работать с ними и
  остаюсь на связи. Начинаем с 30-минутного разговора о задаче.`

### Home — AboutTeaser (`components/home/AboutTeaser.tsx`)
- H2 (lime on «сами»): `Я помогаю вам пользоваться AI сами, а не делаю это вместо вас.`
- One-liner (hand note slot): `Превращаю «надо наконец разобраться с AI» в то, чем вы пользуетесь каждое утро.`
- Body: `В AI с 2022. Строю агентов, пайплайны и автоматизацию на n8n, Supabase,
  Claude. Но дело не в том, что я что-то настрою и уйду, — я остаюсь, пока вы и
  команда не научитесь работать с этим без меня. Ещё преподаю. Кто я и как
  работаю — в манифесте.` (Новосибирск removed)

### Home — FinalCta (`components/home/FinalCta.tsx`)
- Sub: `Консультация — самый быстрый способ понять, с чего вам начать
  пользоваться AI всерьёз.` (H2 «Один час изменит всё» unchanged)

### /about (`app/about/page.tsx`)
- metadata.description: `С 2022 года помогаю предпринимателям и экспертам самим
  начать пользоваться AI в работе. 40+ внедрений, принципы скучного AI и мой стек.`
- H1 (lime on «сами»): `Со мной вы наконец начинаете пользоваться AI — и работаете с ним сами.`
- Hero sub: `С 2022 года помогаю предпринимателям и экспертам реально начать
  пользоваться AI — каждый день, в своих задачах, а не «когда-нибудь разберусь».
  Не сдаю проект и не исчезаю: остаюсь, пока вы и команда не научитесь работать
  с ним без меня.`
- Final CTA H2 (lime on «заработал»): `Хотите, чтобы AI наконец заработал у вас?`
  (sub unchanged — already concrete)
- Footer line: `Влад Лямин · работаю с AI с 2022` (drop «AI-инженер»)
- Timeline / Expertise / Principles / Stack: unchanged.

### /products (`app/products/page.tsx`)
- Hero sub: `Один и тот же опыт — в форматах под разный масштаб: от гайда на
  вечер до разбора всего бизнеса. Начните с того, что уместно сейчас.`
- Product cards, prices, FAQ: unchanged.

### Source of truth (`lib/lvmn-features.ts`)
- Rewrite the «Кто такой Влад Лямин» paragraph to match the new frame (so the
  blog writer stays consistent). Keep all `LVMN_*` export names.

## Out of scope
- Layout, fonts, colours, motion, products data, prices, blog pipeline logic.
