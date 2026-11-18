import { httpUrl } from "@/lib/http-url";

/**
 * Photo credit under an article hero. Source and license become links only
 * when they are http(s) URLs. A note such as "Owned by Collegiate Agency"
 * stays plain text, so it cannot become a broken href.
 */
export function ArticlePhotoCredit({
  credit,
  source,
  license,
  owned,
}: {
  credit: string;
  source?: string;
  license?: string;
  owned: boolean;
}) {
  const sourceHref = httpUrl(source);
  const licenseHref = httpUrl(license);
  return (
    <p className="mt-3 text-xs text-[color:var(--muted-on-light)]">
      Photo:{" "}
      {sourceHref ? (
        <a href={sourceHref} className="underline" rel="noopener noreferrer">
          {credit}
        </a>
      ) : (
        credit
      )}
      {license && (
        <>
          {" "}
          ·{" "}
          {licenseHref ? (
            <a href={licenseHref} className="underline" rel="noopener noreferrer">
              License
            </a>
          ) : (
            license
          )}
        </>
      )}
      .{" "}
      {owned
        ? "Photographed at a Collegiate Agency activation."
        : "Illustrative campus photograph, not a Collegiate Agency activation or endorsement."}
    </p>
  );
}
