// Decision tree, Accessibility help, Glossary pages

const decisionPaths = [
  {
    id: "crisis",
    title: "I'm in crisis right now",
    blurb: "Acute distress, suicidal feelings, panic, overdose, can't keep yourself safe.",
    urgency: "high",
    routeTo: { type: "results", params: { category: "crisis" } },
  },
  {
    id: "addiction",
    title: "I'm struggling with drugs or alcohol",
    blurb: "Treatment, harm reduction, residential rehab, help to cut down or stop.",
    urgency: "low",
    routeTo: { type: "results", params: { category: "addiction" } },
  },
  {
    id: "low-mood",
    title: "I'm anxious, low or not coping",
    blurb: "Talking therapy, counselling, mental health teams.",
    urgency: "med",
    routeTo: { type: "results", params: { category: "mental-health" } },
  },
  {
    id: "young",
    title: "I'm a young person (under 18)",
    blurb: "CAMHS, school counsellors, youth-friendly services.",
    urgency: "med",
    routeTo: { type: "results", params: { category: "young" } },
  },
  {
    id: "bereaved",
    title: "Someone has died",
    blurb: "Grief support — recent loss or years ago, both welcome.",
    urgency: "low",
    routeTo: { type: "results", params: { category: "bereavement" } },
  },
  {
    id: "lgbtq",
    title: "I want LGBTQ+ affirming support",
    blurb: "Services run by and for LGBTQ+ people.",
    urgency: "low",
    routeTo: { type: "results", params: { category: "lgbtq" } },
  },
  {
    id: "peer",
    title: "I want to talk to people who get it",
    blurb: "Peer support — AA, NA, SMART Recovery, peer cafés.",
    urgency: "low",
    routeTo: { type: "results", params: { category: "peer" } },
  },
  {
    id: "someone-else",
    title: "I'm worried about someone else",
    blurb: "Support for family, carers, friends.",
    urgency: "low",
    routeTo: { type: "results", params: { category: "mental-health" } },
  },
];

const DecisionPage = ({ go }) => (
  <div className="page">
    <a className="crumb" href="#" onClick={(e) => { e.preventDefault(); go("home"); }}>
      <Icon name="back" size={14} /> Home
    </a>
    <p className="eyebrow">Step 1 of 2 · Guidance</p>
    <h1 style={{ maxWidth: 720 }}>Tell us what&rsquo;s happening. We&rsquo;ll show you what fits.</h1>
    <p style={{ fontSize: "calc(18px * var(--fs-step))", color: "var(--ink-soft)", maxWidth: 620, marginTop: 12, marginBottom: 32 }}>
      Pick the option that sounds most like you. You can change your mind on the next page — and there&rsquo;s a &ldquo;not sure&rdquo; route at the bottom.
    </p>

    <div className="decision-grid">
      {decisionPaths.map(p => (
        <a
          key={p.id}
          className={`decision-card urgent-${p.urgency}`}
          href="#"
          onClick={(e) => { e.preventDefault(); go(p.routeTo.type, p.routeTo.params); }}
        >
          <span className="urg">
            <Icon name={p.urgency === "high" ? "alert" : p.urgency === "med" ? "info" : "heart"} size={12} />
            {p.urgency === "high" ? "Help right now" : p.urgency === "med" ? "Within days" : "When you’re ready"}
          </span>
          <h3>{p.title}</h3>
          <p>{p.blurb}</p>
          <span className="arrow">See services →</span>
        </a>
      ))}
    </div>

    <div className="fact-card" style={{ marginTop: 32, maxWidth: 720 }}>
      <h2 style={{ fontSize: "calc(22px * var(--fs-step))", marginBottom: 10 }}>I don&rsquo;t know where to start</h2>
      <p>That&rsquo;s OK. The simplest thing is to enter your postcode and we&rsquo;ll show what&rsquo;s near you. Call the first one — they&rsquo;ll point you to what you need.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        <button className="btn btn-safe" onClick={() => go("home")}>Search by postcode</button>
        <a className="btn btn-secondary" href="tel:111"><Icon name="phone" size={14} /> Call NHS 24 · 111</a>
      </div>
    </div>

    <div className="fact-card" style={{ marginTop: 16, maxWidth: 720, background: "var(--surface-soft)" }}>
      <h2 style={{ fontSize: "calc(20px * var(--fs-step))", marginBottom: 10 }}>About these services</h2>
      <ul className="checks">
        <li><span className="yes"><Icon name="check" size={18} /></span><span>All free on the NHS.</span></li>
        <li><span className="yes"><Icon name="check" size={18} /></span><span>Confidential — you won&rsquo;t get in trouble.</span></li>
        <li><span className="yes"><Icon name="check" size={18} /></span><span>Many accept self-referral (no GP needed).</span></li>
        <li><span className="yes"><Icon name="check" size={18} /></span><span>You can bring someone with you.</span></li>
      </ul>
    </div>
  </div>
);

// --- Accessibility -------------------------------------------------------

const a11yCards = [
  {
    icon: "ear",
    title: "If you use a screen reader",
    items: [
      "Headings are properly marked (H1, H2, H3 in order)",
      "Links describe where they go — never just &lsquo;click here&rsquo;",
      "Phone numbers are marked so they read clearly",
      "Skip to main content link at the top of every page",
    ],
  },
  {
    icon: "keyboard",
    title: "If you can't use a mouse",
    items: [
      "Everything works with Tab and Shift+Tab",
      "Buttons activate with Enter or Space",
      "Focus is always visible (green outline)",
      "Alt+M jumps to the postcode search",
    ],
  },
  {
    icon: "ear",
    title: "If you're deaf or hard of hearing",
    items: [
      "All phone numbers are written out — never audio only",
      "Some services have BSL video call — marked on each service page",
      "Text crisis line: SHOUT to 85258, 24/7",
    ],
  },
  {
    icon: "eye",
    title: "If you're blind or have low vision",
    items: [
      "All text scales up to 200% without breaking layout",
      "Dark mode and high-contrast mode available",
      "No information conveyed by colour alone",
      "Use the Tweaks panel to enlarge text",
    ],
  },
  {
    icon: "brain",
    title: "If you have dyslexia or cognitive differences",
    items: [
      "Plain English throughout (target reading age 11)",
      "Short sentences, generous white space",
      "Sans-serif typeface; left-aligned text",
      "No flashing or rapidly-changing content",
    ],
  },
  {
    icon: "wifi-off",
    title: "If you're on a slow connection",
    items: [
      "Critical numbers cached on your device",
      "No autoplaying video or large images",
      "Works on 2G networks and older browsers",
      "Download the directory for offline use",
    ],
  },
];

const A11yPage = ({ go }) => (
  <div className="page">
    <a className="crumb" href="#" onClick={(e) => { e.preventDefault(); go("home"); }}>
      <Icon name="back" size={14} /> Home
    </a>
    <p className="eyebrow">Designed for everyone</p>
    <h1 style={{ maxWidth: 720 }}>Accessibility help</h1>
    <p style={{ fontSize: "calc(18px * var(--fs-step))", color: "var(--ink-soft)", maxWidth: 620, marginTop: 12, marginBottom: 28 }}>
      This site meets WCAG AAA standards. Below is what we&rsquo;ve done for different ways of using the web — and what to do if something isn&rsquo;t working.
    </p>

    <div className="a11y-grid">
      {a11yCards.map(c => (
        <div className="a11y-card" key={c.title}>
          <div className="icon"><Icon name={c.icon} size={22} /></div>
          <h3>{c.title}</h3>
          <ul className="checks">
            {c.items.map(i => (
              <li key={i}><span className="yes"><Icon name="check" size={16} /></span><span dangerouslySetInnerHTML={{ __html: i }}></span></li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <section style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: "calc(24px * var(--fs-step))", marginBottom: 12 }}>If English isn&rsquo;t your first language</h2>
      <p style={{ color: "var(--ink-soft)", maxWidth: 620 }}>
        All text uses simple, short sentences so Google Translate works well. Use your browser&rsquo;s built-in translate feature.
      </p>
      <div className="lang-row" style={{ marginTop: 14 }}>
        {["中文", "Español", "Pусский", "العربية", "Português", "Polski", "Soomaali", "Українська"].map(l => (
          <button key={l}>{l}</button>
        ))}
      </div>
    </section>

    <section style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: "calc(24px * var(--fs-step))", marginBottom: 12 }}>Still having trouble?</h2>
      <div className="fact-card" style={{ maxWidth: 620 }}>
        <p>Email <a href="mailto:accessibility@example.scot">accessibility@example.scot</a> or call 0131 496 0000. We respond within 48 hours.</p>
        <p className="muted" style={{ fontSize: 14, marginBottom: 0 }}>You can also contact the NHS Scotland Equality & Human Rights Team.</p>
      </div>
    </section>
  </div>
);

// --- Glossary ----------------------------------------------------------

const GlossaryPage = ({ go }) => {
  const [q, setQ] = useState("");
  const items = window.APP_DATA.glossary.filter(g =>
    !q || g.term.toLowerCase().includes(q.toLowerCase()) ||
    g.full.toLowerCase().includes(q.toLowerCase()) ||
    g.plain.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="page">
      <a className="crumb" href="#" onClick={(e) => { e.preventDefault(); go("home"); }}>
        <Icon name="back" size={14} /> Home
      </a>
      <p className="eyebrow">No jargon — promise</p>
      <h1>Plain English glossary</h1>
      <p style={{ fontSize: "calc(18px * var(--fs-step))", color: "var(--ink-soft)", maxWidth: 620, marginTop: 12, marginBottom: 24 }}>
        What these words actually mean, with examples of how people use them.
      </p>

      <div className="glossary-search">
        <input
          type="search"
          placeholder="Search — e.g. CAMHS, harm reduction, self-referral"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search glossary"
        />
      </div>

      {items.map(g => (
        <article className="gloss-item" key={g.term}>
          <div className="term">
            <h3>{g.term}</h3>
            <span className="full">{g.full}</span>
          </div>
          <p className="plain">{g.plain}</p>
          <div className="ex">
            <strong style={{ fontStyle: "normal", color: "var(--ink-mute)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>How people use it</strong>
            &ldquo;{g.example}&rdquo;
          </div>
        </article>
      ))}

      {items.length === 0 && (
        <div className="fact-card"><p>No matches for &ldquo;{q}&rdquo;. Try a different word, or <a href="#" onClick={(e) => { e.preventDefault(); setQ(""); }}>see all terms</a>.</p></div>
      )}
    </div>
  );
};

Object.assign(window, { DecisionPage, A11yPage, GlossaryPage });
