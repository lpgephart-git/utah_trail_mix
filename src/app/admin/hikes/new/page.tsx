import { HikeForm } from "@/components/HikeForm";
import { createHike } from "@/app/admin/actions";

export const metadata = { title: "New hike — Utah Trail Mix" };

export default async function NewHikePage(props: PageProps<"/admin/hikes/new">) {
  const { error } = await props.searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-on-surface">New hike</h1>
      {error && (
        <p className="mt-3 text-sm text-error">
          {error === "required" ? "Title and date are required." : String(error)}
        </p>
      )}
      <div className="mt-8">
        <HikeForm action={createHike} submitLabel="Create hike" />
      </div>
    </div>
  );
}
