import "server-only";

import { PROFILE, brandGroups, posters, albums } from "@/components/data";
import type { BrandGroup, Poster, Album } from "@/components/data";
import { publicClient, isSupabaseConfigured } from "./supabase";

export type ProfileData = typeof PROFILE;

export type ContentData = {
  profile: ProfileData;
  brandGroups: BrandGroup[];
  posters: Poster[];
  albums: Album[];
};

const defaults: ContentData = { profile: PROFILE, brandGroups, posters, albums };

function normalize(data: Record<string, unknown>): ContentData {
  const profile = { ...PROFILE, ...(data.profile as Partial<ProfileData>) };
  const groups = Array.isArray(data.brandGroups)
    ? (data.brandGroups as BrandGroup[])
    : brandGroups;
  const p = Array.isArray(data.posters) ? (data.posters as Poster[]) : posters;
  const al = Array.isArray(data.albums) ? (data.albums as Album[]) : albums;
  return { profile, brandGroups: groups, posters: p, albums: al };
}

export async function getContent(): Promise<ContentData> {
  if (!isSupabaseConfigured()) return defaults;

  try {
    const supabase = publicClient();
    const { data, error } = await supabase
      .from("portfolio_content")
      .select("data")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data?.data) return defaults;
    return normalize(data.data);
  } catch {
    return defaults;
  }
}
