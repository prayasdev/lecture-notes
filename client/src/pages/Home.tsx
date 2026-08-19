/**
 * Nalanda Archive design system: a catalogue-first scholarly interface powered by distributed subject manifests.
 * The only fixed vocabulary is collection-level; subjects, categories, modules, and resources come from library.generated.ts.
 */
import { Streamdown } from "streamdown";
import {
  Archive,
  ArrowLeft,
  ArrowUpRight,
  BookOpenText,
  ChevronRight,
  FileText,
  FlaskConical,
  FolderOpen,
  Menu,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { library } from "../../../website/src/library.generated";

type CollectionKey = "all" | "digital" | "legacy" | "practical";

type ModuleItem = {
  id: string;
  number: string;
  title: string;
  summary: string;
  duration: string;
  rawUrl: string;
  content: string;
};

type ResourceItem = {
  path?: string;
  title: string;
  type: string;
  description?: string;
  source?: string;
  rawUrl: string;
  collection: "legacy" | "practical";
};

type SubjectItem = {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  category: string;
  categoryId: string;
  description: string;
  tags?: readonly string[];
  courseHours?: number;
  modules: ModuleItem[];
  legacy: ResourceItem[];
  practical: ResourceItem[];
};

type CategoryItem = { id: string; label: string };

const subjects = library.subjects as unknown as SubjectItem[];
const categories = library.categories as unknown as CategoryItem[];
const heroImage = "/manus-storage/nalanda-archive-hero_c37e3dda.png";
const latticeImage = "/manus-storage/nalanda-brick-lattice_45f8d117.png";
const sealImage = "/manus-storage/nalanda-archive-seal_65bf63f5.png";

const collectionMeta: Record<CollectionKey, { label: string; icon: typeof BookOpenText }> = {
  all: { label: "All", icon: FolderOpen },
  digital: { label: "Digital", icon: BookOpenText },
  legacy: { label: "Legacy", icon: Archive },
  practical: { label: "Practical", icon: FlaskConical },
};

function subjectCount(subject: SubjectItem, collection: CollectionKey) {
  if (collection === "digital") return subject.modules.length;
  if (collection === "legacy") return subject.legacy.length;
  if (collection === "practical") return subject.practical.length;
  return subject.modules.length + subject.legacy.length + subject.practical.length;
}

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function CollectionMark({ collection }: { collection: Exclude<CollectionKey, "all"> }) {
  const Icon = collectionMeta[collection].icon;
  return (
    <span className={`collection-mark collection-mark--${collection}`}>
      <Icon aria-hidden="true" />
      {collectionMeta[collection].label}
    </span>
  );
}

function SubjectRow({ subject, onOpen }: { subject: SubjectItem; onOpen: () => void }) {
  return (
    <article className="subject-row">
      <div className="subject-code">{subject.code}</div>
      <div className="subject-primary">
        <h3>{subject.title}</h3>
        <p>{subject.description}</p>
      </div>
      <div className="subject-category">{subject.category}</div>
      <div className="subject-collections" aria-label="Available collections">
        <span title={`${subject.modules.length} digital module(s)`}><BookOpenText aria-hidden="true" /> {subject.modules.length}</span>
        <span title={`${subject.legacy.length} legacy resource(s)`}><Archive aria-hidden="true" /> {subject.legacy.length}</span>
        <span title={`${subject.practical.length} practical resource(s)`}><FlaskConical aria-hidden="true" /> {subject.practical.length}</span>
      </div>
      <button className="row-open" type="button" onClick={onOpen} aria-label={`Open ${subject.title}`}>
        <ChevronRight aria-hidden="true" />
      </button>
    </article>
  );
}

function ResourceList({ resources, collection }: { resources: ResourceItem[]; collection: "legacy" | "practical" }) {
  if (!resources.length) {
    return (
      <div className="collection-empty">
        <span>{collectionMeta[collection].label} collection is ready for this subject.</span>
        <small>Add files to the matching archive folder, or register an external practical link in this subject’s manifest.</small>
      </div>
    );
  }

  return (
    <div className="resource-list">
      {resources.map((resource) => (
        <button key={`${resource.collection}-${resource.path ?? resource.title}`} type="button" className="resource-row" onClick={() => openExternal(resource.rawUrl)}>
          <span className={`resource-type resource-type--${collection}`}>{resource.type}</span>
          <span className="resource-name">
            <b>{resource.title}</b>
            {resource.description ? <small>{resource.description}</small> : null}
          </span>
          <ArrowUpRight aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [collection, setCollection] = useState<CollectionKey>("all");
  const [categoryId, setCategoryId] = useState("all");
  const [query, setQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Exclude<CollectionKey, "all">>("digital");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.id === selectedSubjectId) ?? null,
    [selectedSubjectId],
  );
  const selectedModule = useMemo(
    () => selectedSubject?.modules.find((module) => module.id === selectedModuleId) ?? null,
    [selectedModuleId, selectedSubject],
  );

  const filteredSubjects = useMemo(() => {
    const term = query.trim().toLowerCase();
    return subjects.filter((subject) => {
      const inCategory = categoryId === "all" || subject.categoryId === categoryId;
      const inCollection = collection === "all" || subjectCount(subject, collection) > 0;
      const searchable = [
        subject.title,
        subject.code,
        subject.category,
        subject.description,
        ...(subject.tags ?? []),
        ...subject.modules.flatMap((module) => [module.title, module.summary]),
        ...subject.legacy.map((resource) => resource.title),
        ...subject.practical.map((resource) => resource.title),
      ].join(" ").toLowerCase();
      return inCategory && inCollection && (!term || searchable.includes(term));
    });
  }, [categoryId, collection, query]);

  const resultLabel = collection === "all" ? "subjects" : `${collectionMeta[collection].label.toLowerCase()} subjects`;

  const openSubject = (subject: SubjectItem, preferredCollection?: Exclude<CollectionKey, "all">) => {
    setSelectedSubjectId(subject.id);
    setSelectedModuleId(null);
    const targetCollection = preferredCollection ?? (collection === "all" ? "digital" : collection);
    setSelectedCollection(targetCollection);
    setMobileFiltersOpen(false);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const backToCatalogue = () => {
    setSelectedSubjectId(null);
    setSelectedModuleId(null);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  useEffect(() => {
    if (selectedSubject && selectedCollection === "digital" && !selectedSubject.modules.length) {
      setSelectedCollection(selectedSubject.legacy.length ? "legacy" : "practical");
    }
  }, [selectedSubject, selectedCollection]);

  const activeCollectionIcon = collectionMeta[selectedCollection].icon;

  return (
    <div className="nalanda-app" style={{ "--lattice": `url(${latticeImage})` } as React.CSSProperties}>
      <header className="archive-topbar">
        <button type="button" className="seal-lockup" onClick={backToCatalogue} aria-label="Return to archive catalogue">
          <img src={sealImage} alt="" />
          <span>
            <b>Lecture Notes</b>
            <small>Nalanda archive</small>
          </span>
        </button>
        <nav className="archive-nav" aria-label="Collection navigation">
          {(Object.keys(collectionMeta) as CollectionKey[]).map((key) => {
            const Icon = collectionMeta[key].icon;
            return (
              <button
                key={key}
                type="button"
                className={collection === key && !selectedSubject ? "is-active" : ""}
                onClick={() => { setCollection(key); backToCatalogue(); }}
              >
                <Icon aria-hidden="true" /> {collectionMeta[key].label}
              </button>
            );
          })}
        </nav>
        <a className="top-repository" href={`https://github.com/${library.owner}/${library.repository}`} target="_blank" rel="noreferrer">
          Source <ArrowUpRight aria-hidden="true" />
        </a>
      </header>

      {selectedModule && selectedSubject ? (
        <main className="reader-shell">
          <button type="button" className="crumb-back" onClick={() => setSelectedModuleId(null)}>
            <ArrowLeft aria-hidden="true" /> {selectedSubject.code} / {collectionMeta[selectedCollection].label}
          </button>
          <article className="nalanda-reader">
            <header className="reader-intro">
              <span className="archive-kicker">{selectedSubject.category} · {selectedSubject.code} · Module {selectedModule.number}</span>
              <h1>{selectedModule.title}</h1>
              <div className="reader-actions">
                <span>{selectedModule.duration}</span>
                <button type="button" onClick={() => openExternal(selectedModule.rawUrl)}><FileText aria-hidden="true" /> Raw source</button>
              </div>
            </header>
            <div className="manuscript-content"><Streamdown>{selectedModule.content}</Streamdown></div>
          </article>
        </main>
      ) : selectedSubject ? (
        <main className="subject-shell">
          <button type="button" className="crumb-back" onClick={backToCatalogue}><ArrowLeft aria-hidden="true" /> Archive catalogue</button>
          <header className="subject-header">
            <div>
              <span className="archive-kicker">{selectedSubject.category}</span>
              <h1>{selectedSubject.title}</h1>
              <div className="subject-meta"><span>{selectedSubject.code}</span>{selectedSubject.tags?.map((tag) => <span key={tag}>#{tag}</span>)}</div>
            </div>
            <div className="subject-counts">
              <span>{selectedSubject.modules.length}<small>Digital</small></span>
              <span>{selectedSubject.legacy.length}<small>Legacy</small></span>
              <span>{selectedSubject.practical.length}<small>Practical</small></span>
            </div>
          </header>

          <div className="subject-tabs" role="tablist" aria-label="Subject collections">
            {(["digital", "legacy", "practical"] as const).map((key) => {
              const Icon = collectionMeta[key].icon;
              return (
                <button key={key} type="button" role="tab" aria-selected={selectedCollection === key} className={selectedCollection === key ? "is-active" : ""} onClick={() => setSelectedCollection(key)}>
                  <Icon aria-hidden="true" /> {collectionMeta[key].label}
                </button>
              );
            })}
          </div>

          <section className="subject-collection-panel">
            {selectedCollection === "digital" ? (
              <div className="module-directory">
                {selectedSubject.modules.map((module) => (
                  <button key={module.id} type="button" className="module-row" onClick={() => setSelectedModuleId(module.id)}>
                    <span className="module-number">{module.number}</span>
                    <span className="module-title"><b>{module.title}</b><small>{module.summary}</small></span>
                    <span className="module-duration">{module.duration}</span>
                    <ChevronRight aria-hidden="true" />
                  </button>
                ))}
              </div>
            ) : (
              <ResourceList resources={selectedCollection === "legacy" ? selectedSubject.legacy : selectedSubject.practical} collection={selectedCollection} />
            )}
          </section>
        </main>
      ) : (
        <main className="catalogue-shell">
          <section className="catalogue-lead">
            <div className="lead-copy">
              <span className="archive-kicker">Distributed subject archive</span>
              <h1>Archive catalogue</h1>
              <p>Search across notes, original documents, and practical material without expanding the shelf.</p>
            </div>
            <figure className="archive-plate">
              <img src={heroImage} alt="Warm brick cloister study space inspired by a historic scholarly archive" />
              <figcaption><Archive aria-hidden="true" /> Archive plate · study court</figcaption>
            </figure>
          </section>

          <section className="catalogue-controls" aria-label="Archive filters">
            <div className="catalogue-search">
              <Search aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subjects, modules, tags, or resources" aria-label="Search the archive" />
              <kbd>/</kbd>
            </div>
            <button type="button" className="mobile-filter-toggle" onClick={() => setMobileFiltersOpen((open) => !open)} aria-expanded={mobileFiltersOpen}>
              {mobileFiltersOpen ? <X aria-hidden="true" /> : <SlidersHorizontal aria-hidden="true" />} Filters
            </button>
            <div className={`filter-bank ${mobileFiltersOpen ? "is-open" : ""}`}>
              <div className="collection-filter">
                {(Object.keys(collectionMeta) as CollectionKey[]).map((key) => {
                  const Icon = collectionMeta[key].icon;
                  return (
                    <button key={key} type="button" className={collection === key ? "is-active" : ""} onClick={() => setCollection(key)}>
                      <Icon aria-hidden="true" /> {collectionMeta[key].label}
                    </button>
                  );
                })}
              </div>
              <label className="category-select">
                <span>Category</span>
                <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                  <option value="all">All disciplines</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="catalogue-results" aria-live="polite">
            <header className="results-heading">
              <div><span className="archive-kicker">Archive index</span><h2>{filteredSubjects.length} {resultLabel}</h2></div>
              <span className="results-note">Manifest-driven · no central catalogue to maintain</span>
            </header>
            <div className="directory-labels" aria-hidden="true"><span>Code</span><span>Subject</span><span>Category</span><span>Collections</span><span /></div>
            <div className="subject-directory">
              {filteredSubjects.map((subject) => <SubjectRow key={subject.id} subject={subject} onOpen={() => openSubject(subject)} />)}
              {!filteredSubjects.length ? <div className="no-results">No archive entries match those filters.</div> : null}
            </div>
          </section>
        </main>
      )}

      <footer className="archive-footer">
        <span>Distributed manifests · scalable archive</span>
        <span>Digital · Legacy · Practical</span>
      </footer>
    </div>
  );
}
