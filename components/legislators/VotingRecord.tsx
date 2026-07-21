import type { Legislator, VoteValue } from '@/lib/data/legislators';
import { TRACKED_BILLS } from '@/lib/data/legislators';

/**
 * Six-bill voting record from the 2023-2024 MI Legislature session.
 * Each row shows: bill, description, actual vote, and — because the same
 * vote means opposite things depending on which side you're on — an
 * abolitionist-perspective annotation.
 *
 * From the AAM perspective a Nay on RHA is aligned with abolition; a Yea
 * on RHA is against abolition.
 */
export default function VotingRecord({ legislator }: { legislator: Legislator }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-3 py-2 font-semibold text-gray-700">Bill</th>
            <th className="px-3 py-2 font-semibold text-gray-700 hidden sm:table-cell">
              Description
            </th>
            <th className="px-3 py-2 font-semibold text-gray-700">Vote</th>
            <th className="px-3 py-2 font-semibold text-gray-700">Aligned with abolition?</th>
          </tr>
        </thead>
        <tbody>
          {TRACKED_BILLS.map((bill) => {
            const key = `vote_${bill.key}` as keyof Legislator;
            const vote = legislator[key] as VoteValue;
            return (
              <tr key={bill.key} className="border-t border-gray-200 align-top">
                <td className="px-3 py-3 font-semibold text-gray-900 whitespace-nowrap">
                  {bill.title.split(' — ')[0]}
                </td>
                <td className="px-3 py-3 text-gray-600 hidden sm:table-cell">
                  {bill.description}
                </td>
                <td className="px-3 py-3">
                  <VoteBadge vote={vote} />
                </td>
                <td className="px-3 py-3">{alignmentLabel(vote, bill.proChoicePosition)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-3">
        Source: Michigan Legislature roll-call PDFs. Bills that never received a floor vote (5 of
        the 10 tracked anti-abortion bills died in committee) are omitted.
      </p>
    </div>
  );
}

function VoteBadge({ vote }: { vote: VoteValue }) {
  const label = vote ?? 'No vote';
  const color =
    vote === 'Yea'
      ? 'bg-green-100 text-green-800'
      : vote === 'Nay'
        ? 'bg-red-100 text-red-800'
        : vote === 'Excused'
          ? 'bg-amber-100 text-amber-800'
          : 'bg-gray-200 text-gray-700';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
}

function alignmentLabel(vote: VoteValue, proChoicePosition: 'Yea' | 'Nay'): string {
  if (!vote || vote === 'Excused' || vote === 'NotVoting') return '—';
  // Abolitionist / pro-life aligned = opposite of the pro-choice position.
  const abolitionAligned = vote !== proChoicePosition;
  return abolitionAligned ? '✓ Yes' : '✗ No';
}
