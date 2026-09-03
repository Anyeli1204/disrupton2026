function countryCode(country: string) {
  const n = country.toLowerCase();
  if (n.includes("unidos") || n === "usa" || n === "us") return "US";
  if (n.includes("bajos") || n.includes("netherlands") || n === "nl") return "NL";
  if (n.includes("per")) return "PE";
  return "XX";
}

export function CountryFlag({
  country,
  className = "h-6 w-6",
}: {
  country: string;
  className?: string;
}) {
  const code = countryCode(country);
  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden rounded-full shadow-sm ring-1 ring-black/10 ${className}`}
      title={country}
      aria-label={country}
    >
      {code === "US" ? <UsFlag /> : code === "NL" ? <NlFlag /> : code === "PE" ? <PeFlag /> : <UnknownFlag />}
    </span>
  );
}

function UsFlag() {
  return (
    <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden>
      <rect width="32" height="32" fill="#bf0a30" />
      {[2, 6, 10, 14, 18, 22, 26].map((y) => (
        <rect key={y} y={y} width="32" height="2" fill="#fff" />
      ))}
      <rect width="14" height="14" fill="#002868" />
      {[3, 7, 11].map((y) =>
        [2, 5, 8, 11].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.7" fill="#fff" />),
      )}
    </svg>
  );
}

function NlFlag() {
  return (
    <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden>
      <rect width="32" height="11" fill="#ae1c28" />
      <rect y="11" width="32" height="10" fill="#fff" />
      <rect y="21" width="32" height="11" fill="#21468b" />
    </svg>
  );
}

function PeFlag() {
  return (
    <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden>
      <rect width="11" height="32" fill="#d91023" />
      <rect x="11" width="10" height="32" fill="#fff" />
      <rect x="21" width="11" height="32" fill="#d91023" />
    </svg>
  );
}

function UnknownFlag() {
  return (
    <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden>
      <rect width="32" height="32" fill="#e8efe8" />
      <circle cx="16" cy="16" r="7" fill="none" stroke="#1b6a46" strokeWidth="1.5" />
    </svg>
  );
}
