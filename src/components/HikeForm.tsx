import type { Hike } from "@/lib/types";

const inputClass =
  "rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none";

export function HikeForm({
  action,
  hike,
  defaultStartsAt,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  hike?: Hike;
  defaultStartsAt?: string;
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <Labeled label="Title *">
        <input name="title" required defaultValue={hike?.title} className={inputClass} />
      </Labeled>
      <Labeled label="Trailhead">
        <input name="trailhead" defaultValue={hike?.trailhead} className={inputClass} />
      </Labeled>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Labeled label="Date & time *">
          <input
            type="datetime-local"
            name="starts_at"
            required
            defaultValue={defaultStartsAt}
            className={inputClass}
          />
        </Labeled>
        <Labeled label="Difficulty">
          <select name="difficulty" defaultValue={hike?.difficulty ?? "easy"} className={inputClass}>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="ambitious">Ambitious</option>
          </select>
        </Labeled>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Labeled label="Distance (mi)">
          <input
            type="number"
            step="0.1"
            name="distance_miles"
            defaultValue={hike?.distance_miles ?? ""}
            className={inputClass}
          />
        </Labeled>
        <Labeled label="Elevation gain (ft)">
          <input
            type="number"
            name="elevation_gain_ft"
            defaultValue={hike?.elevation_gain_ft ?? ""}
            className={inputClass}
          />
        </Labeled>
        <Labeled label="Capacity">
          <input
            type="number"
            name="capacity"
            defaultValue={hike?.capacity ?? ""}
            className={inputClass}
          />
        </Labeled>
      </div>

      <Labeled label="Notes / description">
        <textarea name="notes" rows={4} defaultValue={hike?.notes ?? ""} className={inputClass} />
      </Labeled>
      <Labeled label="What to bring">
        <textarea
          name="what_to_bring"
          rows={2}
          defaultValue={hike?.what_to_bring ?? ""}
          className={inputClass}
        />
      </Labeled>

      <Labeled label="Strava route embed URL">
        <input
          name="strava_embed"
          placeholder="https://www.strava.com/…/embed"
          defaultValue={hike?.strava_embed ?? ""}
          className={inputClass}
        />
      </Labeled>
      <Labeled label="AllTrails URL">
        <input
          name="alltrails_url"
          placeholder="https://www.alltrails.com/trail/…"
          defaultValue={hike?.alltrails_url ?? ""}
          className={inputClass}
        />
      </Labeled>
      <Labeled label="Google Maps directions URL">
        <input
          name="gmaps_url"
          placeholder="https://maps.google.com/?q=…"
          defaultValue={hike?.gmaps_url ?? ""}
          className={inputClass}
        />
      </Labeled>

      <label className="flex items-center gap-2 text-sm text-on-surface">
        <input
          type="checkbox"
          name="publish"
          defaultChecked={hike?.status === "published"}
          className="h-4 w-4"
        />
        Publish now (visible on the public schedule)
      </label>

      <div>
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-3 font-medium text-on-primary hover:bg-primary-container"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-on-surface">{label}</span>
      {children}
    </label>
  );
}
