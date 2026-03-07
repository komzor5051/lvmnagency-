"use client";

import { Marquee } from "@/components/ui/marquee";

const testimonials = [
  {
    text: "Менеджеры тратили 5 часов на обработку заявок. Сейчас — 40 минут. За 2 недели Влад сделал то, что мы пытались решить полгода.",
    name: "Алексей К.",
    role: "Сеть ресторанов, Новосибирск",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    text: "Раньше теряли 30% обращений вечером. Теперь бот записывает пациентов 24/7. Загрузка врачей выросла на 25% за первый месяц.",
    name: "Марина С.",
    role: "Стоматологическая клиника",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    text: "AI-скрининг кандидатов сэкономил нам 85% времени рекрутера. Закрываем вакансии на 2 недели быстрее. Окупилось за первый месяц.",
    name: "Дмитрий В.",
    role: "Кадровое агентство",
    img: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    text: "Самое ценное — Влад объясняет всё по-человечески. Без технического жаргона. Мы за 10 дней запустили AI-куратора для 400 студентов.",
    name: "Елена Н.",
    role: "Онлайн-школа",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

function ReviewCard({ text, name, role, img }: typeof testimonials[number]) {
  return (
    <figure className="relative w-80 cursor-pointer overflow-hidden rounded-[var(--r-md)] bg-[var(--surface)] p-7 shadow-[var(--sh-xs)] transition-all duration-300 hover:shadow-[var(--sh-md)] hover:-translate-y-0.5">
      <div className="text-[var(--amber)] text-sm tracking-wider mb-3">
        &#9733;&#9733;&#9733;&#9733;&#9733;
      </div>
      <blockquote className="text-[var(--text-2)] text-[15px] leading-[1.7] mb-5">
        &laquo;{text}&raquo;
      </blockquote>
      <div className="flex items-center gap-3">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={img}
          alt={name}
          width={40}
          height={40}
        />
        <div>
          <div className="font-heading text-sm font-bold text-[var(--text)]">{name}</div>
          <div className="text-xs text-[var(--text-3)] mt-0.5">{role}</div>
        </div>
      </div>
    </figure>
  );
}

export function TestimonialsMarquee() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden mt-11">
      <Marquee pauseOnHover className="[--duration:35s]">
        {testimonials.map((t) => (
          <ReviewCard key={t.name} {...t} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-[var(--bg-alt)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-[var(--bg-alt)]" />
    </div>
  );
}
