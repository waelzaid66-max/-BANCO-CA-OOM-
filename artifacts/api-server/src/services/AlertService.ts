import { db } from "@workspace/db";
import { savedSearches, companyFollows, users } from "@workspace/db/schema";
import { and, eq, ne, or, isNull, lte, gte } from "drizzle-orm";
import { createNotification } from "./NotificationService";
import { getSaverUserIds } from "./SaveService";

/**
 * AlertService — best-effort, non-blocking dispatch of the two demand-side
 * alerts. Both functions never throw into the caller's request path (the
 * originating action — creating or repricing a listing — must always succeed).
 * createNotification itself already respects per-category mute, so muted users
 * are filtered there.
 */

// Anti-storm: a single saved search is alerted at most once per window, so a
// dealer bulk-publishing inventory can't flood a saver with notifications.
const NEW_MATCH_COOLDOWN_MS = 10 * 60_000;

/**
 * Notify owners of alerts-enabled saved searches whose criteria match a newly
 * created listing. Matching is conservative and REAL: category (when set),
 * price range (when set), and an optional free-text term against the title.
 * Never alerts the seller about their own listing.
 */
export async function notifyNewMatch(listing: {
  id: string;
  category: "car" | "real_estate" | "industrial";
  price: number;
  title: string;
  sellerId: string;
}): Promise<void> {
  try {
    const candidates = await db
      .select()
      .from(savedSearches)
      .where(
        and(
          eq(savedSearches.alertsEnabled, true),
          ne(savedSearches.userId, listing.sellerId),
          or(isNull(savedSearches.category), eq(savedSearches.category, listing.category)),
          or(isNull(savedSearches.priceMin), lte(savedSearches.priceMin, String(listing.price))),
          or(isNull(savedSearches.priceMax), gte(savedSearches.priceMax, String(listing.price))),
        ),
      );

    const now = Date.now();
    const titleLower = listing.title.toLowerCase();

    for (const search of candidates) {
      // Free-text term (if any) must appear in the listing title.
      if (search.query && !titleLower.includes(search.query.trim().toLowerCase())) continue;

      // Per-search cooldown to prevent notification storms.
      const last = search.lastNotifiedListingAt ? search.lastNotifiedListingAt.getTime() : 0;
      if (now - last < NEW_MATCH_COOLDOWN_MS) continue;

      await createNotification({
        userId: search.userId,
        type: "new_match",
        title: "تطابق جديد لبحثك المحفوظ · New saved-search match",
        body: `إعلان جديد يطابق «${search.name}» · A new listing matches "${search.name}"`,
        data: { listing_id: listing.id, saved_search_id: search.id },
      });

      await db
        .update(savedSearches)
        .set({ lastNotifiedListingAt: new Date() })
        .where(eq(savedSearches.id, search.id));
    }
  } catch (err) {
    console.error("[Alert new_match]", err);
  }
}

/**
 * Notify everyone who follows a seller/company when that seller publishes a NEW
 * listing, so a follow actually delivers value (the follow existed but nothing
 * ever fired on a new post). Rides the existing "new_match" type — semantically
 * "a new listing in your interest" — which already deep-links to the listing and
 * honours the per-category mute key. Best-effort, non-blocking; a silent no-op
 * when the seller has no followers, and never alerts the seller themselves.
 */
export async function notifyFollowersOfNewListing(listing: {
  id: string;
  title: string;
  sellerId: string;
}): Promise<void> {
  try {
    const followers = await db
      .select({ followerId: companyFollows.followerId })
      .from(companyFollows)
      .where(eq(companyFollows.companyUserId, listing.sellerId));
    if (followers.length === 0) return;

    const [seller] = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, listing.sellerId))
      .limit(1);
    const who = seller?.name?.trim();
    const title = who
      ? `إعلان جديد من ${who} · New listing from ${who}`
      : "إعلان جديد ممن تتابع · New listing from someone you follow";
    const body = `«${listing.title}» — ممن تتابع · from someone you follow`;

    await Promise.all(
      followers
        .filter((f) => f.followerId !== listing.sellerId)
        .map((f) =>
          createNotification({
            userId: f.followerId,
            type: "new_match",
            title,
            body,
            data: { listing_id: listing.id },
          }).catch(() => {}),
        ),
    );
  } catch (err) {
    console.error("[Alert new_listing_follower]", err);
  }
}

/**
 * Notify every user who saved a listing that its cash price dropped. Real
 * numbers only — old/new price come straight from the update path.
 */
export async function notifyPriceDrop(listing: {
  id: string;
  title: string;
  oldPrice: number;
  newPrice: number;
  sellerId: string;
}): Promise<void> {
  try {
    const saverIds = await getSaverUserIds(listing.id);
    for (const userId of saverIds) {
      if (userId === listing.sellerId) continue;
      await createNotification({
        userId,
        type: "price_drop",
        title: "انخفاض سعر إعلان محفوظ · Price drop",
        body: `انخفض سعر «${listing.title}» · "${listing.title}" dropped in price`,
        data: {
          listing_id: listing.id,
          old_price: listing.oldPrice,
          new_price: listing.newPrice,
        },
      });
    }
  } catch (err) {
    console.error("[Alert price_drop]", err);
  }
}
