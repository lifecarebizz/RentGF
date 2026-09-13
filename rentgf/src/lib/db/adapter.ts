// Database abstraction layer - ready for Prisma/other DB connection
// When production DB is connected, replace with PrismaClient

export interface DBAdapter {
  user: {
    findUnique: (id: string) => Promise<any>;
    findMany: (args?: any) => Promise<any[]>;
    count: (args?: any) => Promise<number>;
    create: (data: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  companion: {
    findUnique: (id: string) => Promise<any>;
    findMany: (args?: any) => Promise<any[]>;
    count: (args?: any) => Promise<number>;
    create: (data: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };
  booking: {
    findMany: (args?: any) => Promise<any[]>;
    findUnique: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    count: (args?: any) => Promise<number>;
  };
  payment: {
    findMany: (args?: any) => Promise<any[]>;
    findUnique: (id: string) => Promise<any>;
    create: (data: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };
  message: {
    findMany: (args?: any) => Promise<any[]>;
    create: (data: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };
  notification: {
    findMany: (args?: any) => Promise<any[]>;
    create: (data: any) => Promise<any>;
    update: (args: any) => Promise<any>;
    count: (args?: any) => Promise<number>;
  };
  review: {
    findMany: (args?: any) => Promise<any[]>;
    create: (data: any) => Promise<any>;
    count: (args?: any) => Promise<number>;
  };
  conversation: {
    findMany: (args?: any) => Promise<any[]>;
    create: (data: any) => Promise<any>;
  };
}

// In-memory data store for development
const store: Record<string, any[]> = {
  users: [],
  companions: [],
  bookings: [],
  payments: [],
  messages: [],
  conversations: [],
  notifications: [],
  reviews: [],
  favorites: [],
};

let idCounter = 0;
function genId() { return `id_${Date.now()}_${++idCounter}`; }

export const mockDB: DBAdapter = {
  user: {
    findUnique: async (id: string) => store.users.find((u: any) => u.id === id),
    findMany: async (args?: any) => {
      let data = [...store.users];
      if (args?.where) {
        for (const [key, val] of Object.entries(args.where)) {
          data = data.filter((u: any) => u[key] === val);
        }
      }
      if (args?.skip) data = data.slice(args.skip);
      if (args?.take) data = data.slice(0, args.take);
      return data;
    },
    count: async (args?: any) => store.users.length,
    create: async (data: any) => {
      const user = { ...data, id: genId(), createdAt: new Date() };
      store.users.push(user);
      return user;
    },
    update: async (args: any) => {
      const idx = store.users.findIndex((u: any) => u.id === args.where.id);
      if (idx >= 0) { store.users[idx] = { ...store.users[idx], ...args.data }; return store.users[idx]; }
      return null;
    },
    delete: async (id: string) => {
      const idx = store.users.findIndex((u: any) => u.id === id);
      if (idx >= 0) return store.users.splice(idx, 1)[0];
      return null;
    },
  },
  companion: {
    findUnique: async (id: string) => store.companions.find((c: any) => c.id === id || c.userId === id),
    findMany: async (args?: any) => {
      let data = [...store.companions];
      if (args?.skip) data = data.slice(args.skip);
      if (args?.take) data = data.slice(0, args.take);
      return data;
    },
    count: async () => store.companions.length,
    create: async (data: any) => {
      const c = { ...data, id: genId(), createdAt: new Date() };
      store.companions.push(c);
      return c;
    },
    update: async (args: any) => {
      const idx = store.companions.findIndex((c: any) => c.id === args.where.id || c.userId === args.where.id);
      if (idx >= 0) { store.companions[idx] = { ...store.companions[idx], ...args.data }; return store.companions[idx]; }
      return null;
    },
  },
  booking: {
    findMany: async (args?: any) => {
      let data = [...store.bookings];
      if (args?.skip) data = data.slice(args.skip);
      if (args?.take) data = data.slice(0, args.take);
      if (args?.orderBy) {
        const field = Object.keys(args.orderBy)[0];
        const dir = args.orderBy[field] === "desc" ? -1 : 1;
        data.sort((a: any, b: any) => (a[field] > b[field] ? 1 : -1) * dir);
      }
      return data;
    },
    findUnique: async (id: string) => store.bookings.find((b: any) => b.id === id),
    create: async (data: any) => {
      const b = { ...data, id: genId(), createdAt: new Date() };
      store.bookings.push(b);
      return b;
    },
    update: async (args: any) => {
      const idx = store.bookings.findIndex((b: any) => b.id === args.where.id);
      if (idx >= 0) { store.bookings[idx] = { ...store.bookings[idx], ...args.data }; return store.bookings[idx]; }
      return null;
    },
    count: async () => store.bookings.length,
  },
  payment: {
    findMany: async (args?: any) => store.payments.filter((p: any) => !args?.where || p.userId === args.where.userId),
    findUnique: async (id: string) => store.payments.find((p: any) => p.id === id),
    create: async (data: any) => {
      const p = { ...data, id: genId(), createdAt: new Date() };
      store.payments.push(p);
      return p;
    },
    update: async (args: any) => {
      const idx = store.payments.findIndex((p: any) => p.id === args.where.id);
      if (idx >= 0) { store.payments[idx] = { ...store.payments[idx], ...args.data }; return store.payments[idx]; }
      return null;
    },
  },
  message: {
    findMany: async (args?: any) => {
      let data = [...store.messages];
      if (args?.where?.conversationId) data = data.filter((m: any) => m.conversationId === args.where.conversationId);
      if (args?.orderBy) {
        const field = Object.keys(args.orderBy)[0];
        const dir = args.orderBy[field] === "desc" ? -1 : 1;
        data.sort((a: any, b: any) => (a[field] > b[field] ? 1 : -1) * dir);
      }
      if (args?.take) data = data.slice(0, args.take);
      return data;
    },
    create: async (data: any) => {
      const m = { ...data, id: genId(), isRead: false, createdAt: new Date() };
      store.messages.push(m);
      return m;
    },
    update: async (args: any) => {
      const idx = store.messages.findIndex((m: any) => m.id === args.where.id);
      if (idx >= 0) { store.messages[idx] = { ...store.messages[idx], ...args.data }; return store.messages[idx]; }
      return null;
    },
  },
  conversation: {
    findMany: async (args?: any) => {
      let data = [...store.conversations];
      if (args?.skip) data = data.slice(args.skip);
      if (args?.take) data = data.slice(0, args.take);
      return data;
    },
    create: async (data: any) => {
      const c = { ...data, id: genId(), createdAt: new Date(), updatedAt: new Date(), participants: data.participants || [] };
      store.conversations.push(c);
      return c;
    },
  },
  notification: {
    findMany: async (args?: any) => {
      let data = [...store.notifications];
      if (args?.where?.userId) data = data.filter((n: any) => n.userId === args.where.userId);
      if (args?.skip) data = data.slice(args.skip);
      if (args?.take) data = data.slice(0, args.take);
      return data;
    },
    create: async (data: any) => {
      const n = { ...data, id: genId(), isRead: false, createdAt: new Date() };
      store.notifications.push(n);
      return n;
    },
    update: async (args: any) => {
      const idx = store.notifications.findIndex((n: any) => n.id === args.where.id);
      if (idx >= 0) { store.notifications[idx] = { ...store.notifications[idx], ...args.data }; return store.notifications[idx]; }
      return null;
    },
    count: async (args?: any) => {
      let data = [...store.notifications];
      if (args?.where?.userId) data = data.filter((n: any) => n.userId === args.where.userId);
      if (args?.where?.isRead !== undefined) data = data.filter((n: any) => n.isRead === args.where.isRead);
      return data.length;
    },
  },
  review: {
    findMany: async (args?: any) => {
      let data = [...store.reviews];
      if (args?.where?.revieweeId) data = data.filter((r: any) => r.revieweeId === args.where.revieweeId);
      return data;
    },
    create: async (data: any) => {
      const r = { ...data, id: genId(), isVerified: false, createdAt: new Date() };
      store.reviews.push(r);
      return r;
    },
    count: async () => store.reviews.length,
  },
};
