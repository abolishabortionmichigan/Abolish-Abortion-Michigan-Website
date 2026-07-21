/**
 * Accessible inline info bubble. Uses <details>/<summary> so it works
 * without JavaScript, is keyboard-navigable, and gets indexed by search
 * engines (the content is real HTML, not a hover-only tooltip).
 *
 * Renders as a small "ⓘ" icon inline; click/tap/keyboard-activate
 * expands the explanation below.
 */
export default function InfoTip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <details className="inline-block align-middle relative group">
      <summary
        className="cursor-help select-none list-none inline-flex items-center justify-center w-4 h-4 ml-1 rounded-full bg-gray-200 text-gray-700 text-[10px] font-bold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label={`Learn more about ${label}`}
      >
        i
      </summary>
      <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1 z-10 w-72 max-w-[calc(100vw-2rem)] bg-white border border-gray-300 rounded shadow-lg p-3 text-xs text-gray-700 font-normal normal-case tracking-normal">
        {children}
      </div>
    </details>
  );
}
