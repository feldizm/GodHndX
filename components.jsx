// Shared components for the prototype
const { useState, useEffect, useMemo, useRef } = React;

// Inline icon component — small set, no external lib
const Icon = ({ name, size = 18 }) => {
  const s = size;
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
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
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4M12 17h.01"/></svg>;
    case "back":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="m15 18-6-6 6-6"/></svg>;
    case "right":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="m9 18 6-6-6-6"/></svg>;
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
    case "mobile":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>;
    case "tablet":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M11 18h2"/></svg>;
    case "desktop":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;
    case "mail":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>;
    case "globe":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>;
    case "heart":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/></svg>;
    case "mind":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M12 2a4 4 0 0 0-4 4v2a4 4 0 0 0-2 7.46V19a3 3 0 0 0 6 0v-1"/><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1 2 7.46V19a3 3 0 0 1-6 0"/></svg>;
    case "leaf":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M11 20A7 7 0 0 1 4 13a7 7 0 0 1 7-7h9v9a7 7 0 0 1-7 7Z"/><path d="M4 13c4-1 9-3 12-6"/></svg>;
    case "spark":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3"/></svg>;
    case "flag":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M4 22V4a2 2 0 0 1 2-2h12l-3 5 3 5H6"/></svg>;
    case "people":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1M15 20v-1a3 3 0 0 1 2-2.83"/></svg>;
    case "ear":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 4-6 9a3.5 3.5 0 1 1-7 0"/></svg>;
    case "keyboard":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/></svg>;
    case "eye":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "type":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M4 7V5h16v2M9 19h6M12 5v14"/></svg>;
    case "wifi-off":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="m2 2 20 20M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a11 11 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a16 16 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/></svg>;
    case "brain":
      return <svg width={s} height={s} viewBox="0 0 24 24" {...stroke}><path d="M9.5 2a3.5 3.5 0 0 0-3.5 3.5v0a3.5 3.5 0 0 0-2 6.32A3.5 3.5 0 0 0 6 18.5a3.5 3.5 0 0 0 6 .5v-17a3.5 3.5 0 0 0-2.5-1ZM14.5 2a3.5 3.5 0 0 1 3.5 3.5v0a3.5 3.5 0 0 1 2 6.32A3.5 3.5 0 0 1 18 18.5a3.5 3.5 0 0 1-6 .5"/></svg>;
    default:
      return null;
  }
};

// Sticky crisis strip at top of header
const CrisisStrip = () => (
  <div className="crisis-strip" role="region" aria-label="Crisis support">
    <Icon name="alert" size={16} />
    <span><strong>In crisis right now?</strong> Call <a href="tel:111">NHS 24 · 111</a> · Text SHOUT to <a href="sms:85258&body=SHOUT">85258</a> · <a href="tel:999">999</a> if life is in danger.</span>
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
        <h4>About this library</h4>
        <p>A free, public directory of mental health and addiction services across Scotland. {window.APP_DATA?.services?.length || 0}+ services indexed across 14 NHS boards and 30 Alcohol & Drug Partnerships. Current as of May 2026.</p>
        <p className="muted" style={{ fontSize: 13 }}>Sources: gov.scot (residential rehab capacity, Oct 2025), all 14 NHS boards, 30 ADPs, Scottish Drug Services Directory, ALISS, SAMH, Penumbra, Cruse, LGBT Health & Wellbeing, Pink Therapy, AA/NA/CA intergroups, NHS chaplaincy networks.</p>
      </div>
      <div>
        <h4>Help us improve</h4>
        <a href="#">Report missing service</a>
        <a href="#">Report broken info</a>
        <a href="#" onClick={(e) => { e.preventDefault(); go("a11y"); }}>Accessibility</a>
      </div>
      <div>
        <h4>Get in touch</h4>
        <a href="mailto:hello@example.scot">hello@example.scot</a>
        <a href="tel:01314960000">0131 496 0000</a>
        <a href="#" onClick={(e) => { e.preventDefault(); go("glossary"); }}>Plain English glossary</a>
      </div>
    </div>
  </footer>
);

const MobileCrisisBar = () => (
  <nav className="mobile-crisis-bar" aria-label="Crisis quick-dial">
    <a className="btn btn-emergency" href="tel:999">999</a>
    <a className="btn btn-urgent" href="tel:111">NHS · 111</a>
    <a className="btn btn-safe" href="tel:116123">Samaritans</a>
  </nav>
);

// Service card used on results list
const ServiceCard = ({ service, onOpen }) => (
  <article className="service-card">
    <div className="service-card-head">
      <div>
        <h3>{service.name}</h3>
        <p className="muted" style={{ margin: "4px 0 0", fontSize: 14 }}>{service.coverage}</p>
      </div>
      <span className={`open-pill ${service.openNow ? "open" : "closed"}`}>
        {service.openNow ? "Open now" : "Closed"}
      </span>
    </div>
    <div className="service-meta">
      {service.address && (
        <div className="row"><Icon name="pin" size={16} /><span>{service.address}</span></div>
      )}
      <div className="row"><Icon name="phone" size={16} /><span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{service.phone}</span></div>
      <div className="row"><Icon name="clock" size={16} /><span>{service.hours.today}</span></div>
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

// Tiny SVG-based "map" — pins for any services with lat/lng. Auto-bounds
// to whatever's passed in (with margin) so non-Edinburgh searches still
// show pins. Falls back to a Scotland-wide extent if 0–1 services have coords.
const SCOT_BOUNDS = { minLat: 54.6, maxLat: 60.9, minLng: -7.7, maxLng: -0.7 };
const MapPanel = ({ services, activeId, onPin }) => {
  const geo = services.filter(s => s.lat && s.lng);
  let bounds;
  if (geo.length >= 2) {
    const lats = geo.map(s => s.lat), lngs = geo.map(s => s.lng);
    const padLat = Math.max(0.02, (Math.max(...lats) - Math.min(...lats)) * 0.15);
    const padLng = Math.max(0.03, (Math.max(...lngs) - Math.min(...lngs)) * 0.15);
    bounds = {
      minLat: Math.min(...lats) - padLat, maxLat: Math.max(...lats) + padLat,
      minLng: Math.min(...lngs) - padLng, maxLng: Math.max(...lngs) + padLng,
    };
  } else if (geo.length === 1) {
    const s = geo[0];
    bounds = { minLat: s.lat - 0.05, maxLat: s.lat + 0.05, minLng: s.lng - 0.08, maxLng: s.lng + 0.08 };
  } else {
    bounds = SCOT_BOUNDS;
  }
  const pinFor = (s) => {
    if (!s.lat || !s.lng) return null;
    const x = ((s.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const y = ((bounds.maxLat - s.lat) / (bounds.maxLat - bounds.minLat)) * 100;
    return { x, y };
  };
  const offScreen = services.length - geo.length;
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
      <div className="map-attribution">
        Approximate locations · tap a pin for details
        {offScreen > 0 && ` · ${offScreen} phone/online service${offScreen > 1 ? "s" : ""} not shown`}
      </div>
    </aside>
  );
};

Object.assign(window, {
  Icon, Header, Footer, CrisisStrip, MobileCrisisBar, ServiceCard, MapPanel,
});
