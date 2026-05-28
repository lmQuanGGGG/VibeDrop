import type { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  let supabase;
  try {
    supabase = await createServerSupabaseClient();
  } catch (error) {
    console.error("Failed to initialize Supabase client for sitemap:", error);
  }

  // 1. Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/trending`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  if (!supabase) {
    return staticRoutes;
  }

  // 2. Dynamic prompts routes (active & public)
  const { data: prompts } = await supabase
    .from("prompts")
    .select("id, updated_at")
    .eq("visibility", "public")
    .eq("status", "active")
    .order("updated_at", { ascending: false })
    .limit(1000);

  const promptRoutes: MetadataRoute.Sitemap = (prompts || []).map((prompt) => ({
    url: `${SITE_URL}/prompts/${prompt.id}`,
    lastModified: prompt.updated_at ? new Date(prompt.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 3. Dynamic profile routes (creators who have active public prompts)
  const { data: profiles } = await supabase
    .from("profiles")
    .select("username")
    .limit(500);

  const profileRoutes: MetadataRoute.Sitemap = (profiles || []).map((profile) => ({
    url: `${SITE_URL}/profile/${profile.username}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...promptRoutes, ...profileRoutes];
}
