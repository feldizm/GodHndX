// Landing, Results, Detail pages

const DEFAULT_RADIUS_MILES = 15;
const POSTCODE_RE = /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s*[0-9]?[A-Z]{0,2}$/i;

const LandingPage = ({ go }) => {
  const [postcode, setPostcode] = useState("");
  const [error, setError] = useState("");
  const submit = (e) => {
    e?.preventDefault();
    const value = postcode.trim().toUpperCase();
    if (!value) { setError("Enter a Scottish postcode — e.g. EH8 8DX"); return; }
    if (!POSTCODE_RE.test(value)) { setError("That doesn’t look like a UK postcode."); return; }
    if (!lookupPostcode(value)) { setError("Only Scottish postcodes are supported in this directory."); return; }
    go("results", { postcode: value });
  };
  const emergency = window.APP_DATA.emergency;
  const categories = window.APP_DATA.categories;
  const boards = window.APP_DATA.healthBoards.filter(b => b.id !== "national");
  const allServiceCount = window.APP_DATA.services.length;

  return (
    <div className="page">
      {/* Editorial hero */}
      <section className="hero">
        <div>
          <p className="eyebrow">Free · Confidential · No referral needed</p>
          <h1 className="hero-title">
            Help with your<br />mental health, <em>nearby.</em>
          </h1>
          <p className="hero-sub">
            Search by postcode for crisis lines, NHS services, addiction support and peer meetings across Scotland. You don&rsquo;t need to know what you&rsquo;re looking for — start where you are.
          </p>
        </div>
        <div className="hero-aside">
          <div className="hero-stat">
            <strong>{allServiceCount}+</strong>
            services across all 32 council areas, verified quarterly.
          </div>
          <div className="hero-stat">
            <strong>24/7</strong>
            crisis numbers always one tap away — including offline.
          </div>
          <div className="hero-stat">
            <strong>15 mi</strong>
            default search radius. Crisis lines and national resources always shown.
          </div>
        </div>
      </section>

      {/* Search */}
      <div className="search-block">
        <form className="search" onSubmit={submit}>
          <label className="search-label" htmlFor="postcode">Start here · Your postcode</label>
          <div className="search-row">
            <input
              id="postcode"
              type="text"
              placeholder="EH8 8DX"
              value={postcode}
              onChange={(e) => { setPostcode(e.target.value.toUpperCase()); setError(""); }}
              autoComplete="postal-code"
              inputMode="text"
              spellCheck="false"
              aria-label="Postcode"
              aria-invalid={!!error}
            />
            <button className="btn btn-safe big" type="submit">
              <Icon name="search" size={18} /> Find help near me
            </button>
          </div>
          {error && (
            <p style={{ marginTop: 12, color: "var(--emergency)", fontSize: 14 }}>{error}</p>
          )}
          <div className="search-hint">
            <span className="lbl">Try</span>
            <button type="button" onClick={() => { setPostcode("EH8 8DX"); setError(""); }}>EH8 8DX</button>
            <button type="button" onClick={() => { setPostcode("G2 4JR"); setError(""); }}>G2 4JR</button>
            <button type="button" onClick={() => { setPostcode("AB10"); setError(""); }}>AB10</button>
            <button type="button" onClick={() => { setPostcode("IV2"); setError(""); }}>IV2</button>
            <button type="button" onClick={() => { setPostcode("DD1"); setError(""); }}>DD1</button>
          </div>
        </form>
      </div>

      {/* Crisis lines as a minimal list, not card-soup */}
      <section className="section" style={{ marginTop: "clamp(48px, 6vw, 72px)" }}>
        <div className="section-title">
          <h2>If you need help right now</h2>
          <span className="hint">All lines free to call · 24/7 where shown</span>
        </div>
        <ul className="crisis-list">
          {emergency.slice(0, 6).map(e => (
            <li key={e.id} className={e.id === "e999" ? "crisis-emer" : ""}>
              <a href={`tel:${(e.phone || "").replace(/\D/g, "") || "999"}`}>
                <span className="crisis-tag">
                  {e.id === "e999" ? "Danger" : e.tag === "text" ? "Text" : "Crisis"}
                </span>
                <span className="crisis-meta">
                  <span className="crisis-name">{e.name}</span>
                  <span className="crisis-num">{e.phone}</span>
                  <span className="crisis-hrs">{e.hours} · {e.desc}</span>
                </span>
                <span className="crisis-arrow"><Icon name="arrow-ne" size={16} /></span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Category grid with custom iconography */}
      <section className="section">
        <div className="section-title">
          <h2>Browse by what you need</h2>
          <a className="hint" href="#" onClick={(e) => { e.preventDefault(); go("decision"); }} style={{ color: "var(--accent-2)" }}>Not sure? Open guidance →</a>
        </div>
        <div className="cat-grid">
          {categories.map(c => (
            <a className="cat-card" key={c.id} href="#" onClick={(e) => { e.preventDefault(); go("results", { category: c.id }); }}>
              <div className="cat-icon"><Icon name={CATEGORY_ICON[c.id] || "info"} size={44} /></div>
              <div className="meta">
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
              </div>
              <span className="cat-arrow"><Icon name="arrow-ne" size={18} /></span>
            </a>
          ))}
        </div>
      </section>

      {/* Health boards */}
      <section className="section">
        <div className="section-title">
          <h2>Help by NHS board</h2>
          <span className="hint">{boards.length} territorial boards</span>
        </div>
        <div className="board-grid">
          {boards.map(b => (
            <a
              key={b.id}
              className="board-link"
              href="#"
              onClick={(e) => { e.preventDefault(); go("results", { healthBoard: b.id }); }}
            >
              <span>{b.name}</span>
              <Icon name="right" size={14} />
            </a>
          ))}
        </div>
      </section>

      {/* ADPs */}
      <section className="section">
        <div className="section-title">
          <h2>Drugs &amp; alcohol — finding your ADP</h2>
          <span className="hint">{window.APP_DATA.adps.length} partnerships</span>
        </div>
        <div className="callout" style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <p style={{ margin: 0 }}>Each council area has an <strong>Alcohol &amp; Drug Partnership (ADP)</strong> that commissions local treatment, harm reduction and the route into residential rehab. Funding for placements is currently covered by the Scottish Government&rsquo;s Rapid Capacity Fund.</p>
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: "pointer", fontWeight: 600 }}>Show all {window.APP_DATA.adps.length} ADPs</summary>
              <ul style={{ columns: 2, columnGap: 24, marginTop: 12, paddingLeft: 18, fontSize: 14 }}>
                {window.APP_DATA.adps.map(a => (
                  <li key={a.name} style={{ breakInside: "avoid", marginBottom: 4 }}>
                    <strong>{a.name}</strong>{" "}
                    <span className="muted" style={{ fontSize: 12 }}>· {a.healthBoard}</span>
                  </li>
                ))}
              </ul>
            </details>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
              <button className="btn btn-secondary" onClick={() => go("results", { category: "addiction" })}>See addiction services</button>
              <a className="btn btn-ghost" href="https://scottishdrugservices.com" target="_blank" rel="noopener noreferrer">Scottish Drug Services Directory</a>
            </div>
          </div>
        </div>
      </section>

      {/* Plain English callout */}
      <section className="section">
        <div className="callout">
          <div>
            <p className="eyebrow">Built for the worst day</p>
            <h2>Plain words. Big tap targets. No popups before help.</h2>
          </div>
          <div>
            <p style={{ fontSize: "calc(15px * var(--fs-step))", color: "var(--ink-soft)" }}>
              Every page is written so it&rsquo;s clear when you&rsquo;re tired, anxious, or under the influence. We explain what services do, who can use them, and what to expect when you call.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-secondary" onClick={() => go("glossary")}>Open glossary <Icon name="right" size={14} /></button>
              <button className="btn btn-ghost" onClick={() => go("a11y")}>Accessibility help</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Results -------------------------------------------------------------

const ResultsPage = ({ go, params }) => {
  const allServices = window.APP_DATA.services;
  const postcode = params.postcode || "";
  const initialCategory = params.category || "all";

  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [filters, setFilters] = useState({
    wheelchair: false, online: false, selfRef: false, lgbtq: false, under18: false,
  });
  const [category, setCategory] = useState(initialCategory);
  const [healthBoard, setHealthBoard] = useState(params.healthBoard || "all");
  const [radius, setRadius] = useState(DEFAULT_RADIUS_MILES);
  const [view, setView] = useState("list");
  const [activePin, setActivePin] = useState(null);

  useEffect(() => { setCategory(initialCategory); }, [initialCategory]);
  useEffect(() => { setHealthBoard(params.healthBoard || "all"); }, [params.healthBoard]);

  const origin = useMemo(() => lookupPostcode(postcode), [postcode]);

  // Annotate each service with distance from the user's postcode (when known).
  const annotated = useMemo(() => {
    return allServices.map(s => {
      const hasCoords = s.lat != null && s.lng != null;
      const distance = origin && hasCoords ? milesBetween(origin, { lat: s.lat, lng: s.lng }) : null;
      return { ...s, _distance: distance };
    });
  }, [allServices, origin]);

  // Filter — distance gate first, then the user's filter selections.
  const filtered = useMemo(() => {
    return annotated.filter(s => {
      if (category !== "all" && s.category !== category) return false;
      if (healthBoard !== "all" && s.healthBoard !== healthBoard && s.healthBoard !== "national") return false;

      // Distance gate. National/Scotland-wide services + crisis lines are
      // always shown. Anything geolocated must fall inside the radius.
      if (origin && s._distance != null) {
        if (s.category !== "crisis" && s.healthBoard !== "national" && s._distance > radius) return false;
      }

      if (openNowOnly && !s.openNow) return false;
      if (filters.wheelchair && !(s.access || []).includes("wheelchair")) return false;
      if (filters.online && !(s.access || []).includes("online-option")) return false;
      if (filters.selfRef && !(s.referral || "").toLowerCase().includes("self")) return false;
      if (filters.lgbtq && s.category !== "lgbtq") return false;
      if (filters.under18 && !((s.ageRange || "").includes("5") || (s.ageRange || "").includes("16") || (s.ageRange || "").includes("under"))) return false;
      return true;
    });
  }, [annotated, category, healthBoard, radius, origin, openNowOnly, filters]);

  // Sort: crisis first, then by distance asc (services without distance go last).
  const sorted = useMemo(() => {
    const order = (s) => (s.category === "crisis" ? -1 : 0);
    return [...filtered].sort((a, b) => {
      const ord = order(a) - order(b);
      if (ord !== 0) return ord;
      const ad = a._distance == null ? Infinity : a._distance;
      const bd = b._distance == null ? Infinity : b._distance;
      return ad - bd;
    });
  }, [filtered]);

  const boardLabel = healthBoard === "all"
    ? null
    : (window.APP_DATA.healthBoards.find(b => b.id === healthBoard)?.name || null);

  const crisis = sorted.filter(s => s.category === "crisis");
  const others = sorted.filter(s => s.category !== "crisis");

  const locationLabel = origin
    ? `${origin.name || "Scotland"}${origin.code ? ` · ${origin.code}` : ""}`
    : (postcode || "Scotland-wide");

  const clearAll = () => {
    setOpenNowOnly(false);
    setFilters({ wheelchair: false, online: false, selfRef: false, lgbtq: false, under18: false });
    setCategory("all"); setHealthBoard("all"); setRadius(DEFAULT_RADIUS_MILES);
  };

  return (
    <div className="page">
      <a className="crumb" href="#" onClick={(e) => { e.preventDefault(); go("home"); }}>
        <Icon name="back" size={14} /> Home
      </a>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p className="eyebrow">
            {sorted.length} services
            {origin ? ` · within ${radius} miles` : " · sorted by urgency"}
          </p>
          <h1 style={{ fontSize: "calc(32px * var(--fs-step))", lineHeight: 1.05 }}>
            {postcode
              ? <>Help near <span style={{ fontFamily: "var(--font-mono)" }}>{postcode}</span></>
              : (boardLabel ? <>Help in {boardLabel}</> : "All services")}
          </h1>
          <p className="muted" style={{ marginTop: 8 }}>
            {locationLabel} ·{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); go("home"); }} style={{ color: "var(--ink)" }}>Change postcode</a>
            {boardLabel && (
              <> · <a href="#" onClick={(e) => { e.preventDefault(); setHealthBoard("all"); }} style={{ color: "var(--ink)" }}>All boards</a></>
            )}
          </p>
        </div>
        <div className="list-map-toggle" role="tablist" aria-label="View">
          <button aria-pressed={view === "list"} onClick={() => setView("list")}><Icon name="list" size={14} /> List</button>
          <button aria-pressed={view === "split"} onClick={() => setView("split")}><Icon name="map" size={14} /> Split</button>
          <button aria-pressed={view === "map"} onClick={() => setView("map")}><Icon name="map" size={14} /> Map</button>
        </div>
      </div>

      {/* category tab strip */}
      <div className="cat-pills">
        {[{ id: "all", name: "All services" }, ...window.APP_DATA.categories].map(c => (
          <button
            key={c.id}
            className="pill"
            aria-pressed={category === c.id}
            onClick={() => setCategory(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className={`results-layout ${view === "split" ? "with-map" : ""}`}>
        <aside className="filter-panel" aria-label="Filters">
          {origin && (
            <>
              <h3>Distance</h3>
              <div className="filter-group">
                <div className="radius-row">
                  <input
                    type="range"
                    min={1} max={50} step={1}
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    aria-label="Search radius in miles"
                  />
                  <span className="val">{radius} mi</span>
                </div>
                <p className="muted" style={{ fontSize: 12, margin: "4px 0 0" }}>
                  Crisis lines &amp; national services are always shown.
                </p>
              </div>
            </>
          )}

          <h3>Quick filters</h3>
          <div className="filter-group">
            <label><input type="checkbox" checked={openNowOnly} onChange={(e) => setOpenNowOnly(e.target.checked)} /> Open right now</label>
            <label><input type="checkbox" checked={filters.wheelchair} onChange={(e) => setFilters({ ...filters, wheelchair: e.target.checked })} /> Wheelchair accessible</label>
            <label><input type="checkbox" checked={filters.online} onChange={(e) => setFilters({ ...filters, online: e.target.checked })} /> Online or phone option</label>
            <label><input type="checkbox" checked={filters.selfRef} onChange={(e) => setFilters({ ...filters, selfRef: e.target.checked })} /> Self-referral (no GP needed)</label>
            <label><input type="checkbox" checked={filters.under18} onChange={(e) => setFilters({ ...filters, under18: e.target.checked })} /> Under 18 friendly</label>
            <label><input type="checkbox" checked={filters.lgbtq} onChange={(e) => setFilters({ ...filters, lgbtq: e.target.checked })} /> LGBTQ+ affirming</label>
          </div>

          <h3>Service type</h3>
          <div className="filter-group">
            {window.APP_DATA.categories.map(c => (
              <label key={c.id}>
                <input type="radio" name="cat" checked={category === c.id} onChange={() => setCategory(c.id)} />
                {c.name}
              </label>
            ))}
            <label><input type="radio" name="cat" checked={category === "all"} onChange={() => setCategory("all")} /> Show all</label>
          </div>

          <h3>NHS board</h3>
          <div className="filter-group">
            <select
              value={healthBoard}
              onChange={(e) => setHealthBoard(e.target.value)}
              aria-label="Filter by NHS board"
            >
              <option value="all">All boards</option>
              {window.APP_DATA.healthBoards.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-ghost" style={{ width: "100%", marginTop: 8 }} onClick={clearAll}>Clear all</button>
        </aside>

        {view !== "map" && (
          <div className="service-list">
            {crisis.length > 0 && (
              <>
                <div className="section-title" style={{ marginBottom: 4, paddingBottom: 8 }}>
                  <h2 style={{ fontSize: "calc(19px * var(--fs-step))", color: "var(--emergency)" }}>Crisis support · open now</h2>
                  <span className="hint">{crisis.length} {crisis.length === 1 ? "service" : "services"}</span>
                </div>
                {crisis.map(s => <ServiceCard key={s.id} service={s} distance={s._distance} onOpen={(id) => go("detail", { id })} />)}
              </>
            )}
            {others.length > 0 && (
              <>
                <div className="section-title" style={{ marginTop: 24, marginBottom: 4, paddingBottom: 8 }}>
                  <h2 style={{ fontSize: "calc(19px * var(--fs-step))" }}>
                    {origin ? "Nearby services" : "Other services"}
                  </h2>
                  <span className="hint">{others.length} {others.length === 1 ? "service" : "services"}</span>
                </div>
                {others.map(s => <ServiceCard key={s.id} service={s} distance={s._distance} onOpen={(id) => go("detail", { id })} />)}
              </>
            )}
            {sorted.length === 0 && (
              <div className="empty-card">
                <h3>No services match these filters.</h3>
                {origin
                  ? <p>Nothing local within {radius} miles fits. Try widening the radius, clearing filters, or call NHS 24 on 111 — they can point you to what&rsquo;s available right now.</p>
                  : <p>Try clearing some filters, or call NHS 24 on 111 — they can point you to what&rsquo;s available.</p>}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button className="btn btn-secondary" onClick={() => setRadius(Math.min(50, radius + 10))}>Widen to {Math.min(50, radius + 10)} mi</button>
                  <button className="btn btn-ghost" onClick={clearAll}>Clear all filters</button>
                </div>
              </div>
            )}
          </div>
        )}

        {(view === "split" || view === "map") && (
          <MapPanel services={sorted} activeId={activePin} onPin={setActivePin} />
        )}
      </div>
    </div>
  );
};

// --- Detail -------------------------------------------------------------

const DetailPage = ({ go, params }) => {
  const service = window.APP_DATA.services.find(s => s.id === params.id) || window.APP_DATA.services[0];
  const similar = window.APP_DATA.services.filter(s => s.category === service.category && s.id !== service.id).slice(0, 2);

  const accessLabels = {
    "wheelchair": "Wheelchair accessible",
    "interpreter": "Interpreter can be arranged",
    "online-option": "Online or phone option",
    "service-animals": "Service animals welcome",
    "quiet-room": "Quiet room available",
    "lgbtq-affirming": "LGBTQ+ affirming",
    "bsl-relay": "BSL relay supported",
    "needle-exchange": "Needle exchange",
    "naloxone": "Naloxone supply",
    "phone-counselling": "Phone counselling",
    "dual-diagnosis": "Dual diagnosis support",
    "long-stay": "Long stay available",
    "home-visit": "Home visits",
  };
  const noLabels = { "childcare": "On-site childcare" };

  return (
    <div className="page">
      <a className="crumb" href="#" onClick={(e) => { e.preventDefault(); go("results"); }}>
        <Icon name="back" size={14} /> Back to results
      </a>

      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "flex-end", gap: 16, marginBottom: 16 }}>
        <div>
          <p className="eyebrow">{window.APP_DATA.categories.find(c => c.id === service.category)?.name}</p>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>{service.name}</h1>
          <p className="muted" style={{ marginTop: 8 }}>{service.coverage} · last verified {service.verified}</p>
        </div>
        <span className={`open-pill ${service.openNow ? "open" : "closed"}`} style={{ fontSize: 13 }}>
          {service.openNow ? "Open now" : "Closed"}
        </span>
      </div>

      <div className="detail-sticky-cta" role="region" aria-label="Call this service">
        <div>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 2 }}>In crisis? Call them now</div>
          <div className="num">{service.phone}</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a className="btn btn-safe" href={`tel:${(service.phone || "").replace(/\s/g, "")}`}>
            <Icon name="phone" size={16} /> Tap to call
          </a>
          <button className="btn btn-ghost" style={{ borderColor: "rgba(255,255,255,0.3)", color: "var(--bg)" }} onClick={() => navigator.clipboard?.writeText(service.phone)}>
            <Icon name="copy" size={14} /> Copy
          </button>
        </div>
      </div>

      <div className="detail-grid" style={{ marginTop: 28 }}>
        <div>
          <div className="fact-card">
            <h2 style={{ fontSize: "calc(22px * var(--fs-step))", marginBottom: 14 }}>What is this service?</h2>
            <p style={{ fontSize: "calc(17px * var(--fs-step))" }}>{service.blurb}</p>
            <p style={{ color: "var(--ink-soft)" }}>
              It&rsquo;s confidential. Nothing you say leaves the room unless you&rsquo;re at risk of harm — then they have to tell someone, but they&rsquo;ll explain why first.
            </p>
          </div>

          <div className="fact-card">
            <h2 style={{ fontSize: "calc(22px * var(--fs-step))", marginBottom: 14 }}>Who can use this service?</h2>
            <ul className="checks">
              <li><span className="yes"><Icon name="check" size={18} /></span><span>Ages {service.ageRange}</span></li>
              <li><span className="yes"><Icon name="check" size={18} /></span><span>{service.referral}</span></li>
              <li><span className="yes"><Icon name="check" size={18} /></span><span>You can come alone or bring someone</span></li>
              <li><span className="no"><Icon name="x" size={18} /></span><span className="no-row">Not for medical emergencies (call 999 instead)</span></li>
            </ul>
            <p className="muted" style={{ marginTop: 12, fontSize: 14 }}>Coverage: {service.coverage}</p>
          </div>

          <div className="fact-card">
            <h2 style={{ fontSize: "calc(22px * var(--fs-step))", marginBottom: 14 }}>Accessibility</h2>
            <ul className="checks">
              {(service.access || []).map(a => (
                <li key={a}><span className="yes"><Icon name="check" size={18} /></span><span>{accessLabels[a] || a}</span></li>
              ))}
              {(service.noAccess || []).map(a => (
                <li key={a}><span className="no"><Icon name="x" size={18} /></span><span className="no-row">{noLabels[a] || a}</span></li>
              ))}
            </ul>
          </div>

          <div className="fact-card">
            <h2 style={{ fontSize: "calc(22px * var(--fs-step))", marginBottom: 14 }}>How to access</h2>
            <p>{service.referral}.</p>
            <h3 style={{ fontSize: "calc(17px * var(--fs-step))", margin: "16px 0 12px" }}>What to expect when you arrive:</h3>
            <ol className="steps">
              <li><div><strong>Reception greets you.</strong> They&rsquo;ll ask your name and a little about why you&rsquo;re here.</div></li>
              <li><div><strong>Wait in a quiet room.</strong> Take as much time as you need.</div></li>
              <li><div><strong>A staff member sees you.</strong> Usually within 15–20 minutes.</div></li>
              <li><div><strong>You talk about what&rsquo;s happening.</strong> Share as much or as little as you want.</div></li>
              <li><div><strong>You leave with a plan.</strong> Next steps that make sense for you.</div></li>
            </ol>
          </div>

          {similar.length > 0 && (
            <div className="fact-card">
              <h2 style={{ fontSize: "calc(22px * var(--fs-step))", marginBottom: 14 }}>Similar services near you</h2>
              <div className="stack">
                {similar.map(s => (
                  <button key={s.id} className="btn btn-secondary btn-block" onClick={() => go("detail", { id: s.id })} style={{ justifyContent: "space-between", textAlign: "left", padding: "12px 16px", height: "auto", minHeight: 60 }}>
                    <span>
                      <span style={{ display: "block", fontWeight: 600 }}>{s.name}</span>
                      <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--ink-mute)", marginTop: 2 }}>{s.phone}</span>
                    </span>
                    <Icon name="right" size={16} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="fact-card">
            <h2 style={{ fontSize: "calc(20px * var(--fs-step))", marginBottom: 8 }}>Is this information correct?</h2>
            <p style={{ color: "var(--ink-soft)" }}>Help us keep this directory accurate. It takes 10 seconds.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-secondary"><Icon name="check" size={14} /> Yes, it&rsquo;s right</button>
              <button className="btn btn-ghost">Something&rsquo;s changed</button>
              <button className="btn btn-ghost">Report missing service</button>
            </div>
          </div>
        </div>

        <aside>
          <div className="aside-card">
            <div className="fact-row">
              <span className="label">Hours</span>
              <div className="val">
                <strong>{service.hours?.today}</strong>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{service.hours?.week}</div>
              </div>
            </div>
            <div className="fact-row">
              <span className="label">Phone</span>
              <div className="val">
                <span className="mono">{service.phone}</span>
                <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>Free · confidential</div>
              </div>
            </div>
            {service.email && (
              <div className="fact-row">
                <span className="label">Email</span>
                <div className="val">
                  <a href={`mailto:${service.email}`} style={{ wordBreak: "break-all" }}>{service.email}</a>
                </div>
              </div>
            )}
            {service.website && (
              <div className="fact-row">
                <span className="label">Website</span>
                <div className="val"><a href={externalUrl(service.website)} target="_blank" rel="noopener noreferrer">{service.website}</a></div>
              </div>
            )}
            {service.address && (
              <div className="fact-row">
                <span className="label">Address</span>
                <div className="val">{service.address}</div>
              </div>
            )}
          </div>

          {service.lat && (
            <div className="aside-card" style={{ padding: 0, overflow: "hidden", marginTop: 12 }}>
              <div style={{ height: 220, position: "relative", background: "linear-gradient(135deg, #e9ecdd, #e1e4d2)" }}>
                <div className="map-roads" aria-hidden="true"></div>
                <div className="map-pin active" style={{ left: "50%", top: "50%" }}>
                  <span className="pin-head"><span>1</span></span>
                </div>
              </div>
              <div style={{ padding: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a className="btn btn-secondary" href={`https://www.openstreetmap.org/?mlat=${service.lat}&mlon=${service.lng}&zoom=16`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: 130 }}>
                  <Icon name="pin" size={14} /> Get directions
                </a>
                <button className="btn btn-ghost" onClick={() => navigator.clipboard?.writeText(service.address || "")} style={{ flex: 1, minWidth: 130 }}>
                  <Icon name="copy" size={14} /> Copy address
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

Object.assign(window, { LandingPage, ResultsPage, DetailPage });
