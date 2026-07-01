import { ChevronDown } from 'lucide-react';

export type FaqItem = { question: string; answer: string };

/**
 * 새신자 Q&A 등 짧은 질문-답 나열용 아코디언. 네이티브 <details> 기반(의존성 추가 없음).
 * 상세: context/components/content/faq-accordion.md
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-brand-line border-y border-brand-line">
      {items.map((item) => (
        <details key={item.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold text-brand-ink [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown
              className="h-4 w-4 shrink-0 text-brand-ink-muted transition-transform duration-200 group-open:rotate-180"
              strokeWidth={1.5}
            />
          </summary>
          <p className="mt-3 text-[14px] leading-relaxed text-brand-ink-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
