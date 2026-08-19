/**
 * Marginalia & Marigold design philosophy: an asymmetric, warm academic reading room
 * with a quiet subject shelf, an editorial content canvas, and durable library navigation.
 */
import { Streamdown } from "streamdown";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  ChevronRight,
  Clock3,
  FileArchive,
  FileText,
  LibraryBig,
  Menu,
  Search,
  X,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { library } from "../../../website/src/library.generated";

type ModuleItem = {
  id: string;
  number: string;
  title: string;
  summary: string;
  duration: string;
  file: string;
  sourcePath: string;
  rawUrl: string;
  content: string;
};

type LegacyItem = {
  title: string;
  type: string;
  path: string;
  description?: string;
  rawUrl: string;
};

type SubjectItem = {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  accent: string;
  courseHours: number;
  modules: ModuleItem[];
  legacy: LegacyItem[];
};

const subjects = library.subjects as unknown as SubjectItem[];
const heroImage = "/manus-storage/lecture-notes-hero_792c6c63.png";
const libraryImage = "/manus-storage/lecture-notes-library_5817fbb9.png";
const studyImage = "/manus-storage/lecture-notes-study_a0f335d9.png";
const logoImage = "/manus-storage/lecture-notes-logo_bc91ce25.png";

function openRawResource(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function ModuleCard({
  module,
  index,
  onOpen,
}: {
  module: ModuleItem;
  index: number;
  onOpen: (id: string) => void;
}) {
  return (
    <article className="module-card" style={{ "--stagger": `${index * 48}ms` } as CSSProperties}>
      <div className="module-card-folio">
        <span>Module</span>
        <strong>{module.number}</strong>
      </div>
      <div className="module-card-body">
        <div className="module-card-meta">
          <span>{module.duration}</span>
          <span>Digital notes</span>
        </div>
        <h3>{module.title}</h3>
        <p>{module.summary}</p>
        <button className="text-action" type="button" onClick={() => onOpen(module.id)}>
          Read rendered notes <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export default function Home() {
  const [activeSubjectId, setActiveSubjectId] = useState(subjects[0]?.id ?? "");
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [shelfOpen, setShelfOpen] = useState(false);

  const activeSubject = useMemo(
    () => subjects.find((subject) => subject.id === activeSubjectId) ?? subjects[0],
    [activeSubjectId],
  );

  const activeModule = useMemo(
    () => activeSubject?.modules.find((module) => module.id === activeModuleId) ?? null,
    [activeModuleId, activeSubject],
  );

  const filteredModules = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return activeSubject?.modules ?? [];
    return (activeSubject?.modules ?? []).filter((module) =>
      [module.title, module.summary, module.number, module.content]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [activeSubject, query]);

  useEffect(() => {
    setActiveModuleId(null);
    setQuery("");
  }, [activeSubjectId]);

  const chooseSubject = (id: string) => {
    setActiveSubjectId(id);
    setShelfOpen(false);
  };

  const openModule = (id: string) => {
    setActiveModuleId(id);
    setShelfOpen(false);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const backToShelf = () => {
    setActiveModuleId(null);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  if (!activeSubject) {
    return <main className="empty-library">No subjects are registered yet.</main>;
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="Lecture Notes home" onClick={backToShelf}>
          <img src={logoImage} alt="" className="brand-mark" />
          <span>
            <em>Lecture</em>
            <strong>Notes</strong>
          </span>
        </a>
        <div className="topbar-utility">
          <span className="utility-copy">Digital reading room</span>
          <a
            className="repository-link"
            href={`https://github.com/${library.owner}/${library.repository}`}
            target="_blank"
            rel="noreferrer"
          >
            Repository <ArrowUpRight aria-hidden="true" />
          </a>
          <button
            type="button"
            className="shelf-toggle"
            onClick={() => setShelfOpen((open) => !open)}
            aria-label={shelfOpen ? "Close subject shelf" : "Open subject shelf"}
            aria-expanded={shelfOpen}
          >
            {shelfOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div className="library-layout" id="top">
        <aside className={`subject-shelf ${shelfOpen ? "is-open" : ""}`} aria-label="Subject navigation">
          <div className="shelf-intro">
            <span className="eyebrow">The collection</span>
            <h2>Subjects, ordered for reading.</h2>
            <p>Every subject is a self-contained shelf of rendered modules and source-ready materials.</p>
          </div>

          <nav className="subject-list">
            {subjects.map((subject) => {
              const isActive = subject.id === activeSubject.id;
              return (
                <button
                  type="button"
                  key={subject.id}
                  className={`subject-item ${isActive ? "is-active" : ""}`}
                  onClick={() => chooseSubject(subject.id)}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="subject-code">{subject.code}</span>
                  <span className="subject-title">{subject.shortTitle}</span>
                  <span className="subject-count">{subject.modules.length} modules</span>
                </button>
              );
            })}
          </nav>

          <div className="shelf-legacy-note">
            <FileArchive aria-hidden="true" />
            <p>
              Add PDF and PPT resources inside <code>digital notes/legacy/&lt;subject&gt;</code>; the library discovers them and creates direct source links.
            </p>
          </div>
        </aside>

        <main className="main-canvas">
          {activeModule ? (
            <article className="note-reader">
              <button className="back-action" type="button" onClick={backToShelf}>
                <ArrowLeft aria-hidden="true" /> All {activeSubject.shortTitle} modules
              </button>

              <header className="reader-header">
                <div className="reader-folio">
                  <span>{activeSubject.code}</span>
                  <span>Module {activeModule.number}</span>
                  <span>{activeModule.duration}</span>
                </div>
                <h1>{activeModule.title}</h1>
                <p>{activeModule.summary}</p>
                <div className="reader-actions">
                  <button className="solid-action" type="button" onClick={() => openRawResource(activeModule.rawUrl)}>
                    <FileText aria-hidden="true" /> Open raw source
                  </button>
                  <span>Rendered from the source Markdown stored in Digital Notes.</span>
                </div>
              </header>

              <div className="reader-rule" />
              <div className="markdown-surface">
                <Streamdown>{activeModule.content}</Streamdown>
              </div>
            </article>
          ) : (
            <>
              <section className="hero-panel" aria-labelledby="hero-title">
                <img src={heroImage} alt="An editorial study desk with notebooks and reference materials" />
                <div className="hero-copy">
                  <span className="eyebrow">{activeSubject.code} · complete course shelf</span>
                  <h1 id="hero-title">Notes for the long read.</h1>
                  <p>
                    {activeSubject.description} Read the rendered notes here, return to the source when you need it, and grow the collection one subject at a time.
                  </p>
                  <div className="hero-stats">
                    <span><BookOpen aria-hidden="true" /> {activeSubject.modules.length} modules</span>
                    <span><Clock3 aria-hidden="true" /> {activeSubject.courseHours} contact hours</span>
                  </div>
                </div>
              </section>

              <section className="shelf-heading" aria-labelledby="module-heading">
                <div>
                  <span className="eyebrow">Current subject</span>
                  <h2 id="module-heading">{activeSubject.title}</h2>
                </div>
                <div className="search-field">
                  <Search aria-hidden="true" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search this subject"
                    aria-label="Search modules in this subject"
                  />
                </div>
              </section>

              <section className="module-grid" aria-label="Module list">
                {filteredModules.length ? (
                  filteredModules.map((module, index) => (
                    <ModuleCard key={module.id} module={module} index={index} onOpen={openModule} />
                  ))
                ) : (
                  <div className="empty-search">
                    <Search aria-hidden="true" />
                    <h3>No module matches that search.</h3>
                    <p>Try a topic such as “motors”, “audit”, “harmonics”, or “life-cycle cost”.</p>
                  </div>
                )}
              </section>

              <section className="collection-strip" id="legacy-resources">
                <div className="collection-illustration">
                  <img src={libraryImage} alt="Illustrated academic shelf of reference volumes" />
                </div>
                <div className="collection-copy">
                  <span className="eyebrow">Legacy shelf</span>
                  <h2>Source material belongs in the same library.</h2>
                  <p>
                    Add earlier PDFs, slide decks, and archival references inside the top-level <code>digital notes/legacy</code> archive, organized by subject. They stay beside the rendered modules and open as raw GitHub files when needed.
                  </p>
                  {activeSubject.legacy.length ? (
                    <div className="legacy-list">
                      {activeSubject.legacy.map((resource) => (
                        <button key={resource.path} type="button" onClick={() => openRawResource(resource.rawUrl)}>
                          <span>
                            <b>{resource.title}</b>
                            <small>{resource.type}{resource.description ? ` · ${resource.description}` : ""}</small>
                          </span>
                          <ArrowUpRight aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="legacy-empty">
                      <Bookmark aria-hidden="true" />
                      <span>No legacy resources have been added for this subject yet.</span>
                    </div>
                  )}
                </div>
              </section>

              <section className="library-ritual">
                <img src={studyImage} alt="Warm editorial study materials arranged on a desk" />
                <div>
                  <span className="eyebrow">Built to grow</span>
                  <h2>One convention. Every future subject.</h2>
                  <p>
                    The library is driven by subject manifests, so another course needs only a folder, a few module files, and a single synchronization step. Navigation, reading views, raw-source links, and legacy resources adapt automatically.
                  </p>
                  <a href="https://github.com/prayasdev/lecture-notes#digital-notes-library" target="_blank" rel="noreferrer" className="text-action">
                    Read the contributor guide <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </section>
            </>
          )}
        </main>

        <aside className="context-rail" aria-label="Current subject context">
          <div className="rail-card">
            <span className="eyebrow">On this shelf</span>
            <h2>{activeSubject.shortTitle}</h2>
            <p>{activeSubject.courseHours} total contact hours</p>
            <div className="module-markers">
              {activeSubject.modules.map((module) => (
                <button
                  type="button"
                  key={module.id}
                  className={activeModule?.id === module.id ? "is-reading" : ""}
                  onClick={() => openModule(module.id)}
                  title={`Open Module ${module.number}: ${module.title}`}
                >
                  {module.number}
                </button>
              ))}
            </div>
          </div>

          <div className="rail-card rail-tip">
            <LibraryBig aria-hidden="true" />
            <h3>Reading convention</h3>
            <p>Rendered notes stay in the library. Raw Markdown stays one click away for citation, reuse, or offline workflows.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
