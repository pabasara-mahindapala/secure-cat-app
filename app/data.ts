////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Remix, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { matchSorter } from "match-sorter";
// @ts-expect-error - no types, but it's a tiny function
import sortBy from "sort-by";
import invariant from "tiny-invariant";

type CatMutation = {
  id?: string;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
};

export type CatRecord = CatMutation & {
  id: string;
  createdAt: string;
};

////////////////////////////////////////////////////////////////////////////////
// This is just a fake DB table. In a real app you'd be talking to a real db or
// fetching from an existing API.
const fakeCats = {
  records: {} as Record<string, CatRecord>,

  async getAll(): Promise<CatRecord[]> {
    return Object.keys(fakeCats.records)
      .map((key) => fakeCats.records[key])
      .sort(sortBy("-createdAt", "last"));
  },

  async get(id: string): Promise<CatRecord | null> {
    return fakeCats.records[id] || null;
  },

  async create(values: CatMutation): Promise<CatRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newCat = { id, createdAt, ...values };
    fakeCats.records[id] = newCat;
    return newCat;
  },

  async set(id: string, values: CatMutation): Promise<CatRecord> {
    const cat = await fakeCats.get(id);
    invariant(cat, `No cat found for ${id}`);
    const updatedCat = { ...cat, ...values };
    fakeCats.records[id] = updatedCat;
    return updatedCat;
  },

  destroy(id: string): null {
    delete fakeCats.records[id];
    return null;
  },
};

////////////////////////////////////////////////////////////////////////////////
// Handful of helper functions to be called from route loaders and actions
export async function getCats(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let cats = await fakeCats.getAll();
  if (query) {
    cats = matchSorter(cats, query, {
      keys: ["first", "last"],
    });
  }
  return cats.sort(sortBy("last", "createdAt"));
}

export async function createEmptyCat() {
  const cat = await fakeCats.create({});
  return cat;
}

export async function getCat(id: string) {
  return fakeCats.get(id);
}

export async function updateCat(id: string, updates: CatMutation) {
  const cat = await fakeCats.get(id);
  if (!cat) {
    throw new Error(`No cat found for ${id}`);
  }
  await fakeCats.set(id, { ...cat, ...updates });
  return cat;
}

export async function deleteCat(id: string) {
  fakeCats.destroy(id);
}

[
  {
    avatar:
      "https://cdn2.thecatapi.com/images/a1o.jpg",
    first: "Cat",
    last: "Erpillar",
    twitter: "@caterpillar",
    notes: "Thinks that he'll become a butterfly one day",
  },
  {
    avatar:
      "https://cdn2.thecatapi.com/images/68j.jpg",
    first: "Cat",
    last: "Astrophe",
    twitter: "@catastrophe",
  },
  {
    avatar:
      "https://cdn2.thecatapi.com/images/a1r.jpg",
    first: "Cat",
    last: "Alyst",
    notes: "Always starts things",
  },
  {
    avatar:
      "https://cdn2.thecatapi.com/images/at3.jpg",
    first: "Cat",
    last: "Alog",
    twitter: "@catalog",
  },
  {
    avatar:
      "https://cdn2.thecatapi.com/images/9pk.jpg",
    first: "Cat",
    last: "Amaran",
    twitter: "@catamaran",
  },
  {
    avatar:
      "https://cdn2.thecatapi.com/images/7je.jpg",
    first: "Cat",
    last: "Atonic",
  },
  {
    avatar:
      "https://cdn2.thecatapi.com/images/a2b.jpg",
    first: "Cat",
    last: "Hedral",
    twitter: "@cathedral",
    notes: "Very religious",
  },
  {
    avatar:
      "https://cdn2.thecatapi.com/images/a5.jpg",
    first: "Cat",
    last: "Nip",
    twitter: "@catnip",
  },
  {
    avatar:
      "https://cdn2.thecatapi.com/images/165ok6ESN.jpg",
    first: "Cat",
    last: "Acomb",
    twitter: "@catacomb",
  },
  {
    avatar:
      "https://cdn2.thecatapi.com/images/85j.jpg",
    first: "Cat",
    last: "Apult",
    twitter: "@catapult",
  },
  {
    avatar:
      "https://cdn2.thecatapi.com/images/9ej.jpg",
    first: "Cat",
    last: "Erer",
    twitter: "@caterer",
    notes: "Brings you food",
  },
  {
    avatar:
      "https://cdn2.thecatapi.com/images/bcp.jpg",
    first: "Cat",
    last: "Heter",
  },
].forEach((cat) => {
  fakeCats.create({
    ...cat,
    id: `${cat.first.toLowerCase()}-${cat.last.toLocaleLowerCase()}`,
  });
});
