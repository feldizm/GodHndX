// Shared components — custom iconography, header/footer, service card
const { useState, useEffect, useMemo, useRef } = React;

// Normalize a service website value into a navigable URL.
// Data uses bare hostnames (e.g. "samh.org.uk") but a few entries may
// already include a scheme or path — prefix only when missing.
const externalUrl = (value) => {
  if (!value) return "";
  const trimmed = String(value).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^\/\//.test(trimmed)) return `https:${trimmed}`;
  return `https://${trimmed.replace(/^\/+/, "")}`;
};

// ---------------------------------------------------------------------------
// Postcode -> approximate coordinates
//
// A tiny lookup keyed by Scottish postcode area (the alphabetic prefix). It's
// not a substitute for postcodes.io, but it's offline-safe and good enough
// to filter the directory by "is this within N miles". The coords sit roughly
// in the centre of each area.
const POSTCODE_AREAS = {
  AB: { lat: 57.149, lng: -2.094, name: "Aberdeen" },
  DD: { lat: 56.462, lng: -2.970, name: "Dundee" },
  DG: { lat: 55.071, lng: -3.604, name: "Dumfries" },
  EH: { lat: 55.953, lng: -3.188, name: "Edinburgh" },
  FK: { lat: 56.001, lng: -3.785, name: "Falkirk / Stirling" },
  G:  { lat: 55.864, lng: -4.252, name: "Glasgow" },
  HS: { lat: 58.213, lng: -6.387, name: "Western Isles" },
  IV: { lat: 57.477, lng: -4.224, name: "Inverness" },
  KA: { lat: 55.612, lng: -4.501, name: "Kilmarnock / Ayr" },
  KW: { lat: 58.643, lng: -3.090, name: "Kirkwall / Caithness" },
  KY: { lat: 56.114, lng: -3.156, name: "Kirkcaldy / Fife" },
  ML: { lat: 55.659, lng: -3.785, name: "Motherwell / Lanarkshire" },
  PA: { lat: 55.847, lng: -4.423, name: "Paisley" },
  PH: { lat: 56.395, lng: -3.437, name: "Perth" },
  TD: { lat: 55.605, lng: -2.722, name: "Borders" },
  ZE: { lat: 60.155, lng: -1.146, name: "Shetland" },
};

// Slightly more accurate centres for a handful of common districts (first
// 1–3 chars). Falls back to the area-level lookup above.
const POSTCODE_DISTRICTS = {
  EH1:  { lat: 55.951, lng: -3.190 },
  EH2:  { lat: 55.953, lng: -3.197 },
  EH3:  { lat: 55.957, lng: -3.205 },
  EH8:  { lat: 55.946, lng: -3.175 },
  EH10: { lat: 55.927, lng: -3.213 },
  EH16: { lat: 55.920, lng: -3.139 },
  G1:   { lat: 55.860, lng: -4.250 },
  G2:   { lat: 55.864, lng: -4.260 },
  G3:   { lat: 55.866, lng: -4.281 },
  G12:  { lat: 55.876, lng: -4.299 },
  AB10: { lat: 57.144, lng: -2.110 },
  AB25: { lat: 57.155, lng: -2.117 },
  DD1:  { lat: 56.462, lng: -2.970 },
  IV2:  { lat: 57.471, lng: -4.196 },
  PH1:  { lat: 56.395, lng: -3.437 },
  KY1:  { lat: 56.114, lng: -3.156 },
};

const lookupPostcode = (raw) => {
  if (!raw) return null;
  const code = String(raw).toUpperCase().replace(/\s+/g, "");
  // Try district (first 2-4 chars) by stepping down to the area letters.
  for (let n = Math.min(code.length, 4); n >= 2; n--) {
    const slice = code.slice(0, n);
    if (POSTCODE_DISTRICTS[slice]) return { ...POSTCODE_DISTRICTS[slice], code: slice };
  }
  // Area = the leading letters only (1 or 2).
  const area = (code.match(/^[A-Z]{1,2}/) || [])[0];
  if (area && POSTCODE_AREAS[area]) return { ...POSTCODE_AREAS[area], code: area };
  return null;
};

// Great-circle distance in miles using the Haversine formula.
const milesBetween = (a, b) => {
  if (!a || !b) return null;
  const R = 3958.8;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

// Custom-drawn icons. Category icons are bespoke shapes (life-ring, profile,
// sprig, venn, paper-plane, feather, rings, flame). Utility icons keep a
// consistent 1.5 stroke, 24px viewBox.
const Icon = ({ name, size = 18 }) => {
  const s = size;
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };

  switch (name) {
    /* ---------- Category icons ---------- */
    case "cat-crisis":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke}>
          <circle cx="16" cy="16" r="12" />
          <circle cx="16" cy="16" r="5" />
          <line x1="16" y1="4" x2="16" y2="11" />
          <line x1="16" y1="21" x2="16" y2="28" />
          <line x1="4" y1="16" x2="11" y2="16" />
          <line x1="21" y1="16" x2="28" y2="16" />
        </svg>
      );
    case "cat-mind":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke}>
          <path d="M22 28v-3a4 4 0 0 0-1.2-2.9c1.5-1.6 2.7-3.6 3-5.9.4-3.4-.9-7-3.5-9.3-2-1.9-4.8-3-7.5-2.9-3 .2-5.7 1.8-7.2 4.2-1.4 2.3-1.7 5.2-.7 7.8.6 1.5 1.5 2.9 2.7 4l.4.4V28" />
          <path d="M11 18a4 4 0 0 1 4-4h0a4 4 0 0 1 3 6.7" />
        </svg>
      );
    case "cat-addiction":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke}>
          <path d="M16 28v-9" />
          <path d="M16 19c0-4 3-7 8-7-.5 4-3.5 7-8 7Z" />
          <path d="M16 22c0-3-2-5-6-5 .5 3 2.5 5 6 5Z" />
          <path d="M10 28h12" />
        </svg>
      );
    case "cat-peer":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke}>
          <circle cx="12" cy="16" r="8" />
          <circle cx="20" cy="16" r="8" />
        </svg>
      );
    case "cat-young":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke}>
          <path d="M28 4 4 14l9 4 4 9 11-23Z" />
          <path d="M13 18 28 4" />
        </svg>
      );
    case "cat-bereavement":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke}>
          <path d="M22 4c-7 0-12 5-12 13v9l16-16c2-2 2-6-1-6Z" />
          <path d="M10 26h8" />
          <path d="M14 14h6" />
          <path d="M12 19h6" />
        </svg>
      );
    case "cat-lgbtq":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke}>
          <circle cx="11" cy="16" r="7" />
          <circle cx="21" cy="16" r="7" />
          <path d="M15.5 11c1.5 1 2.5 3 2.5 5s-1 4-2.5 5" />
        </svg>
      );
    case "cat-spiritual":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke}>
          <path d="M16 4c0 4 5 5 5 11a5 5 0 0 1-10 0c0-3 2-4 2-7 0-1-1-2-1-3 1 0 4 .5 4-1Z" />
          <path d="M16 24v4" />
          <path d="M12 28h8" />
        </svg>
      );
    case "cat-advocacy":
      // Shield with check — speaking up / standing alongside
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" {...stroke}>
          <path d="M16 4 6 7v9c0 6 4.5 10 10 12 5.5-2 10-6 10-12V7l-10-3Z" />
          <path d="m12 16 3 3 5-6" />
        </svg>
      );

    /* ---------- Utility icons ---------- */
    case "phone":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.34 1.9.66 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.54 2.81.66A2 2 0 0 1 22 16.92Z"/></svg>;
    case "pin":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "clock":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
    case "users":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "info":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>;
    case "alert":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>;
    case "back":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
    case "right":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
    case "arrow-ne":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M7 17 17 7M8 7h9v9"/></svg>;
    case "copy":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
    case "check":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M20 6 9 17l-5-5"/></svg>;
    case "x":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case "search":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
    case "list":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
    case "map":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
    case "mail":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>;
    case "globe":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>;
    case "ear":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 4-6 9a3.5 3.5 0 1 1-7 0"/></svg>;
    case "keyboard":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/></svg>;
    case "eye":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "wifi-off":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="m2 2 20 20M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a11 11 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a16 16 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>;
    case "brain":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M9.5 2a3.5 3.5 0 0 0-3.5 3.5v0a3.5 3.5 0 0 0-2 6.32A3.5 3.5 0 0 0 6 18.5a3.5 3.5 0 0 0 6 .5v-17a3.5 3.5 0 0 0-2.5-1ZM14.5 2a3.5 3.5 0 0 1 3.5 3.5v0a3.5 3.5 0 0 1 2 6.32A3.5 3.5 0 0 1 18 18.5a3.5 3.5 0 0 1-6 .5"/></svg>;
    case "heart":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>;
    default:
      return null;
  }
};

// Map category id -> icon name
const CATEGORY_ICON = {
  "crisis": "cat-crisis",
  "mental-health": "cat-mind",
  "addiction": "cat-addiction",
  "peer": "cat-peer",
  "young": "cat-young",
  "bereavement": "cat-bereavement",
  "lgbtq": "cat-lgbtq",
  "spiritual": "cat-spiritual",
  "advocacy": "cat-advocacy",
};

const CrisisStrip = () => (
  <div className="crisis-strip" role="region" aria-label="Crisis support">
    <span className="pulse" aria-hidden="true"></span>
    <span><strong>In crisis right now?</strong>&nbsp; Call <a href="tel:111">NHS 24 · 111</a> · Text SHOUT to <a href="sms:85258&body=SHOUT">85258</a> · <a href="tel:999">999</a> if life is in danger.</span>
  </div>
);

const Header = ({ go, route }) => (
  <header className="site-header" role="banner">
    <div className="site-header-row">
      <a className="brand" href="#/" onClick={(e) => { e.preventDefault(); go("home"); }}>
        <div className="brand-mark">S</div>
        <div className="brand-name">
          <small>Scotland</small>
          <strong>Mental Health & Addiction Library</strong>
        </div>
      </a>
      <nav className="site-nav" aria-label="Primary">
        <a href="#/results" onClick={(e) => { e.preventDefault(); go("results"); }}>Find services</a>
        <a href="#/decision" onClick={(e) => { e.preventDefault(); go("decision"); }}>Get guidance</a>
        <a href="#/glossary" onClick={(e) => { e.preventDefault(); go("glossary"); }}>Glossary</a>
        <a href="#/a11y" onClick={(e) => { e.preventDefault(); go("a11y"); }}>Accessibility</a>
      </nav>
    </div>
    <CrisisStrip />
  </header>
);

const Footer = ({ go }) => (
  <footer className="site-foot">
    <div className="row">
      <div>
        <div className="mark">Scotland MH&amp;A Library</div>
        <p>A free, public directory of mental health and addiction services across Scotland. Information current as of May 2026.</p>
        <p className="muted" style={{ fontSize: 13 }}>Sources: gov.scot, NHS boards, 30 Alcohol &amp; Drug Partnerships, ALISS, SAMH, Penumbra, Cruse, LGBT Health &amp; Wellbeing.</p>
      </div>
      <div>
        <h4>Improve this site</h4>
        <a href="#">Report missing service</a>
        <a href="#">Flag outdated info</a>
        <a href="#" onClick={(e) => { e.preventDefault(); go("a11y"); }}>Accessibility</a>
      </div>
      <div>
        <h4>Contact</h4>
        <a href="mailto:hello@example.scot">hello@example.scot</a>
        <a href="#" onClick={(e) => { e.preventDefault(); go("glossary"); }}>Plain English glossary</a>
      </div>
    </div>
  </footer>
);

const MobileCrisisBar = () => (
  <nav className="mobile-crisis-bar" aria-label="Crisis quick-dial">
    <a className="btn btn-emergency" href="tel:999">999</a>
    <a className="btn btn-urgent" href="tel:111">NHS 111</a>
    <a className="btn btn-safe" href="tel:116123">Samaritans</a>
  </nav>
);

const formatMiles = (m) => {
  if (m == null) return null;
  if (m < 1) return `${(m * 10 | 0) / 10} mi`;
  if (m < 10) return `${m.toFixed(1)} mi`;
  return `${Math.round(m)} mi`;
};

const ServiceCard = ({ service, onOpen, distance }) => (
  <article className="service-card">
    <div className="service-card-head">
      <div>
        <h3>{service.name}</h3>
        <p className="muted" style={{ margin: "4px 0 0", fontSize: 14 }}>{service.coverage}</p>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
        {distance != null && (
          <span className="distance-pill" aria-label={`${formatMiles(distance)} from your postcode`}>
            {formatMiles(distance)}
          </span>
        )}
        <span className={`open-pill ${service.openNow ? "open" : "closed"}`}>
          {service.openNow ? "Open now" : "Closed"}
        </span>
      </div>
    </div>
    <div className="service-meta">
      {service.address && (
        <div className="row"><Icon name="pin" size={16} /><span>{service.address}</span></div>
      )}
      <div className="row"><Icon name="phone" size={16} /><span style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>{service.phone}</span></div>
      <div className="row"><Icon name="clock" size={16} /><span>{service.hours?.today}</span></div>
      <div className="row"><Icon name="users" size={16} /><span>Ages {service.ageRange}{service.wait ? ` · Wait ${service.wait}` : ""}</span></div>
    </div>
    <p className="blurb">{service.blurb}</p>
    <div className="actions">
      <a className="btn btn-safe" href={`tel:${(service.phone || "").replace(/\s/g, "")}`}>
        <Icon name="phone" size={16} /> Call now
      </a>
      <button className="btn btn-secondary" onClick={() => onOpen(service.id)}>
        More info <Icon name="right" size={14} />
      </button>
      <button className="btn btn-ghost" onClick={() => navigator.clipboard?.writeText(service.phone)}>
        <Icon name="copy" size={14} /> Copy number
      </button>
    </div>
  </article>
);

const MapPanel = ({ services, activeId, onPin }) => {
  // Auto-fit bounds to the services that have coords (with a small fallback
  // to Edinburgh so the empty state still looks like a map).
  const pinned = services.filter(s => s.lat && s.lng);
  let bounds;
  if (pinned.length === 0) {
    bounds = { minLat: 55.91, maxLat: 55.98, minLng: -3.26, maxLng: -3.13 };
  } else {
    const lats = pinned.map(s => s.lat);
    const lngs = pinned.map(s => s.lng);
    const padLat = Math.max(0.02, (Math.max(...lats) - Math.min(...lats)) * 0.15);
    const padLng = Math.max(0.02, (Math.max(...lngs) - Math.min(...lngs)) * 0.15);
    bounds = {
      minLat: Math.min(...lats) - padLat,
      maxLat: Math.max(...lats) + padLat,
      minLng: Math.min(...lngs) - padLng,
      maxLng: Math.max(...lngs) + padLng,
    };
  }
  const pinFor = (s) => {
    if (!s.lat || !s.lng) return null;
    const x = ((s.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const y = ((bounds.maxLat - s.lat) / (bounds.maxLat - bounds.minLat)) * 100;
    return { x, y };
  };
  return (
    <aside className="map-panel" aria-label="Map of services">
      <div className="map-canvas">
        <div className="map-roads" aria-hidden="true"></div>
        <div className="map-water" aria-hidden="true"></div>
        {services.map((s, i) => {
          const p = pinFor(s);
          if (!p) return null;
          return (
            <button
              key={s.id}
              className={`map-pin ${s.category === "crisis" ? "is-crisis" : ""} ${activeId === s.id ? "active" : ""}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onClick={() => onPin(s.id)}
              aria-label={`${s.name} pin`}
            >
              <span className="pin-head"><span>{i + 1}</span></span>
              {activeId === s.id && <span className="pin-label">{s.name}</span>}
            </button>
          );
        })}
      </div>
      <div className="map-attribution">Approximate locations · tap a pin for details</div>
    </aside>
  );
};

// External finder cards. Deep-link to the authoritative directories with the
// user's postcode prefilled where the target site supports it. Filters by
// category so only the relevant cards show.
const FinderGrid = ({ postcode, category, title = "Search a specialist directory", subtitle, limit }) => {
  const finders = window.APP_DATA.finders || [];
  const filtered = finders.filter(f => {
    if (!category || category === "all") return true;
    return (f.categories || []).includes(category);
  });
  const items = limit ? filtered.slice(0, limit) : filtered;
  if (items.length === 0) return null;

  const resolveUrl = (finder) => {
    if (postcode && finder.urlWithPostcode) {
      return finder.urlWithPostcode.replace("{postcode}", encodeURIComponent(postcode));
    }
    return finder.url;
  };

  return (
    <section className="section">
      <div className="section-title">
        <h2>{title}</h2>
        {subtitle && <span className="hint">{subtitle}</span>}
      </div>
      <div className="finder-grid">
        {items.map(f => (
          <a
            key={f.id}
            className="finder-card"
            href={resolveUrl(f)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="finder-head">
              <span className="finder-scope">{f.scope}</span>
              <span className="finder-reach">{f.reach}</span>
            </div>
            <h3>{f.name}</h3>
            <p>{f.blurb}</p>
            <span className="finder-go">
              {postcode && f.urlWithPostcode
                ? <>Open with <span style={{ fontFamily: "var(--font-mono)" }}>{postcode}</span> <Icon name="arrow-ne" size={14} /></>
                : <>Open directory <Icon name="arrow-ne" size={14} /></>}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

// Maps app category ids to ALISS API category slugs (best-effort; ALISS uses
// loosely structured tag categories so unmatched ids skip the filter).
const ALISS_CATEGORY = {
  "mental-health": "mental-health",
  "addiction": "drugs-and-alcohol",
  "bereavement": "bereavement",
  "peer": "peer-support",
  "young": "young-people",
  "lgbtq": "lgbt",
  "advocacy": "advocacy",
  "spiritual": "spiritual",
};

// AlissPanel — live fetch from aliss.org with graceful fallback. If the API
// is unreachable or the response shape is unexpected, we degrade silently to
// a deep-link CTA so the user can finish the journey on ALISS itself.
const AlissPanel = ({ postcode, category }) => {
  const [state, setState] = useState({ status: "idle", items: [] });
  const origin = useMemo(() => lookupPostcode(postcode), [postcode]);

  useEffect(() => {
    if (!postcode) { setState({ status: "idle", items: [] }); return; }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    setState({ status: "loading", items: [] });

    const params = new URLSearchParams();
    params.set("postcode", postcode);
    params.set("page_size", "20");
    if (category && category !== "all" && ALISS_CATEGORY[category]) {
      params.set("category", ALISS_CATEGORY[category]);
    }
    const url = `https://www.aliss.org/api/v4/services/?${params.toString()}`;

    fetch(url, { signal: controller.signal, headers: { "Accept": "application/json" } })
      .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
      .then(data => {
        const raw = data.data || data.results || data.items || [];
        const items = raw.map(s => {
          const loc = (s.locations && s.locations[0]) || {};
          const lat = loc.latitude ?? loc.lat ?? null;
          const lng = loc.longitude ?? loc.lng ?? null;
          const distance = origin && lat && lng ? milesBetween(origin, { lat, lng }) : null;
          return {
            id: s.id || s.slug || s.name,
            name: s.name,
            description: s.description || s.summary || "",
            phone: s.phone || (s.contacts && s.contacts.phone) || null,
            url: s.url || s.website || null,
            address: loc.formatted_address || loc.address || null,
            postcode: loc.postal_code || loc.postcode || null,
            distance,
          };
        }).filter(x => x.name);
        items.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
        setState({ status: items.length ? "ok" : "empty", items });
      })
      .catch(() => setState({ status: "error", items: [] }))
      .finally(() => clearTimeout(timer));

    return () => { clearTimeout(timer); controller.abort(); };
  }, [postcode, category, origin]);

  if (!postcode) return null;

  const alissDeepLink = `https://www.aliss.org/?postcode=${encodeURIComponent(postcode)}`;

  return (
    <section className="section aliss-section" aria-live="polite">
      <div className="section-title">
        <h2>Live community results · ALISS</h2>
        <a className="hint" href={alissDeepLink} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-2)" }}>
          Open all on aliss.org <Icon name="arrow-ne" size={12} />
        </a>
      </div>

      {state.status === "loading" && (
        <div className="aliss-status">Searching ALISS for services near {postcode}…</div>
      )}

      {state.status === "error" && (
        <div className="aliss-status">
          <p>Couldn&rsquo;t reach ALISS right now. The 1,000+ community services on aliss.org are still searchable directly.</p>
          <a className="btn btn-secondary" href={alissDeepLink} target="_blank" rel="noopener noreferrer">
            Open ALISS for {postcode} <Icon name="arrow-ne" size={14} />
          </a>
        </div>
      )}

      {state.status === "empty" && (
        <div className="aliss-status">
          <p>No ALISS matches for that postcode and filter. Try the full ALISS directory:</p>
          <a className="btn btn-secondary" href={alissDeepLink} target="_blank" rel="noopener noreferrer">
            Open ALISS for {postcode} <Icon name="arrow-ne" size={14} />
          </a>
        </div>
      )}

      {state.status === "ok" && (
        <div className="aliss-list">
          {state.items.map(s => (
            <article className="aliss-card" key={s.id}>
              <div className="aliss-head">
                <h3>{s.name}</h3>
                {s.distance != null && (
                  <span className="distance-pill">{formatMiles(s.distance)}</span>
                )}
              </div>
              {s.address && <p className="muted" style={{ margin: "4px 0", fontSize: 13 }}>{s.address}</p>}
              {s.description && <p className="blurb">{s.description.length > 240 ? s.description.slice(0, 240) + "…" : s.description}</p>}
              <div className="aliss-actions">
                {s.phone && (
                  <a className="btn btn-safe" href={`tel:${(s.phone || "").replace(/\s/g, "")}`}>
                    <Icon name="phone" size={14} /> Call
                  </a>
                )}
                {s.url && (
                  <a className="btn btn-secondary" href={s.url} target="_blank" rel="noopener noreferrer">
                    Open service <Icon name="arrow-ne" size={12} />
                  </a>
                )}
              </div>
            </article>
          ))}
          <p className="muted" style={{ fontSize: 13, marginTop: 12 }}>
            Data from <a href={alissDeepLink} target="_blank" rel="noopener noreferrer">aliss.org</a> — community-curated, refreshed daily.
          </p>
        </div>
      )}
    </section>
  );
};

Object.assign(window, {
  Icon, CATEGORY_ICON, Header, Footer, CrisisStrip, MobileCrisisBar,
  ServiceCard, MapPanel, externalUrl, lookupPostcode, milesBetween, formatMiles,
  FinderGrid, AlissPanel,
});
