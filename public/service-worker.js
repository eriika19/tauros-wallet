try {
  self['workbox:core:5.1.3'] && _();
} catch (e) {}
const e = (e, ...t) => {
  let s = e;
  return t.length > 0 && (s += ' :: ' + JSON.stringify(t)), s;
};
class t extends Error {
  constructor(t, s) {
    super(e(t, s)), (this.name = t), (this.details = s);
  }
}
try {
  self['workbox:routing:5.1.3'] && _();
} catch (e) {}
const s = e => (e && 'object' == typeof e ? e : { handle: e });
class n {
  constructor(e, t, n = 'GET') {
    (this.handler = s(t)), (this.match = e), (this.method = n);
  }
}
class i extends n {
  constructor(e, t, s) {
    super(
      ({ url: t }) => {
        const s = e.exec(t.href);
        if (s && (t.origin === location.origin || 0 === s.index)) return s.slice(1);
      },
      t,
      s,
    );
  }
}
const r = e =>
  new URL(String(e), location.href).href.replace(new RegExp('^' + location.origin), '');
class a {
  constructor() {
    this.t = new Map();
  }
  get routes() {
    return this.t;
  }
  addFetchListener() {
    self.addEventListener('fetch', e => {
      const { request: t } = e,
        s = this.handleRequest({ request: t, event: e });
      s && e.respondWith(s);
    });
  }
  addCacheListener() {
    self.addEventListener('message', e => {
      if (e.data && 'CACHE_URLS' === e.data.type) {
        const { payload: t } = e.data,
          s = Promise.all(
            t.urlsToCache.map(e => {
              'string' == typeof e && (e = [e]);
              const t = new Request(...e);
              return this.handleRequest({ request: t });
            }),
          );
        e.waitUntil(s), e.ports && e.ports[0] && s.then(() => e.ports[0].postMessage(!0));
      }
    });
  }
  handleRequest({ request: e, event: t }) {
    const s = new URL(e.url, location.href);
    if (!s.protocol.startsWith('http')) return;
    const { params: n, route: i } = this.findMatchingRoute({ url: s, request: e, event: t });
    let r,
      a = i && i.handler;
    if ((!a && this.s && (a = this.s), a)) {
      try {
        r = a.handle({ url: s, request: e, event: t, params: n });
      } catch (e) {
        r = Promise.reject(e);
      }
      return (
        r instanceof Promise &&
          this.i &&
          (r = r.catch(n => this.i.handle({ url: s, request: e, event: t }))),
        r
      );
    }
  }
  findMatchingRoute({ url: e, request: t, event: s }) {
    const n = this.t.get(t.method) || [];
    for (const i of n) {
      let n;
      const r = i.match({ url: e, request: t, event: s });
      if (r)
        return (
          (n = r),
          ((Array.isArray(r) && 0 === r.length) ||
            (r.constructor === Object && 0 === Object.keys(r).length) ||
            'boolean' == typeof r) &&
            (n = void 0),
          { route: i, params: n }
        );
    }
    return {};
  }
  setDefaultHandler(e) {
    this.s = s(e);
  }
  setCatchHandler(e) {
    this.i = s(e);
  }
  registerRoute(e) {
    this.t.has(e.method) || this.t.set(e.method, []), this.t.get(e.method).push(e);
  }
  unregisterRoute(e) {
    if (!this.t.has(e.method))
      throw new t('unregister-route-but-not-found-with-method', { method: e.method });
    const s = this.t.get(e.method).indexOf(e);
    if (!(s > -1)) throw new t('unregister-route-route-not-registered');
    this.t.get(e.method).splice(s, 1);
  }
}
let c;
const o = () => (c || ((c = new a()), c.addFetchListener(), c.addCacheListener()), c);
const u = {
    googleAnalytics: 'googleAnalytics',
    precache: 'precache-v2',
    prefix: 'workbox',
    runtime: 'runtime',
    suffix: 'undefined' != typeof registration ? registration.scope : '',
  },
  h = e => [u.prefix, e, u.suffix].filter(e => e && e.length > 0).join('-'),
  l = e => e || h(u.precache),
  f = e => e || h(u.runtime);
function d(e) {
  e.then(() => {});
}
const w = new Set();
class p {
  constructor(e, t, { onupgradeneeded: s, onversionchange: n } = {}) {
    (this.o = null), (this.u = e), (this.h = t), (this.l = s), (this.p = n || (() => this.close()));
  }
  get db() {
    return this.o;
  }
  async open() {
    if (!this.o)
      return (
        (this.o = await new Promise((e, t) => {
          let s = !1;
          setTimeout(() => {
            (s = !0), t(new Error('The open request was blocked and timed out'));
          }, this.OPEN_TIMEOUT);
          const n = indexedDB.open(this.u, this.h);
          (n.onerror = () => t(n.error)),
            (n.onupgradeneeded = e => {
              s
                ? (n.transaction.abort(), n.result.close())
                : 'function' == typeof this.l && this.l(e);
            }),
            (n.onsuccess = () => {
              const t = n.result;
              s ? t.close() : ((t.onversionchange = this.p.bind(this)), e(t));
            });
        })),
        this
      );
  }
  async getKey(e, t) {
    return (await this.getAllKeys(e, t, 1))[0];
  }
  async getAll(e, t, s) {
    return await this.getAllMatching(e, { query: t, count: s });
  }
  async getAllKeys(e, t, s) {
    return (await this.getAllMatching(e, { query: t, count: s, includeKeys: !0 })).map(e => e.key);
  }
  async getAllMatching(
    e,
    { index: t, query: s = null, direction: n = 'next', count: i, includeKeys: r = !1 } = {},
  ) {
    return await this.transaction([e], 'readonly', (a, c) => {
      const o = a.objectStore(e),
        u = t ? o.index(t) : o,
        h = [],
        l = u.openCursor(s, n);
      l.onsuccess = () => {
        const e = l.result;
        e ? (h.push(r ? e : e.value), i && h.length >= i ? c(h) : e.continue()) : c(h);
      };
    });
  }
  async transaction(e, t, s) {
    return (
      await this.open(),
      await new Promise((n, i) => {
        const r = this.o.transaction(e, t);
        (r.onabort = () => i(r.error)), (r.oncomplete = () => n()), s(r, e => n(e));
      })
    );
  }
  async g(e, t, s, ...n) {
    return await this.transaction([t], s, (s, i) => {
      const r = s.objectStore(t),
        a = r[e].apply(r, n);
      a.onsuccess = () => i(a.result);
    });
  }
  close() {
    this.o && (this.o.close(), (this.o = null));
  }
}
p.prototype.OPEN_TIMEOUT = 2e3;
const y = {
  readonly: ['get', 'count', 'getKey', 'getAll', 'getAllKeys'],
  readwrite: ['add', 'put', 'clear', 'delete'],
};
for (const [e, t] of Object.entries(y))
  for (const s of t)
    s in IDBObjectStore.prototype &&
      (p.prototype[s] = async function (t, ...n) {
        return await this.g(s, t, e, ...n);
      });
try {
  self['workbox:expiration:5.1.3'] && _();
} catch (e) {}
const g = e => {
  const t = new URL(e, location.href);
  return (t.hash = ''), t.href;
};
class m {
  constructor(e) {
    (this.m = e), (this.o = new p('workbox-expiration', 1, { onupgradeneeded: e => this.v(e) }));
  }
  v(e) {
    const t = e.target.result.createObjectStore('cache-entries', { keyPath: 'id' });
    t.createIndex('cacheName', 'cacheName', { unique: !1 }),
      t.createIndex('timestamp', 'timestamp', { unique: !1 }),
      (async e => {
        await new Promise((t, s) => {
          const n = indexedDB.deleteDatabase(e);
          (n.onerror = () => {
            s(n.error);
          }),
            (n.onblocked = () => {
              s(new Error('Delete blocked'));
            }),
            (n.onsuccess = () => {
              t();
            });
        });
      })(this.m);
  }
  async setTimestamp(e, t) {
    const s = { url: (e = g(e)), timestamp: t, cacheName: this.m, id: this.q(e) };
    await this.o.put('cache-entries', s);
  }
  async getTimestamp(e) {
    return (await this.o.get('cache-entries', this.q(e))).timestamp;
  }
  async expireEntries(e, t) {
    const s = await this.o.transaction('cache-entries', 'readwrite', (s, n) => {
        const i = s.objectStore('cache-entries').index('timestamp').openCursor(null, 'prev'),
          r = [];
        let a = 0;
        i.onsuccess = () => {
          const s = i.result;
          if (s) {
            const n = s.value;
            n.cacheName === this.m &&
              ((e && n.timestamp < e) || (t && a >= t) ? r.push(s.value) : a++),
              s.continue();
          } else n(r);
        };
      }),
      n = [];
    for (const e of s) await this.o.delete('cache-entries', e.id), n.push(e.url);
    return n;
  }
  q(e) {
    return this.m + '|' + g(e);
  }
}
class b {
  constructor(e, t = {}) {
    (this.R = !1),
      (this.U = !1),
      (this._ = t.maxEntries),
      (this.L = t.maxAgeSeconds),
      (this.m = e),
      (this.T = new m(e));
  }
  async expireEntries() {
    if (this.R) return void (this.U = !0);
    this.R = !0;
    const e = this.L ? Date.now() - 1e3 * this.L : 0,
      t = await this.T.expireEntries(e, this._),
      s = await self.caches.open(this.m);
    for (const e of t) await s.delete(e);
    (this.R = !1), this.U && ((this.U = !1), d(this.expireEntries()));
  }
  async updateTimestamp(e) {
    await this.T.setTimestamp(e, Date.now());
  }
  async isURLExpired(e) {
    if (this.L) {
      return (await this.T.getTimestamp(e)) < Date.now() - 1e3 * this.L;
    }
    return !1;
  }
  async delete() {
    (this.U = !1), await this.T.expireEntries(1 / 0);
  }
}
const v = (e, t) => e.filter(e => t in e),
  q = async ({ request: e, mode: t, plugins: s = [] }) => {
    const n = v(s, 'cacheKeyWillBeUsed');
    let i = e;
    for (const e of n)
      (i = await e.cacheKeyWillBeUsed.call(e, { mode: t, request: i })),
        'string' == typeof i && (i = new Request(i));
    return i;
  },
  R = async ({ cacheName: e, request: t, event: s, matchOptions: n, plugins: i = [] }) => {
    const r = await self.caches.open(e),
      a = await q({ plugins: i, request: t, mode: 'read' });
    let c = await r.match(a, n);
    for (const t of i)
      if ('cachedResponseWillBeUsed' in t) {
        const i = t.cachedResponseWillBeUsed;
        c = await i.call(t, {
          cacheName: e,
          event: s,
          matchOptions: n,
          cachedResponse: c,
          request: a,
        });
      }
    return c;
  },
  x = async ({
    cacheName: e,
    request: s,
    response: n,
    event: i,
    plugins: a = [],
    matchOptions: c,
  }) => {
    const o = await q({ plugins: a, request: s, mode: 'write' });
    if (!n) throw new t('cache-put-with-no-response', { url: r(o.url) });
    const u = await (async ({ request: e, response: t, event: s, plugins: n = [] }) => {
      let i = t,
        r = !1;
      for (const t of n)
        if ('cacheWillUpdate' in t) {
          r = !0;
          const n = t.cacheWillUpdate;
          if (((i = await n.call(t, { request: e, response: i, event: s })), !i)) break;
        }
      return r || (i = i && 200 === i.status ? i : void 0), i || null;
    })({ event: i, plugins: a, response: n, request: o });
    if (!u) return;
    const h = await self.caches.open(e),
      l = v(a, 'cacheDidUpdate'),
      f = l.length > 0 ? await R({ cacheName: e, matchOptions: c, request: o }) : null;
    try {
      await h.put(o, u);
    } catch (e) {
      throw (
        ('QuotaExceededError' === e.name &&
          (await (async function () {
            for (const e of w) await e();
          })()),
        e)
      );
    }
    for (const t of l)
      await t.cacheDidUpdate.call(t, {
        cacheName: e,
        event: i,
        oldResponse: f,
        newResponse: u,
        request: o,
      });
  },
  U = R,
  L = async ({ request: e, fetchOptions: s, event: n, plugins: i = [] }) => {
    if (
      ('string' == typeof e && (e = new Request(e)), n instanceof FetchEvent && n.preloadResponse)
    ) {
      const e = await n.preloadResponse;
      if (e) return e;
    }
    const r = v(i, 'fetchDidFail'),
      a = r.length > 0 ? e.clone() : null;
    try {
      for (const t of i)
        if ('requestWillFetch' in t) {
          const s = t.requestWillFetch,
            i = e.clone();
          e = await s.call(t, { request: i, event: n });
        }
    } catch (e) {
      throw new t('plugin-error-request-will-fetch', { thrownError: e });
    }
    const c = e.clone();
    try {
      let t;
      t = 'navigate' === e.mode ? await fetch(e) : await fetch(e, s);
      for (const e of i)
        'fetchDidSucceed' in e &&
          (t = await e.fetchDidSucceed.call(e, { event: n, request: c, response: t }));
      return t;
    } catch (e) {
      for (const t of r)
        await t.fetchDidFail.call(t, {
          error: e,
          event: n,
          originalRequest: a.clone(),
          request: c.clone(),
        });
      throw e;
    }
  };
try {
  self['workbox:strategies:5.1.3'] && _();
} catch (e) {}
const T = {
  cacheWillUpdate: async ({ response: e }) => (200 === e.status || 0 === e.status ? e : null),
};
let M;
async function N(e, t) {
  const s = e.clone(),
    n = { headers: new Headers(s.headers), status: s.status, statusText: s.statusText },
    i = t ? t(n) : n,
    r = (function () {
      if (void 0 === M) {
        const e = new Response('');
        if ('body' in e)
          try {
            new Response(e.body), (M = !0);
          } catch (e) {
            M = !1;
          }
        M = !1;
      }
      return M;
    })()
      ? s.body
      : await s.blob();
  return new Response(r, i);
}
try {
  self['workbox:precaching:5.1.3'] && _();
} catch (e) {}
function E(e) {
  if (!e) throw new t('add-to-cache-list-unexpected-type', { entry: e });
  if ('string' == typeof e) {
    const t = new URL(e, location.href);
    return { cacheKey: t.href, url: t.href };
  }
  const { revision: s, url: n } = e;
  if (!n) throw new t('add-to-cache-list-unexpected-type', { entry: e });
  if (!s) {
    const e = new URL(n, location.href);
    return { cacheKey: e.href, url: e.href };
  }
  const i = new URL(n, location.href),
    r = new URL(n, location.href);
  return i.searchParams.set('__WB_REVISION__', s), { cacheKey: i.href, url: r.href };
}
class O {
  constructor(e) {
    (this.m = l(e)), (this.M = new Map()), (this.N = new Map()), (this.O = new Map());
  }
  addToCacheList(e) {
    const s = [];
    for (const n of e) {
      'string' == typeof n ? s.push(n) : n && void 0 === n.revision && s.push(n.url);
      const { cacheKey: e, url: i } = E(n),
        r = 'string' != typeof n && n.revision ? 'reload' : 'default';
      if (this.M.has(i) && this.M.get(i) !== e)
        throw new t('add-to-cache-list-conflicting-entries', {
          firstEntry: this.M.get(i),
          secondEntry: e,
        });
      if ('string' != typeof n && n.integrity) {
        if (this.O.has(e) && this.O.get(e) !== n.integrity)
          throw new t('add-to-cache-list-conflicting-integrities', { url: i });
        this.O.set(e, n.integrity);
      }
      if ((this.M.set(i, e), this.N.set(i, r), s.length > 0)) {
        const e = `Workbox is precaching URLs without revision info: ${s.join(
          ', ',
        )}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
        console.warn(e);
      }
    }
  }
  async install({ event: e, plugins: t } = {}) {
    const s = [],
      n = [],
      i = await self.caches.open(this.m),
      r = await i.keys(),
      a = new Set(r.map(e => e.url));
    for (const [e, t] of this.M) a.has(t) ? n.push(e) : s.push({ cacheKey: t, url: e });
    const c = s.map(({ cacheKey: s, url: n }) => {
      const i = this.O.get(s),
        r = this.N.get(n);
      return this.j({ cacheKey: s, cacheMode: r, event: e, integrity: i, plugins: t, url: n });
    });
    await Promise.all(c);
    return { updatedURLs: s.map(e => e.url), notUpdatedURLs: n };
  }
  async activate() {
    const e = await self.caches.open(this.m),
      t = await e.keys(),
      s = new Set(this.M.values()),
      n = [];
    for (const i of t) s.has(i.url) || (await e.delete(i), n.push(i.url));
    return { deletedURLs: n };
  }
  async j({ cacheKey: e, url: s, cacheMode: n, event: i, plugins: r, integrity: a }) {
    const c = new Request(s, { integrity: a, cache: n, credentials: 'same-origin' });
    let o,
      u = await L({ event: i, plugins: r, request: c });
    for (const e of r || []) 'cacheWillUpdate' in e && (o = e);
    if (!(o ? await o.cacheWillUpdate({ event: i, request: c, response: u }) : u.status < 400))
      throw new t('bad-precaching-response', { url: s, status: u.status });
    u.redirected && (u = await N(u)),
      await x({
        event: i,
        plugins: r,
        response: u,
        request: e === s ? c : new Request(e),
        cacheName: this.m,
        matchOptions: { ignoreSearch: !0 },
      });
  }
  getURLsToCacheKeys() {
    return this.M;
  }
  getCachedURLs() {
    return [...this.M.keys()];
  }
  getCacheKeyForURL(e) {
    const t = new URL(e, location.href);
    return this.M.get(t.href);
  }
  async matchPrecache(e) {
    const t = e instanceof Request ? e.url : e,
      s = this.getCacheKeyForURL(t);
    if (s) {
      return (await self.caches.open(this.m)).match(s);
    }
  }
  createHandler(e = !0) {
    return async ({ request: s }) => {
      try {
        const e = await this.matchPrecache(s);
        if (e) return e;
        throw new t('missing-precache-entry', {
          cacheName: this.m,
          url: s instanceof Request ? s.url : s,
        });
      } catch (t) {
        if (e) return fetch(s);
        throw t;
      }
    };
  }
  createHandlerBoundToURL(e, s = !0) {
    if (!this.getCacheKeyForURL(e)) throw new t('non-precached-url', { url: e });
    const n = this.createHandler(s),
      i = new Request(e);
    return () => n({ request: i });
  }
}
let j;
const k = () => (j || (j = new O()), j);
const F = (e, t) => {
  const s = k().getURLsToCacheKeys();
  for (const n of (function* (
    e,
    { ignoreURLParametersMatching: t, directoryIndex: s, cleanURLs: n, urlManipulation: i } = {},
  ) {
    const r = new URL(e, location.href);
    (r.hash = ''), yield r.href;
    const a = (function (e, t = []) {
      for (const s of [...e.searchParams.keys()])
        t.some(e => e.test(s)) && e.searchParams.delete(s);
      return e;
    })(r, t);
    if ((yield a.href, s && a.pathname.endsWith('/'))) {
      const e = new URL(a.href);
      (e.pathname += s), yield e.href;
    }
    if (n) {
      const e = new URL(a.href);
      (e.pathname += '.html'), yield e.href;
    }
    if (i) {
      const e = i({ url: r });
      for (const t of e) yield t.href;
    }
  })(e, t)) {
    const e = s.get(n);
    if (e) return e;
  }
};
let K = !1;
function P(e) {
  K ||
    ((({
      ignoreURLParametersMatching: e = [/^utm_/],
      directoryIndex: t = 'index.html',
      cleanURLs: s = !0,
      urlManipulation: n,
    } = {}) => {
      const i = l();
      self.addEventListener('fetch', r => {
        const a = F(r.request.url, {
          cleanURLs: s,
          directoryIndex: t,
          ignoreURLParametersMatching: e,
          urlManipulation: n,
        });
        if (!a) return;
        let c = self.caches
          .open(i)
          .then(e => e.match(a))
          .then(e => e || fetch(a));
        r.respondWith(c);
      });
    })(e),
    (K = !0));
}
const D = [],
  C = {
    get: () => D,
    add(e) {
      D.push(...e);
    },
  },
  W = e => {
    const t = k(),
      s = C.get();
    e.waitUntil(
      t.install({ event: e, plugins: s }).catch(e => {
        throw e;
      }),
    );
  },
  H = e => {
    const t = k();
    e.waitUntil(t.activate());
  };
var A;
self.addEventListener('install', () => self.skipWaiting()),
  self.addEventListener('activate', () => self.clients.claim()),
  (A = {}),
  (function (e) {
    k().addToCacheList(e),
      e.length > 0 && (self.addEventListener('install', W), self.addEventListener('activate', H));
  })([
    {
      url: '_next/static/chunks/04cacd42ff50be5c2cce7e0509ecd6cc7f893c5f.e55e070209ae304a5cbd.js',
      revision: '2effc7ff216bd430994e9a5181c10076',
    },
    {
      url: '_next/static/chunks/8804ed50.e05b9cac0aab3e16d0b1.js',
      revision: 'ab8a30273db0b805aedfc8f8566c52dd',
    },
    {
      url: '_next/static/chunks/commons.95b3b880e22a0c02982e.js',
      revision: '762f9871cba0065dd93c1a64bb476ec0',
    },
    {
      url: '_next/static/chunks/framework.96c24fa20c3269268be5.js',
      revision: '8e6204793e3d11a8bedf359bfb6e110d',
    },
    {
      url: '_next/static/chunks/styles.cc85ce5abd05a27f3b56.js',
      revision: 'e449aab2c5cecb026d4c11550aa84db2',
    },
    {
      url: '_next/static/css/8804ed50.b39081a0.chunk.css',
      revision: '476773ffddd8fad867e411c49a0f3ef4',
    },
    {
      url: '_next/static/dFTm3HuUOn0FuMTW18X6s/_buildManifest.js',
      revision: 'fb96ae7926f5104f50f0cf1b3a23a9b5',
    },
    {
      url: '_next/static/dFTm3HuUOn0FuMTW18X6s/_ssgManifest.js',
      revision: 'abee47769bf307639ace4945f9cfd4ff',
    },
    {
      url: '_next/static/dFTm3HuUOn0FuMTW18X6s/pages/_app.js',
      revision: 'c0f964ddf99769a02b6eb643f71cc690',
    },
    {
      url: '_next/static/dFTm3HuUOn0FuMTW18X6s/pages/_error.js',
      revision: 'cdb852be425a6f325007e8e0eede8f1e',
    },
    {
      url: '_next/static/dFTm3HuUOn0FuMTW18X6s/pages/index.js',
      revision: '93ab5f5809095ca52b7cac797a923900',
    },
    {
      url: '_next/static/runtime/main-9e395bb0bae7972d4774.js',
      revision: '8d2e57d7dea6342247c16971f7a20e00',
    },
    {
      url: '_next/static/runtime/polyfills-d6eb965fcdbd5a6e6622.js',
      revision: 'e953c2dc3821c317f6845cac24a2dbdb',
    },
    {
      url: '_next/static/runtime/webpack-6ef28db84b4c42ad34e9.js',
      revision: '40b4095b5b68a142c856f388ccb756f2',
    },
  ]),
  P(A),
  (function (e, s, r) {
    let a;
    if ('string' == typeof e) {
      const t = new URL(e, location.href);
      a = new n(({ url: e }) => e.href === t.href, s, r);
    } else if (e instanceof RegExp) a = new i(e, s, r);
    else if ('function' == typeof e) a = new n(e, s, r);
    else {
      if (!(e instanceof n))
        throw new t('unsupported-route-type', {
          moduleName: 'workbox-routing',
          funcName: 'registerRoute',
          paramName: 'capture',
        });
      a = e;
    }
    o().registerRoute(a);
  })(
    /^https?.*/,
    new (class {
      constructor(e = {}) {
        if (((this.m = f(e.cacheName)), e.plugins)) {
          const t = e.plugins.some(e => !!e.cacheWillUpdate);
          this.k = t ? e.plugins : [T, ...e.plugins];
        } else this.k = [T];
        (this.F = e.networkTimeoutSeconds || 0),
          (this.K = e.fetchOptions),
          (this.P = e.matchOptions);
      }
      async handle({ event: e, request: s }) {
        const n = [];
        'string' == typeof s && (s = new Request(s));
        const i = [];
        let r;
        if (this.F) {
          const { id: t, promise: a } = this.D({ request: s, event: e, logs: n });
          (r = t), i.push(a);
        }
        const a = this.C({ timeoutId: r, request: s, event: e, logs: n });
        i.push(a);
        let c = await Promise.race(i);
        if ((c || (c = await a), !c)) throw new t('no-response', { url: s.url });
        return c;
      }
      D({ request: e, logs: t, event: s }) {
        let n;
        return {
          promise: new Promise(t => {
            n = setTimeout(async () => {
              t(await this.W({ request: e, event: s }));
            }, 1e3 * this.F);
          }),
          id: n,
        };
      }
      async C({ timeoutId: e, request: t, logs: s, event: n }) {
        let i, r;
        try {
          r = await L({ request: t, event: n, fetchOptions: this.K, plugins: this.k });
        } catch (e) {
          i = e;
        }
        if ((e && clearTimeout(e), i || !r)) r = await this.W({ request: t, event: n });
        else {
          const e = r.clone(),
            s = x({ cacheName: this.m, request: t, response: e, event: n, plugins: this.k });
          if (n)
            try {
              n.waitUntil(s);
            } catch (e) {}
        }
        return r;
      }
      W({ event: e, request: t }) {
        return U({
          cacheName: this.m,
          request: t,
          event: e,
          matchOptions: this.P,
          plugins: this.k,
        });
      }
    })({
      cacheName: 'offlineCache',
      plugins: [
        new (class {
          constructor(e = {}) {
            var t;
            (this.cachedResponseWillBeUsed = async ({
              event: e,
              request: t,
              cacheName: s,
              cachedResponse: n,
            }) => {
              if (!n) return null;
              const i = this.H(n),
                r = this.A(s);
              d(r.expireEntries());
              const a = r.updateTimestamp(t.url);
              if (e)
                try {
                  e.waitUntil(a);
                } catch (e) {}
              return i ? n : null;
            }),
              (this.cacheDidUpdate = async ({ cacheName: e, request: t }) => {
                const s = this.A(e);
                await s.updateTimestamp(t.url), await s.expireEntries();
              }),
              (this.S = e),
              (this.L = e.maxAgeSeconds),
              (this.I = new Map()),
              e.purgeOnQuotaError && ((t = () => this.deleteCacheAndMetadata()), w.add(t));
          }
          A(e) {
            if (e === f()) throw new t('expire-custom-caches-only');
            let s = this.I.get(e);
            return s || ((s = new b(e, this.S)), this.I.set(e, s)), s;
          }
          H(e) {
            if (!this.L) return !0;
            const t = this.B(e);
            if (null === t) return !0;
            return t >= Date.now() - 1e3 * this.L;
          }
          B(e) {
            if (!e.headers.has('date')) return null;
            const t = e.headers.get('date'),
              s = new Date(t).getTime();
            return isNaN(s) ? null : s;
          }
          async deleteCacheAndMetadata() {
            for (const [e, t] of this.I) await self.caches.delete(e), await t.delete();
            this.I = new Map();
          }
        })({ maxEntries: 200, purgeOnQuotaError: !0 }),
      ],
    }),
    'GET',
  );
