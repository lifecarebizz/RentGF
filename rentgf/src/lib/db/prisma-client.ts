// Prisma client stub using in-memory mock data
// Replace with PrismaClient when production DB is connected

let idCounter = 0;
function genId() { return `id_${Date.now()}_${++idCounter}`; }

const store: Record<string, any[]> = {
  users: [], companions: [], bookings: [], payments: [], messages: [], conversations: [], notifications: [], reviews: [], favorites: [], announcements: [],
};

function resolveWhere(where: any): (item: any) => boolean {
  if (!where) return () => true;
  return (item: any) => {
    for (const [k, v] of Object.entries(where)) {
      if (typeof v === "object" && v !== null) {
        const v2 = v as any;
        if (v2.in) { if (!v2.in.includes(item[k])) return false; }
        else if (v2.gte) { if (item[k] < v2.gte) return false; }
        else if (v2.lt) { if (item[k] >= v2.lt) return false; }
        else if (v2.startsWith) { if (!String(item[k]).startsWith(v2.startsWith)) return false; }
        else if (v2.contains) { if (!String(item[k]).includes(v2.contains)) return false; }
      } else if (item[k] !== v) return false;
    }
    return true;
  };
}

const handler = {
  findUnique: async (args?: any) => {
    const where = typeof args === "string" ? { id: args } : args?.where;
    return store[handler._table].find(resolveWhere(where));
  },
  findMany: async (args?: any) => {
    let data = [...store[handler._table]];
    if (args?.where) data = data.filter(resolveWhere(args.where));
    if (args?.orderBy) { const f = Object.keys(args.orderBy)[0]; const d = args.orderBy[f] === "desc" ? -1 : 1; data.sort((a: any, b: any) => (a[f] > b[f] ? 1 : -1) * d); }
    if (args?.skip) data = data.slice(args.skip);
    if (args?.take) data = data.slice(0, args.take);
    return data;
  },
  count: async (args?: any) => {
    let data = [...store[handler._table]];
    if (args?.where) data = data.filter(resolveWhere(args.where));
    return data.length;
  },
  create: async (data: any) => { const item = { ...data, id: genId(), createdAt: new Date() }; store[handler._table].push(item); return item; },
  update: async (args: any) => { const i = store[handler._table].findIndex((item: any) => item.id === args.where?.id); if (i >= 0) { store[handler._table][i] = { ...store[handler._table][i], ...args.data }; return store[handler._table][i]; } return null; },
  delete: async (args: any) => { const i = store[handler._table].findIndex((item: any) => item.id === args?.where?.id || item.id === args); if (i >= 0) return store[handler._table].splice(i, 1)[0]; return null; },
  upsert: async (args: any) => { const existing = store[handler._table].find((item: any) => item.id === args.where?.id); if (existing) { Object.assign(existing, args.update); return existing; } const item = { ...args.create, id: args.create?.id || genId(), createdAt: new Date() }; store[handler._table].push(item); return item; },
  updateMany: async (args: any) => { let count = 0; store[handler._table] = store[handler._table].map((item: any) => { if (resolveWhere(args.where)(item)) { count++; return { ...item, ...args.data }; } return item; }); return { count }; },
  deleteMany: async (args: any) => { const before = store[handler._table].length; store[handler._table] = store[handler._table].filter((item: any) => !resolveWhere(args.where)(item)); return { count: before - store[handler._table].length }; },
  aggregate: async (args: any) => { const data = [...store[handler._table]]; if (args?.where) { const filtered = data.filter(resolveWhere(args.where)); const result: any = {}; if (args._sum) { for (const k of Object.keys(args._sum)) { if (args._sum[k]) { result[k] = filtered.reduce((s: any, item: any) => s + (item[k] || 0), 0); } } } return result; } return {}; },
  groupBy: async (args: any) => { return []; },
  findFirst: async (args: any) => { const data = [...store[handler._table]]; if (args?.where) { const found = data.find(resolveWhere(args.where)); if (found) return found; } return null; },
  _table: "",
};

function makeModel(tableName: string) {
  return { ...handler, _table: tableName };
}

export const prisma = {
  user: makeModel("users"),
  customerProfile: makeModel("users"),
  companionProfile: makeModel("companions"),
  verificationDocument: makeModel("companions"),
  city: makeModel("cities"),
  category: makeModel("categories"),
  interest: makeModel("interests"),
  favorite: makeModel("favorites"),
  booking: makeModel("bookings"),
  payment: makeModel("payments"),
  accessEntitlement: makeModel("access_entitlements"),
  discount: makeModel("discounts"),
  platformSetting: makeModel("platform_settings"),
  earnings: makeModel("earnings"),
  payout: makeModel("payouts"),
  conversation: makeModel("conversations"),
  conversationParticipant: makeModel("conversation_participants"),
  message: makeModel("messages"),
  review: makeModel("reviews"),
  report: makeModel("reports"),
  block: makeModel("blocks"),
  notification: makeModel("notifications"),
  faq: makeModel("faqs"),
  contentPage: makeModel("content_pages"),
  announcement: makeModel("announcements"),
  auditLog: makeModel("audit_logs"),
  tempToken: makeModel("temp_tokens"),
  refreshToken: makeModel("refresh_tokens"),
  $transaction: async <T>(cb: (prisma: any) => Promise<T>) => cb({ user: prisma.user, booking: prisma.booking, payment: prisma.payment, message: prisma.message, notification: prisma.notification, conversation: prisma.conversation, review: prisma.review, companionProfile: prisma.companionProfile, favorite: prisma.favorite }),
  $connect: async () => {},
  $disconnect: async () => {},
};
