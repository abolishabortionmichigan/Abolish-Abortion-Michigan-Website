import { stanceBadgeClass, type Stance } from '@/lib/data/legislators';

const STANCE_BLURB: Record<Stance, string> = {
  Abolitionist:
    'Supports the immediate, total abolition of abortion with equal legal protection for the preborn.',
  'Incrementalist (Pro-Life)':
    'Supports restrictions and regulations on abortion, generally accepting exceptions and incremental strategies.',
  'Pro-Choice': 'Supports abortion access.',
  Unknown: 'Insufficient public record to classify.',
};

export default function StanceBadge({ stance, className = '' }: { stance: Stance; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide ${stanceBadgeClass(stance)} ${className}`}
      title={STANCE_BLURB[stance]}
    >
      {stance}
    </span>
  );
}
