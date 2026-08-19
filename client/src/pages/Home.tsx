/**
 * Nalanda Archive design system: a catalogue-first scholarly interface powered by distributed subject manifests.
 * Typography balances Noto Serif display, Source Serif reading, and DM Sans navigation; the header joins the archive mark to Prayas's portfolio identity.
 * The only fixed vocabulary is collection-level; subjects, categories, modules, and resources come from library.generated.ts.
 */
import "katex/dist/katex.min.css";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { defaultRehypePlugins, defaultRemarkPlugins, Streamdown } from "streamdown";
import type { StreamdownProps } from "streamdown";
import {
  Archive,
  ArrowLeft,
  ArrowUpRight,
  BookOpenText,
  ChevronRight,
  FileText,
  FlaskConical,
  FolderOpen,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { library } from "../../../website/src/library.generated";

type CollectionKey = "all" | "digital" | "legacy" | "practical";
type ContentCollectionKey = Exclude<CollectionKey, "all">;

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
const archiveMark = "/manus-storage/prayas-archive-mark-01_d3f5e7c2.png";

const collectionMeta: Record<CollectionKey, { label: string; icon: typeof BookOpenText }> = {
  all: { label: "All", icon: FolderOpen },
  digital: { label: "Digital", icon: BookOpenText },
  legacy: { label: "Legacy", icon: Archive },
  practical: { label: "Practical", icon: FlaskConical },
};

const readerRemarkPlugins: NonNullable<StreamdownProps["remarkPlugins"]> = [
  defaultRemarkPlugins.gfm,
  [remarkMath, { singleDollarTextMath: true }],
];

const readerRehypePlugins: NonNullable<StreamdownProps["rehypePlugins"]> = [
  defaultRehypePlugins.harden,
  defaultRehypePlugins.raw,
  [rehypeKatex, { throwOnError: false, strict: "ignore" }],
];

function normalizeMathDelimiters(markdown: string) {
  return markdown
    .replace(/\\\[\s*\n?([\s\S]*?)\n?\s*\\\]/g, (_match, expression: string) => {
      const normalizedExpression = expression.trim();
      return /^[\d\s,;–-]+$/.test(normalizedExpression)
        ? `[${normalizedExpression}]`
        : `$$\n${normalizedExpression}\n$$`;
    })
    .replace(/\\\(([\s\S]*?)\\\)/g, (_match, expression: string) => `$${expression.trim()}$`);
}

function subjectCount(subject: SubjectItem, collection: CollectionKey) {
  if (collection === "digital") return subject.modules.length;
  if (collection === "legacy") return subject.legacy.length;
  if (collection === "practical") return subject.practical.length;
  return subject.modules.length + subject.legacy.length + subject.practical.length;
}

function availableCollections(subject: SubjectItem): ContentCollectionKey[] {
  return (["digital", "legacy", "practical"] as const).filter((collection) => subjectCount(subject, collection) > 0);
}

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function CollectionMark({ collection }: { collection: ContentCollectionKey }) {
  const Icon = collectionMeta[collection].icon;
  return (
    <span className={`collection-mark collection-mark--${collection}`}>
      <Icon aria-hidden="true" />
      {collectionMeta[collection].label}
    </span>
  );
}

function SubjectRow({ subject, onOpen }: { subject: SubjectItem; onOpen: () => void }) {
  const available = availableCollections(subject);
  return (
    <article className="subject-row">
      <div className="subject-code"><span>Register</span><b>{subject.code}</b></div>
      <div className="subject-primary">
        <h3>{subject.title}</h3>
        <p>{subject.description}</p>
      </div>
      <div className="subject-category"><span>Discipline</span><b>{subject.category}</b></div>
      <div className="subject-collections" aria-label="Available collections">
        {available.map((collection) => {
          const Icon = collectionMeta[collection].icon;
          return <span key={collection} title={`${subjectCount(subject, collection)} ${collectionMeta[collection].label.toLowerCase()} item(s)`}><Icon aria-hidden="true" /> <b>{subjectCount(subject, collection)}</b><small>{collectionMeta[collection].label}</small></span>;
        })}
      </div>
      <button className="row-open" type="button" onClick={onOpen} aria-label={`Open ${subject.title}`}>
        <ChevronRight aria-hidden="true" />
      </button>
    </article>
  );
}

function ResourceList({ resources, collection }: { resources: ResourceItem[]; collection: "legacy" | "practical" }) {
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
  const [selectedCollection, setSelectedCollection] = useState<ContentCollectionKey>("digital");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const selectedSubject = useMemo(
    () => subjects.find((subject) => subject.id === selectedSubjectId) ?? null,
    [selectedSubjectId],
  );
  const selectedModule = useMemo(
    () => selectedSubject?.modules.find((module) => module.id === selectedModuleId) ?? null,
    [selectedModuleId, selectedSubject],
  );
  const renderedModuleContent = useMemo(
    () => selectedModule ? normalizeMathDelimiters(selectedModule.content) : "",
    [selectedModule],
  );
  const selectedSubjectCollections = useMemo(
    () => (selectedSubject ? availableCollections(selectedSubject) : []),
    [selectedSubject],
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

  const openSubject = (subject: SubjectItem, preferredCollection?: ContentCollectionKey) => {
    setSelectedSubjectId(subject.id);
    setSelectedModuleId(null);
    const available = availableCollections(subject);
    const requested = preferredCollection ?? (collection === "all" ? undefined : collection);
    const targetCollection = requested && available.includes(requested) ? requested : available[0] ?? "digital";
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
    if (selectedSubject && !selectedSubjectCollections.includes(selectedCollection)) {
      setSelectedCollection(selectedSubjectCollections[0] ?? "digital");
    }
  }, [selectedSubject, selectedCollection, selectedSubjectCollections]);

  return (
    <div className="nalanda-app" style={{ "--lattice": `url(${latticeImage})` } as CSSProperties}>
      <header className="archive-topbar">
        <button type="button" className="archive-brand" onClick={backToCatalogue} aria-label="Return to archive catalogue">
          <span className="archive-brand-mark"><img src={archiveMark} alt="" /></span>
          <span>
            <small>Academic archive</small>
            <b>Lecture Notes</b>
          </span>
        </button>
        <a className="portfolio-cta" href="https://prayas.is-a.dev" target="_blank" rel="noreferrer" aria-label="Visit Prayas Das portfolio">
          <span><small>Built by</small><b>prayas.is-a.dev</b></span><ArrowUpRight aria-hidden="true" />
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
            <div className="manuscript-content">
              <Streamdown
                parseIncompleteMarkdown={false}
                remarkPlugins={readerRemarkPlugins}
                rehypePlugins={readerRehypePlugins}
              >
                {renderedModuleContent}
              </Streamdown>
            </div>
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
              {selectedSubjectCollections.map((collection) => <span key={collection}>{subjectCount(selectedSubject, collection)}<small>{collectionMeta[collection].label}</small></span>)}
            </div>
          </header>

          {selectedSubjectCollections.length > 1 ? <div className="subject-tabs" role="tablist" aria-label="Subject collections">
            {selectedSubjectCollections.map((key) => {
              const Icon = collectionMeta[key].icon;
              return (
                <button key={key} type="button" role="tab" aria-selected={selectedCollection === key} className={selectedCollection === key ? "is-active" : ""} onClick={() => setSelectedCollection(key)}>
                  <Icon aria-hidden="true" /> {collectionMeta[key].label}
                </button>
              );
            })}
          </div> : selectedSubjectCollections[0] ? <div className="subject-collection-summary"><CollectionMark collection={selectedSubjectCollections[0]} /></div> : null}

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
              <p>Search the material each subject actually contains, without expanding the shelf.</p>
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
              <div className="collection-filter" aria-label="Collection shelf">
                <span className="collection-shelf-label">Collection shelf</span>
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
