// Root app — hash-based router for the 6 pages.
// (The design-tool viewport switcher, variant A/B toggle, and tweaks panel
//  from the prototype are intentionally not shipped to production.)

function parseHash() {
  const h = (location.hash || "#/").slice(1);
  const [path, search] = h.split("?");
  const params = {};
  if (search) new URLSearchParams(search).forEach((v, k) => params[k] = v);
  const parts = path.split("/").filter(Boolean);
  const route = parts[0] || "home";
  if (parts[1]) params.id = parts[1];
  return { route, params };
}

function navTo(route, params = {}) {
  let h = `#/${route === "home" ? "" : route}`;
  if (params.id) h += `/${params.id}`;
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (k !== "id" && v != null) sp.set(k, v); });
  const s = sp.toString();
  if (s) h += `?${s}`;
  location.hash = h;
}

const PAGES = {
  home:     LandingPage,
  results:  ResultsPage,
  detail:   DetailPage,
  decision: DecisionPage,
  a11y:     A11yPage,
  glossary: GlossaryPage,
};

const App = () => {
  const [{ route, params }, setRoute] = useState(parseHash());
  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const go = (r, p) => navTo(r, p || {});
  const Page = PAGES[route] || LandingPage;
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to main content</a>
      <Header go={go} route={route} />
      <main id="main">
        <Page go={go} params={params} />
      </main>
      <MobileCrisisBar />
      <Footer go={go} />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
