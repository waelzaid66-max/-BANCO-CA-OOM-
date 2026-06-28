import { describe, it, expect, afterAll } from "vitest";
import { eq, inArray } from "drizzle-orm";
import {
  createIntermediary,
  listIntermediaries,
  updateIntermediary,
  updateFinancingRequest,
} from "./FinancingService";
import { db, createUser, deleteUsers, uniq, randomUUID } from "../__tests__/helpers";
import { listings, leadHistory, financingRequests, financingIntermediaries } from "@workspace/db/schema";

/**
 * FinancingService is the untested bank-financing CRM: the intermediary directory
 * and the finance-request pipeline. Covers intermediary CRUD, the upsert +
 * intermediary assignment on a real finance_request lead, and the validation
 * guards (non-finance/unknown lead, unknown intermediary).
 */
const uids: string[] = [];
const leadIds: string[] = [];
const listingIds: string[] = [];
const imIds: string[] = [];

async function financeLead(): Promise<string> {
  const seller = await createUser();
  uids.push(seller);
  const listingId = randomUUID();
  await db.insert(listings).values({
    id: listingId,
    userId: seller,
    title: uniq("fin-listing"),
    category: "car",
    status: "active",
    basePriceCash: "500000",
    location: "Cairo",
  });
  listingIds.push(listingId);
  const leadId = randomUUID();
  await db.insert(leadHistory).values({
    id: leadId,
    listingId,
    sellerId: seller,
    actionType: "finance_request",
  });
  leadIds.push(leadId);
  return leadId;
}

afterAll(async () => {
  if (leadIds.length) {
    await db.delete(financingRequests).where(inArray(financingRequests.leadId, leadIds));
    // leadHistory.sellerId → users has no cascade, so remove leads before users.
    await db.delete(leadHistory).where(inArray(leadHistory.id, leadIds));
  }
  for (const id of listingIds) await db.delete(listings).where(eq(listings.id, id));
  for (const id of imIds) await db.delete(financingIntermediaries).where(eq(financingIntermediaries.id, id));
  await deleteUsers(...uids);
});

describe("FinancingService — intermediary directory", () => {
  it("creates, lists, and updates an intermediary", async () => {
    const admin = await createUser();
    uids.push(admin);

    const created = await createIntermediary({
      name: uniq("Bank Partner"),
      contactEmail: "partner@bank.test",
      adminUserId: admin,
    });
    imIds.push(created.id);
    expect(created.is_active).toBe(true);
    expect(created.contact_email).toBe("partner@bank.test");

    const list = await listIntermediaries();
    expect(list.some((i) => i.id === created.id)).toBe(true);

    const updated = await updateIntermediary({
      id: created.id,
      name: "Renamed Partner",
      isActive: false,
      adminUserId: admin,
    });
    expect(updated.name).toBe("Renamed Partner");
    expect(updated.is_active).toBe(false);
  });
});

describe("FinancingService — finance-request pipeline", () => {
  it("upserts status + assigns an intermediary, then updates idempotently", async () => {
    const admin = await createUser();
    uids.push(admin);
    const leadId = await financeLead();
    const im = await createIntermediary({ name: uniq("IM"), adminUserId: admin });
    imIds.push(im.id);

    const r = await updateFinancingRequest({
      leadId,
      status: "forwarded",
      intermediaryId: im.id,
      notes: "call the client",
      adminUserId: admin,
    });
    expect(r.lead_id).toBe(leadId);
    expect(r.status).toBe("forwarded");
    expect(r.intermediary_id).toBe(im.id);
    expect(r.assigned_at).not.toBeNull();
    expect(r.notes).toBe("call the client");

    // Second update upserts the same row (no duplicate), changing only status.
    const r2 = await updateFinancingRequest({ leadId, status: "closed", adminUserId: admin });
    expect(r2.status).toBe("closed");
    expect(r2.intermediary_id).toBe(im.id); // unchanged (not passed)

    const rows = await db.select().from(financingRequests).where(eq(financingRequests.leadId, leadId));
    expect(rows).toHaveLength(1);
  });

  it("rejects an unknown/non-finance lead and an unknown intermediary", async () => {
    const admin = await createUser();
    uids.push(admin);

    await expect(
      updateFinancingRequest({ leadId: randomUUID(), status: "new", adminUserId: admin }),
    ).rejects.toThrow(/not found/i);

    const leadId = await financeLead();
    await expect(
      updateFinancingRequest({ leadId, intermediaryId: randomUUID(), adminUserId: admin }),
    ).rejects.toThrow(/not found/i);
  });
});
