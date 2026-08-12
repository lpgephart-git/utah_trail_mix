import { getHike } from "@/lib/data";
import { buildICS } from "@/lib/calendar";

export async function GET(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const hike = await getHike(id);
  if (!hike) return new Response("Hike not found", { status: 404 });

  const url = new URL(request.url);
  const eventUrl = `${url.protocol}//${url.host}/hikes/${id}`;
  const ics = buildICS(hike, eventUrl, new Date().toISOString());

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="utah-trail-mix-${id}.ics"`,
    },
  });
}
