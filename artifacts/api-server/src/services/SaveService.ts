import { db } from "@workspace/db";
import { savedListings, users, listings } from "@workspace/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { createNotification } from "./NotificationService";

/**
 * Best-effort: tell the listing owner when someone likes/saves their listing, in
 * the owner's own language. Fire-and-forget — never blocks or fails the save, and
 * self-saves are skipped. No dedicated enum value yet, so it rides "system".
 */
async function notifyOwnerOfSave(saverUserId: string, listingId: string): Promise<void> {
  const [row] = await db
    .select({ ownerId: listings.userId, title: listings.title })
    .from(listings)
    .where(eq(listings.id, listingId))
    .limit(1);
  if (!row || !row.ownerId || row.ownerId === saverUserId) return;
  const ownerId = row.ownerId;
  // Notifications render their stored strings verbatim and there is no per-user
  // language column, so keep the copy bilingual (AR primary market + EN) — the
  // owner sees it correctly whichever language they use.
  await createNotification({
    userId: ownerId,
    type: "system",
    title: "إعجاب جديد بإعلانك ❤️ New like",
    body: `أُعجب أحدهم بإعلانك «${row.title}» · Someone liked your listing`,
    data: { listing_id: listingId },
  });
}

export async function saveOrUnsaveListing(clerkId: string, listingId: string): Promise<{ saved: boolean }> {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user) throw Object.assign(new Error("User not found"), { code: "UNAUTHORIZED" });

  // Toggle the save and keep listings.saves_count in lockstep inside ONE
  // transaction so the denormalized counter never drifts from saved_listings.
  // The counter feeds a modest, log-scaled ranking signal only — it does NOT
  // bump recency, so popularity can lift a listing but never fake "just posted".
  let newlySaved = false;
  const result = await db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ userId: savedListings.userId })
      .from(savedListings)
      .where(and(eq(savedListings.userId, user.id), eq(savedListings.listingId, listingId)))
      .limit(1);

    if (existing) {
      // Gate the decrement on the row this call ACTUALLY removed. Under two
      // concurrent unsaves only one delete matches a row, so only one decrement
      // runs — the counter tracks real membership transitions, never drifts.
      const deleted = await tx
        .delete(savedListings)
        .where(and(eq(savedListings.userId, user.id), eq(savedListings.listingId, listingId)))
        .returning({ userId: savedListings.userId });
      if (deleted.length > 0) {
        await tx
          .update(listings)
          // Floor at 0 belt-and-braces; the gate already prevents over-decrement.
          .set({ savesCount: sql`GREATEST(${listings.savesCount} - 1, 0)` })
          .where(eq(listings.id, listingId));
      }
      return { saved: false };
    }

    // ON CONFLICT DO NOTHING makes a concurrent double-save safe: only the row
    // that is genuinely inserted increments the counter. A lost race returns
    // saved:true (the save IS present) without double-counting.
    const inserted = await tx
      .insert(savedListings)
      .values({ userId: user.id, listingId })
      .onConflictDoNothing({
        target: [savedListings.userId, savedListings.listingId],
      })
      .returning({ userId: savedListings.userId });
    if (inserted.length > 0) {
      await tx
        .update(listings)
        .set({ savesCount: sql`${listings.savesCount} + 1` })
        .where(eq(listings.id, listingId));
      newlySaved = true;
    }
    return { saved: true };
  });

  // Owner ping happens outside the transaction so a slow/failed notification can
  // never delay or roll back the save itself.
  if (newlySaved) {
    void notifyOwnerOfSave(user.id, listingId).catch(() => {});
  }
  return result;
}

export async function getUserSaves(clerkId: string): Promise<string[]> {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user) return [];

  const rows = await db
    .select({ listingId: savedListings.listingId })
    .from(savedListings)
    .where(eq(savedListings.userId, user.id));

  return rows.map((r) => r.listingId);
}

export async function isSaved(clerkId: string, listingId: string): Promise<boolean> {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (!user) return false;

  const [row] = await db
    .select()
    .from(savedListings)
    .where(and(eq(savedListings.userId, user.id), eq(savedListings.listingId, listingId)))
    .limit(1);

  return !!row;
}

/**
 * Returns the db user ids of everyone who has saved a given listing. Used by
 * the price-drop alert dispatch.
 */
export async function getSaverUserIds(listingId: string): Promise<string[]> {
  const rows = await db
    .select({ userId: savedListings.userId })
    .from(savedListings)
    .where(eq(savedListings.listingId, listingId));

  return rows.map((r) => r.userId);
}
