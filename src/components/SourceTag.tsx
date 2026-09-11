import type { Source } from '../data';

interface Props {
  source: Source;
  asOf?: string;
}

/**
 * A superscript citation. Small, but never hidden: if a number is on the
 * page, the reader can get to where it came from in one click.
 */
export function SourceTag({ source, asOf }: Props) {
  const title = asOf ? `${source.label} — as of ${asOf}` : source.label;
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer noopener"
      title={title}
      className="ml-1 align-super text-[0.65em] text-[var(--color-muted)] underline decoration-dotted underline-offset-2 hover:text-[var(--color-series-1)]"
    >
      source
    </a>
  );
}
