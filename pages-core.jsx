// Landing, Results, Detail pages

const LandingPage = ({ go, variant }) => {
  const [postcode, setPostcode] = useState("");
  const submit = (e) => {
    e?.preventDefault();
    go("results", { postcode: postcode || "EH8 8DX" });
  };
  const emergency = window.APP_DATA.emergency;
  const categories = window.APP_DATA.categories;

  return (
    <div className="page">
      <section className="section" style={{ marginTop: 8 }}>
        <p className="eyebrow">Free · Confidential · No referral needed</p>
        <h1 style={{ marginBottom: 16, maxWidth: 720 }}>
          Find mental health and addiction support near you.
        </h1>
        <p style={{ fontSize: "calc(19px * var(--fs-step))", color: "var(--ink-soft)", maxWidth: 620, marginBottom: 28 }}>
          Search by postcode for crisis lines, NHS services, addiction services, and peer support across Scotland. You don&rsquo;t need to know what you&rsquo;re looking for — start with where you are.
        </p>

        <form className="search" onSubmit={submit}>
          <label className="search-label" htmlFor="postcode">Enter your postcode</label>
          <div className="search-row">
            <input
              id="postcode"
              type="text"
              placeholder="e.g. EH8 8DX"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
              autoComplete="postal-code"
              inputMode="text"
              spellCheck="false"
              aria-label="Postcode"
            />
            <button className="btn btn-safe big" type="submit">
              <Icon name="search" size={18} /> Find help near me
            </button>
          </div>
          <div className="search-hint">
            <span>Or try:</span>
            <button type="button" onClick={() => { setPostcode("EH8 8DX"); }}>EH8 8DX</button>
            <button type="button" onClick={() => { setPostcode("G2 4JR"); }}>G2 4JR</button>
            <button type="button" onClick={() => { setPostcode("AB10"); }}>AB10</button>
            <button type="button" onClick={() => go("results")}>Use my location</button>
          </div>
        </form>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>If you need help right now</h2>
          <span className="hint">All lines are free to call</span>
        </div>
        <div className="emergency-block">
          {emergency.slice(0, 6).map(e => (
            <a className={`emergency-card ${e.id === "e999" ? "is-emergency" : "is-crisis"}`} key={e.id} href={`tel:${e.phone.replace(/\s/g, "")}`}>
              <span className="tag">
                {e.id === "e999" ? "Immediate danger" : e.tag === "text" ? "Text" : "Crisis support"}
                {e.age && <> · {e.age}</>}
              </span>
              <span className="name">{e.name}</span>
              <span className="num">{e.phone}</span>
              <span className="hrs">{e.hours}</span>
              <span className="desc">{e.desc}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>What kind of help do you need?</h2>
          <a className="muted" href="#" onClick={(e) => { e.preventDefault(); go("decision"); }} style={{ fontSize: 14 }}>Not sure? Use guidance →</a>
        </div>
        <div className="cat-grid">
          {categories.map(c => (
            <a className="cat-card" key={c.id} href="#" onClick={(e) => { e.preventDefault(); go("results", { category: c.id }); }}>
              <div className="glyph"><Icon name={c.icon} size={20} /></div>
              <div className="meta">
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Browse by NHS board</h2>
          <span className="hint">{window.APP_DATA.healthBoards.filter(b => b.id !== "national").length} territorial boards</span>
        </div>
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {window.APP_DATA.healthBoards.filter(b => b.id !== "national").map(b => (
            <a
              key={b.id}
              href="#"
              onClick={(e) => { e.preventDefault(); go("results", { healthBoard: b.id }); }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", borderRadius: 10,
                background: "var(--surface)", border: "1px solid var(--line)",
                color: "var(--ink)", textDecoration: "none", fontSize: 14,
              }}
            >
              <span>{b.name}</span>
              <Icon name="right" size={14} />
            </a>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Drugs &amp; alcohol — finding your ADP</h2>
          <span className="hint">{window.APP_DATA.adps.length} partnerships</span>
        </div>
        <div className="fact-card" style={{ maxWidth: 920 }}>
          <p>Each council area has an <strong>Alcohol &amp; Drug Partnership (ADP)</strong> that commissions local treatment, harm reduction and the route into residential rehab. Funding for placements is currently covered by the Scottish Government&rsquo;s Rapid Capacity Fund.</p>
          <details style={{ marginTop: 8 }}>
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>Show all 30 ADPs</summary>
            <ul style={{ columns: 2, columnGap: 24, marginTop: 12, paddingLeft: 18, fontSize: 14 }}>
              {window.APP_DATA.adps.map(a => (
                <li key={a.name} style={{ breakInside: "avoid", marginBottom: 4 }}>
                  <strong>{a.name}</strong>{" "}
                  <span className="muted" style={{ fontSize: 12 }}>· {a.healthBoard}</span>
                </li>
              ))}
            </ul>
          </details>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            <button className="btn btn-secondary" onClick={() => go("results", { category: "addiction" })}>See addiction services</button>
            <a className="btn btn-ghost" href="https://scottishdrugservices.com" target="_blank" rel="noopener noreferrer">Scottish Drug Services Directory</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Plain English. No jargon.</h2>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: 24, display: "grid", gap: 16, gridTemplateColumns: "1fr", maxWidth: 760 }}>
          <p style={{ margin: 0, fontSize: "calc(17px * var(--fs-step))" }}>
            Every page is written so it&rsquo;s clear even if you&rsquo;re tired, distressed, or scared. We explain what services do, who can use them, and what happens when you call.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-secondary" onClick={() => go("glossary")}>Open glossary</button>
            <button className="btn btn-ghost" onClick={() => go("a11y")}>Accessibility help</button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Results -------------------------------------------------------------

const ResultsPage = ({ go, params }) => {
  const allServices = window.APP_DATA.services;
  const postcode = params.postcode || "EH8 8DX";
  const initialCategory = params.category || "all";

  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [filters, setFilters] = useState({
    wheelchair: false, online: false, selfRef: false, lgbtq: false, under18: false,
  });
  const [category, setCategory] = useState(initialCategory);
  const [healthBoard, setHealthBoard] = useState(params.healthBoard || "all");
  const [view, setView] = useState("list"); // list | split | map
  const [activePin, setActivePin] = useState(null);

  useEffect(() => { setCategory(initialCategory); }, [initialCategory]);
  useEffect(() => { setHealthBoard(params.healthBoard || "all"); }, [params.healthBoard]);

  const filtered = useMemo(() => {
    return allServices.filter(s => {
      if (category !== "all" && s.category !== category) return false;
      if (healthBoard !== "all" && s.healthBoard !== healthBoard && s.healthBoard !== "national") return false;
      if (openNowOnly && !s.openNow) return false;
      if (filters.wheelchair && !s.access.includes("wheelchair")) return false;
      if (filters.online && !s.access.includes("online-option")) return false;
      if (filters.selfRef && !(s.referral || "").toLowerCase().includes("self")) return false;
      if (filters.lgbtq && s.category !== "lgbtq") return false;
      if (filters.under18 && !(s.ageRange.includes("5") || s.ageRange.includes("16") || s.ageRange.includes("under"))) return false;
      return true;
    });
  }, [allServices, category, healthBoard, openNowOnly, filters]);

  const boardLabel = healthBoard === "all"
    ? null
    : (window.APP_DATA.healthBoards.find(b => b.id === healthBoard)?.name || null);

  // group by urgency
  const crisis = filtered.filter(s => s.category === "crisis");
  const others = filtered.filter(s => s.category !== "crisis");

  return (
    <div className="page">
      <a className="crumb" href="#" onClick={(e) => { e.preventDefault(); go("home"); }}>
        <Icon name="back" size={14} /> Home
      </a>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p className="eyebrow">{filtered.length} services · sorted by urgency, then distance</p>
          <h1 style={{ fontSize: "calc(32px * var(--fs-step))" }}>
            Help near <span style={{ fontFamily: "var(--font-mono)" }}>{postcode}</span>
          </h1>
          <p className="muted" style={{ marginTop: 4 }}>
            {boardLabel ? <>{boardLabel} · </> : <>Postcode {postcode} · </>}
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
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, marginBottom: 20, scrollbarWidth: "none" }}>
        {[{ id: "all", name: "All services" }, ...window.APP_DATA.categories].map(c => (
          <button
            key={c.id}
            className="btn"
            onClick={() => setCategory(c.id)}
            style={{
              minHeight: 40, padding: "0 14px", fontSize: 14, borderRadius: 999,
              background: category === c.id ? "var(--ink)" : "var(--surface)",
              color: category === c.id ? "var(--bg)" : "var(--ink)",
              border: `1px solid ${category === c.id ? "var(--ink)" : "var(--line-strong)"}`,
              flex: "0 0 auto",
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className={`results-layout ${view === "split" ? "with-map" : ""}`}>
        <aside className="filter-panel" aria-label="Filters">
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
                <input type="radio" name="cat" checked={category === c.id} onChange={() => setCategory(c.id)} style={{ width: 18, height: 18, accentColor: "var(--accent)" }} />
                {c.name}
              </label>
            ))}
            <label><input type="radio" name="cat" checked={category === "all"} onChange={() => setCategory("all")} style={{ width: 18, height: 18, accentColor: "var(--accent)" }} /> Show all</label>
          </div>
          <h3>NHS board</h3>
          <div className="filter-group">
            <select
              value={healthBoard}
              onChange={(e) => setHealthBoard(e.target.value)}
              aria-label="Filter by NHS board"
              style={{
                width: "100%", height: 44, padding: "0 12px",
                borderRadius: 10, border: "1.5px solid var(--line-strong)",
                background: "var(--bg)", color: "var(--ink)",
                font: "inherit", fontSize: 14,
              }}
            >
              <option value="all">All boards</option>
              {window.APP_DATA.healthBoards.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-ghost" style={{ width: "100%", marginTop: 8 }} onClick={() => { setOpenNowOnly(false); setFilters({ wheelchair: false, online: false, selfRef: false, lgbtq: false, under18: false }); setCategory("all"); setHealthBoard("all"); }}>Clear all</button>
        </aside>

        {view !== "map" && (
          <div className="service-list">
            {crisis.length > 0 && (
              <>
                <div className="section-title" style={{ marginBottom: 4 }}>
                  <h2 style={{ fontSize: "calc(19px * var(--fs-step))", color: "var(--emergency)" }}>Crisis support · open now</h2>
                </div>
                {crisis.map(s => <ServiceCard key={s.id} service={s} onOpen={(id) => go("detail", { id })} />)}
              </>
            )}
            {others.length > 0 && (
              <>
                <div className="section-title" style={{ marginTop: 16, marginBottom: 4 }}>
                  <h2 style={{ fontSize: "calc(19px * var(--fs-step))" }}>Other services</h2>
                </div>
                {others.map(s => <ServiceCard key={s.id} service={s} onOpen={(id) => go("detail", { id })} />)}
              </>
            )}
            {filtered.length === 0 && (
              <div className="fact-card">
                <h3>No services match these filters.</h3>
                <p>Try clearing some filters, or call NHS 24 on 111 — they can point you to what&rsquo;s available.</p>
              </div>
            )}
          </div>
        )}

        {(view === "split" || view === "map") && (
          <MapPanel services={filtered} activeId={activePin} onPin={setActivePin} />
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
          <h1>{service.name}</h1>
          <p className="muted" style={{ marginTop: 4 }}>{service.coverage} · last verified {service.verified}</p>
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
          <a className="btn btn-safe" href={`tel:${service.phone.replace(/\s/g, "")}`}>
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
              {service.access.map(a => (
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
          <div className="fact-card">
            <div className="fact-row">
              <span className="label">Hours</span>
              <div className="val">
                <strong>{service.hours.today}</strong>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{service.hours.week}</div>
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

          {/* mini map */}
          {service.lat && (
            <div className="fact-card" style={{ padding: 0, overflow: "hidden", marginTop: 16 }}>
              <div style={{ height: 220, position: "relative", background: "linear-gradient(135deg, #e9ecdd, #e1e4d2)" }}>
                <div className="map-roads" aria-hidden="true"></div>
                <div className="map-pin active" style={{ left: "50%", top: "50%" }}>
                  <span className="pin-head"><span>1</span></span>
                </div>
              </div>
              <div style={{ padding: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <a className="btn btn-secondary" href="#" style={{ flex: 1, minWidth: 130 }}>
                  <Icon name="pin" size={14} /> Get directions
                </a>
                <button className="btn btn-ghost" onClick={() => navigator.clipboard?.writeText(service.address)} style={{ flex: 1, minWidth: 130 }}>
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
