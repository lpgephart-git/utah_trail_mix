const SIZES = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-20 w-20 text-xl" };

function initials(name: string): string {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

export function Avatar({
  name,
  imageUrl,
  size = "md",
}: {
  name: string;
  imageUrl?: string | null;
  size?: keyof typeof SIZES;
}) {
  const base = `${SIZES[size]} shrink-0 rounded-full object-cover`;
  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageUrl} alt={name} className={`${base} border border-outline-variant`} />;
  }
  return (
    <div
      className={`${base} flex items-center justify-center bg-secondary-container font-medium text-on-secondary-container`}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}
