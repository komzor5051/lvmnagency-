import Link from "next/link";
import { TELEGRAM_URL } from "@/lib/products";

export default function DeskFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-8 py-9 text-[14px] text-ink-muted max-md:px-4">
        <span>Влад Лямин, 2026</span>
        <div className="flex items-center gap-6">
          <Link href="/blog" className="text-ink no-underline hover:underline hover:underline-offset-4">
            Блог
          </Link>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink no-underline hover:underline hover:underline-offset-4"
          >
            Telegram
          </a>
        </div>
      </div>
    </footer>
  );
}
