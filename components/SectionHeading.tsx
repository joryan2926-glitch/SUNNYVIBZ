export function SectionHeading({
  eyebrow,
  title,
  text,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  centered?: boolean;
}) {
  return (
    <div className={`mb-10 max-w-3xl ${centered ? "mx-auto text-center" : ""}`}>
      <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-[#ffd978]">
        {eyebrow}
      </p>
      <h2 className="text-balance text-3xl font-medium tracking-[-0.045em] text-[#fbf3df] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {text ? <p className="mt-5 text-sm leading-7 text-[#fbf3df]/68 sm:text-base">{text}</p> : null}
    </div>
  );
}
