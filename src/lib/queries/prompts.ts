import "server-only";

import { TRENDING_WEIGHTS } from "@/lib/constants";
import { createServerSupabaseClient, getCachedAuthUser } from "@/lib/supabase/server";

export type PromptProfile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
};

export type PromptRecord = {
  id: string;
  user_id: string;
  title: string;
  prompt_text: string;
  result_text: string | null;
  category: string;
  tags: string[];
  remix_of: string | null;
  copy_count: number;
  save_count: number;
  view_count: number;
  status: "active" | "hidden" | "deleted";
  created_at: string;
  updated_at: string;
  image_url: string | null;
  thumbnail_url?: string | null;
  profiles: PromptProfile | null;
  votes?: { value: number; user_id: string }[];
  comments?: { id: string }[];
  saved_prompts?: { user_id: string }[];
};

type PromptRow = Omit<PromptRecord, "profiles"> & {
  profiles: PromptProfile | PromptProfile[] | null;
};

export type PromptStats = {
  voteScore: number;
  saveCount: number;
  commentCount: number;
  viewerVote: number | null;
  viewerSaved: boolean;
  trendingScore: number;
  isOwner: boolean;
};

export type PromptWithStats = PromptRecord & PromptStats;

function calculateTrendingScore(prompt: PromptRecord, stats: PromptStats) {
  const ageHours =
    (Date.now() - new Date(prompt.created_at).getTime()) / 36e5;

  return (
    stats.voteScore * TRENDING_WEIGHTS.votes +
    stats.saveCount * TRENDING_WEIGHTS.saves +
    stats.commentCount * TRENDING_WEIGHTS.comments +
    prompt.copy_count * TRENDING_WEIGHTS.copies +
    prompt.view_count * TRENDING_WEIGHTS.views +
    ageHours * TRENDING_WEIGHTS.ageHours
  );
}

function buildPromptStats(prompt: PromptRecord, viewerId?: string): PromptStats {
  const voteScore = prompt.votes?.reduce((sum, vote) => sum + vote.value, 0) ?? 0;
  const saveCount = prompt.save_count ?? 0;
  const commentCount = prompt.comments?.length ?? 0;
  const viewerVote =
    prompt.votes?.find((vote) => vote.user_id === viewerId)?.value ?? null;
  const viewerSaved =
    prompt.saved_prompts?.some((save) => save.user_id === viewerId) ?? false;
  const isOwner = Boolean(viewerId && prompt.user_id === viewerId);

  const base: PromptStats = {
    voteScore,
    saveCount,
    commentCount,
    viewerVote,
    viewerSaved,
    trendingScore: 0,
    isOwner,
  };

  return {
    ...base,
    trendingScore: calculateTrendingScore(prompt, base),
  };
}

function enrichPrompts(prompts: PromptRecord[], viewerId?: string) {
  return prompts.map((prompt) => ({
    ...prompt,
    ...buildPromptStats(prompt, viewerId),
  }));
}

function normalizePrompt(row: PromptRow): PromptRecord {
  return {
    ...row,
    profiles: Array.isArray(row.profiles)
      ? row.profiles[0] ?? null
      : row.profiles ?? null,
  };
}

export async function getPublicFeed({ query, page = 1, limit = 20 }: { query?: string, page?: number, limit?: number } = {}) {
  const supabase = await createServerSupabaseClient();
  const { user } = await getCachedAuthUser();
  const viewerId = user?.id;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let request = supabase
    .from("prompts")
    .select(
      "id, user_id, title, prompt_text, result_text, category, tags, remix_of, copy_count, save_count, view_count, status, created_at, updated_at, image_url, thumbnail_url, profiles!prompts_user_id_fkey(id, username, display_name, avatar_url), votes(value, user_id), comments(id), saved_prompts(user_id)",
      { count: "exact" }
    )
    .eq("visibility", "public")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query) {
    request = request.or(`title.ilike.%${query}%,prompt_text.ilike.%${query}%,category.ilike.%${query}%`);
  }

  const { data, count, error } = await request;

  if (error || !data) {
    return { prompts: [], totalPages: 0 };
  }

  const normalized = (data as PromptRow[]).map(normalizePrompt);
  const totalPages = count ? Math.ceil(count / limit) : 0;
  
  return {
    prompts: enrichPrompts(normalized, viewerId),
    totalPages
  };
}

export async function getPromptById(promptId: string) {
  const supabase = await createServerSupabaseClient();
  const { user } = await getCachedAuthUser();
  const viewerId = user?.id;

  const { data, error } = await supabase
    .from("prompts")
    .select(
      "id, user_id, title, prompt_text, result_text, category, tags, remix_of, copy_count, save_count, view_count, status, created_at, updated_at, image_url, thumbnail_url, profiles!prompts_user_id_fkey(id, username, display_name, avatar_url), votes(value, user_id), comments(id), saved_prompts(user_id)"
    )
    .eq("id", promptId)
    .single();

  if (error) {
    console.error("getPromptById error:", error.message, error.stack, error);
  }

  if (error || !data) {
    return null;
  }

  const normalized = normalizePrompt(data as PromptRow);

  return {
    ...normalized,
    ...buildPromptStats(normalized, viewerId),
  } satisfies PromptWithStats;
}

export async function getPromptsByTag(tag: string) {
  const supabase = await createServerSupabaseClient();
  const { user } = await getCachedAuthUser();
  const viewerId = user?.id;

  const { data, error } = await supabase
    .from("prompts")
    .select(
      "id, user_id, title, prompt_text, result_text, category, tags, remix_of, copy_count, save_count, view_count, status, created_at, updated_at, image_url, thumbnail_url, profiles!prompts_user_id_fkey(id, username, display_name, avatar_url), votes(value, user_id), comments(id), saved_prompts(user_id)"
    )
    .contains("tags", [tag])
    .eq("visibility", "public")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(40);

  if (error || !data) {
    return [] as PromptWithStats[];
  }

  const normalized = (data as PromptRow[]).map(normalizePrompt);
  return enrichPrompts(normalized, viewerId);
}

export async function getTrendingPrompts(page = 1, limit = 20) {
  // Fetch up to 200 recent prompts to calculate trending
  const { prompts } = await getPublicFeed({ limit: 200 });
  
  const sortedPrompts = prompts
    .slice()
    .sort((left, right) => right.trendingScore - left.trendingScore);
    
  const totalPages = Math.ceil(sortedPrompts.length / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    prompts: sortedPrompts.slice(startIndex, endIndex),
    totalPages
  };
}

export async function getSavedPrompts() {
  const supabase = await createServerSupabaseClient();
  const { user } = await getCachedAuthUser();
  const viewerId = user?.id;

  if (!viewerId) {
    return [] as PromptWithStats[];
  }

  const { data, error } = await supabase
    .from("saved_prompts")
    .select(
      "prompt_id, prompts(id, user_id, title, prompt_text, result_text, category, tags, remix_of, copy_count, save_count, view_count, status, created_at, updated_at, image_url, thumbnail_url, profiles!prompts_user_id_fkey(id, username, display_name, avatar_url), votes(value, user_id), comments(id), saved_prompts(user_id))"
    )
    .eq("user_id", viewerId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as PromptWithStats[];
  }

  const prompts = data
    .map((row) => row.prompts)
    .filter(Boolean)
    .map((row) => normalizePrompt(row as unknown as PromptRow));

  return enrichPrompts(prompts, viewerId);
}

export async function getPromptsByUserId(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { user } = await getCachedAuthUser();
  const viewerId = user?.id;

  const { data, error } = await supabase
    .from("prompts")
    .select(
      "id, user_id, title, prompt_text, result_text, category, tags, remix_of, copy_count, save_count, view_count, status, created_at, updated_at, image_url, thumbnail_url, profiles!prompts_user_id_fkey(id, username, display_name, avatar_url), votes(value, user_id), comments(id), saved_prompts(user_id)"
    )
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [] as PromptWithStats[];
  }

  const normalized = (data as PromptRow[]).map(normalizePrompt);
  return enrichPrompts(normalized, viewerId);
}

export async function getPromptsByCategory(category: string, limit = 6) {
  const supabase = await createServerSupabaseClient();
  const { user } = await getCachedAuthUser();
  const viewerId = user?.id;

  const { data, error } = await supabase
    .from("prompts")
    .select(
      "id, user_id, title, prompt_text, result_text, category, tags, remix_of, copy_count, save_count, view_count, status, created_at, updated_at, image_url, thumbnail_url, profiles!prompts_user_id_fkey(id, username, display_name, avatar_url), votes(value, user_id), comments(id), saved_prompts(user_id)"
    )
    .ilike("category", category)
    .eq("visibility", "public")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [] as PromptWithStats[];
  }

  const normalized = (data as PromptRow[]).map(normalizePrompt);
  return enrichPrompts(normalized, viewerId);
}

export async function getPopularTags(limit = 10): Promise<string[]> {
  const supabase = await createServerSupabaseClient();
  
  // Fetch tags from recent active public prompts
  const { data, error } = await supabase
    .from("prompts")
    .select("tags")
    .eq("visibility", "public")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) {
    return [];
  }

  const tagCounts: Record<string, number> = {};
  data.forEach((row) => {
    if (row.tags && Array.isArray(row.tags)) {
      row.tags.forEach((tag) => {
        let t = tag.trim().toLowerCase();
        if (t.startsWith("#")) t = t.slice(1);
        if (t) {
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        }
      });
    }
  });

  // Sort by count descending and return top 'limit' tags
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}
