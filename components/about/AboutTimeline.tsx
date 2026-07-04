'use client'
import Chapter from '@/components/hud/Chapter'
import SplitLines from '@/components/motion/SplitLines'

const TIMELINE = [
  {
    years: 'до 2022',
    title: 'Первый бизнес',
    text: 'Работал с клиентами и вёл собственный SaaS. Понял главное: продукт стоит делать, только если он экономит деньги или время. Этот фильтр использую до сих пор.',
  },
  {
    years: '2022',
    title: 'Переход в AI',
    text: 'Ушёл в AI и сделал первые внедрения — боты и автоматизации, которые снимали рутину с людей. Стало ясно: рынок полон демонстраций и почти пуст на работающие системы.',
  },
  {
    years: '2023–2024',
    title: 'Надёжный стек',
    text: 'Собрал инструменты, которые не подводят, и перевёл десятки процессов с ручного труда на автоматические пайплайны. Внедрений стало больше сорока.',
  },
  {
    years: '2025',
    title: 'Обучение и фокус',
    text: 'Обучил больше пятидесяти человек работать с AI на практике. Сместил фокус на фаундеров и владельцев бизнеса — тех, кто принимает решения и считает деньги.',
  },
  {
    years: 'сейчас',
    title: 'Сейчас',
    text: 'Внедряю, обучаю и консультирую лично — без промежуточных звеньев между вами и результатом.',
  },
] as const

export default function AboutTimeline() {
  return (
    <Chapter name="Timeline" theme="dark" className="px-[6vw] py-28">
      <SplitLines as="h2" className="font-display max-w-[900px] text-[clamp(32px,5.5vw,72px)]">
        Как я к этому <span className="ghost">пришёл</span>
      </SplitLines>

      <div className="mt-16 max-w-[760px]">
        {TIMELINE.map(item => (
          <div
            key={item.years}
            className="grid gap-3 border-t border-dark-line py-8 last:border-b sm:grid-cols-[100px_16px_1fr] sm:items-start sm:gap-8"
          >
            <span className="mono-label text-dark-muted">{item.years}</span>
            <span aria-hidden="true" className="hidden size-3 self-start bg-lime sm:block" />
            <div>
              <h3 className="font-display text-[24px] md:text-[28px]">{item.title}</h3>
              <p className="mt-3 max-w-[560px] leading-relaxed text-dark-muted">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </Chapter>
  )
}
