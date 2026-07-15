"use client";

type SunnyPassCardProps = {
  userId: string;
  email: string;
  fullName?: string | null;
  roles?: string[] | null;
  planName?: string | null;
  artistStatus?: "active" | "inactive" | null;
  createdAt?: string | null;
};

function makePassNumber(userId: string) {
  const compact = userId.replace(/-/g, "").slice(0, 10).toUpperCase();
  return `SVZ-${compact || "MEMBER"}`;
}

function makeHash(input: string) {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  return hash >>> 0;
}

function isFinder(row: number, col: number, size: number) {
  const zones = [
    [0, 0],
    [0, size - 7],
    [size - 7, 0],
  ];

  return zones.some(([startRow, startCol]) => {
    const localRow = row - startRow;
    const localCol = col - startCol;

    if (localRow < 0 || localCol < 0 || localRow > 6 || localCol > 6) {
      return false;
    }

    const isBorder = localRow === 0 || localCol === 0 || localRow === 6 || localCol === 6;
    const isCenter = localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4;

    return isBorder || isCenter;
  });
}

function SunnyQrVisual({ payload }: { payload: string }) {
  const size = 25;
  const hash = makeHash(payload);
  const cells = Array.from({ length: size * size }, (_, index) => {
    const row = Math.floor(index / size);
    const col = index % size;
    const finder = isFinder(row, col, size);
    const value = (hash + row * 17 + col * 31 + row * col * 7) % 9;
    const active = finder || value === 0 || value === 2 || value === 5;

    return { active, col, row };
  });

  return (
    <div
      aria-label="QR Code SUNNY PASS"
      className="grid size-40 grid-cols-[repeat(25,minmax(0,1fr))] gap-[2px] rounded-[1.2rem] border border-[#18f2a6]/28 bg-[#fbf3df] p-3 shadow-[0_0_36px_rgba(24,242,166,0.22)]"
      role="img"
      title={payload}
    >
      {cells.map((cell) => (
        <span
          className={cell.active ? "rounded-[1px] bg-[#03110c]" : "rounded-[1px] bg-transparent"}
          key={`${cell.row}-${cell.col}`}
        />
      ))}
    </div>
  );
}

export function SunnyPassCard({
  artistStatus,
  createdAt,
  email,
  fullName,
  planName,
  roles,
  userId,
}: SunnyPassCardProps) {
  const passNumber = makePassNumber(userId);
  const safeRoles = roles && roles.length > 0 ? roles : ["adherent"];
  const payload = `SUNNYVIBZ|${passNumber}|${email}`;
  const memberSince = createdAt
    ? new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date(createdAt))
    : "Date à confirmer";

  return (
    <section className="premium-card overflow-hidden rounded-[2.2rem] border border-[#18f2a6]/24 bg-[radial-gradient(circle_at_top_left,rgba(24,242,166,0.22),transparent_25rem),radial-gradient(circle_at_bottom_right,rgba(255,217,120,0.16),transparent_22rem),rgba(255,255,255,0.055)] p-6 shadow-[0_0_60px_rgba(24,242,166,0.14)] backdrop-blur-xl sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-[0.7rem] font-black uppercase tracking-[0.24em] text-[#ffd978]">
            SUNNY PASS
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#fbf3df] sm:text-5xl">
            {fullName || "Membre SunnyVibz"}
          </h2>
          <p className="mt-2 text-sm text-[#fbf3df]/62">{email}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/22 p-4">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
                Numéro membre
              </p>
              <p className="mt-2 font-mono text-lg font-semibold text-[#fbf3df]">{passNumber}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/22 p-4">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
                Niveau
              </p>
              <p className="mt-2 text-lg font-semibold text-[#fbf3df]">
                {planName || "Adhésion découverte"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/22 p-4">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
                Rôles
              </p>
              <p className="mt-2 text-sm font-semibold text-[#fbf3df]">
                {safeRoles.map((role) => role.charAt(0).toUpperCase() + role.slice(1)).join(" · ")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/22 p-4">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
                Statut talent
              </p>
              <p className="mt-2 text-sm font-semibold text-[#fbf3df]">
                {artistStatus === "active" ? "Profil actif" : "Non activé"}
              </p>
            </div>
          </div>

          <p className="mt-5 text-xs leading-6 text-[#fbf3df]/55">
            Membre depuis {memberSince}. Le QR Code sert de base MVP pour vérifier rapidement
            l’identité membre, le statut et le parcours SunnyVibz.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 lg:items-center">
          <SunnyQrVisual payload={payload} />
          <p className="max-w-44 text-xs leading-5 text-[#fbf3df]/58 lg:text-center">
            Présentez ce pass lors des ateliers, événements et accès membres.
          </p>
        </div>
      </div>
    </section>
  );
}
