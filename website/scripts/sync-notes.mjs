/**
 * Nalanda Archive — distributed subject-manifest synchronizer.
 * Each subject owns its metadata; this script only creates an internal website index.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repositoryRoot = path.resolve(__dirname, '../..');
const digitalNotesRoot = path.join(repositoryRoot, 'digital notes');
const subjectsRoot = path.join(digitalNotesRoot, 'subjects');
const outputPath = path.join(repositoryRoot, 'website', 'src', 'library.generated.ts');
const owner = 'prayasdev';
const repository = 'lecture-notes';
const branch = 'main';

const extensions = {
  legacy: new Set(['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.zip']),
  practical: new Set(['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.md', '.ipynb', '.py', '.m', '.c', '.cpp', '.js']),
};

const rawUrl = (relativePath) =>
  `https://raw.githubusercontent.com/${owner}/${repository}/${branch}/${relativePath
    .split(path.sep)
    .map(encodeURIComponent)
    .join('/')}`;

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const titleFromFilename = (filename) =>
  filename
    .replace(path.extname(filename), '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

function listResources(directory, rootDirectory, allowedExtensions) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listResources(absolutePath, rootDirectory, allowedExtensions);
    const extension = path.extname(entry.name).toLowerCase();
    if (entry.name.startsWith('.') || !allowedExtensions.has(extension)) return [];
    return [{
      path: path.relative(rootDirectory, absolutePath).split(path.sep).join('/'),
      title: titleFromFilename(entry.name),
      type: extension.slice(1).toUpperCase(),
      source: 'local',
    }];
  });
}

function mergeResources(discovered, registered, repositoryRelativeDirectory) {
  const overrides = new Map((registered || []).filter((resource) => resource.path).map((resource) => [resource.path, resource]));
  const indexed = discovered.map((resource) => ({ ...resource, ...(overrides.get(resource.path) || {}) }));
  const externalOnly = (registered || []).filter((resource) => !resource.path || !indexed.some((item) => item.path === resource.path));
  return [...indexed, ...externalOnly].map((resource) => ({
    ...resource,
    rawUrl: resource.url || rawUrl(path.join('digital notes', repositoryRelativeDirectory, resource.path || '')),
  }));
}

const subjectDirectories = fs
  .readdirSync(subjectsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const subjects = subjectDirectories.map((subjectSlug) => {
  const subjectDirectory = path.join(subjectsRoot, subjectSlug);
  const manifest = readJson(path.join(subjectDirectory, 'manifest.json'));

  const modules = (manifest.modules || []).map((module) => {
    const markdownPath = path.join(subjectDirectory, 'modules', module.id, module.file);
    const repositoryModulePath = path.relative(repositoryRoot, markdownPath);
    const assetBaseUrl = rawUrl(path.relative(repositoryRoot, path.join(subjectDirectory, 'modules', module.id, 'assets')));
    const content = fs.readFileSync(markdownPath, 'utf8').replaceAll('](assets/', `](${assetBaseUrl}/`);
    return {
      ...module,
      collection: 'digital',
      sourcePath: repositoryModulePath.split(path.sep).join('/'),
      rawUrl: rawUrl(repositoryModulePath),
      content,
    };
  });

  const legacyDirectory = manifest.legacyDirectory || `legacy/${subjectSlug}`;
  const practicalDirectory = manifest.practicalDirectory || `practical/${subjectSlug}`;
  const legacy = mergeResources(
    listResources(path.join(digitalNotesRoot, legacyDirectory), path.join(digitalNotesRoot, legacyDirectory), extensions.legacy),
    manifest.legacy,
    legacyDirectory,
  ).map((resource) => ({ ...resource, collection: 'legacy' }));
  const practical = mergeResources(
    listResources(path.join(digitalNotesRoot, practicalDirectory), path.join(digitalNotesRoot, practicalDirectory), extensions.practical),
    manifest.practical,
    practicalDirectory,
  ).map((resource) => ({ ...resource, collection: 'practical' }));

  return { ...manifest, modules, legacy, practical };
});

const categories = Array.from(
  new Map(
    subjects.map((subject) => [subject.categoryId || subject.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-'), {
      id: subject.categoryId || subject.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      label: subject.category || 'Uncategorised',
    }]),
  ).values(),
).sort((a, b) => a.label.localeCompare(b.label));

const source = `/**\n * Generated by website/scripts/sync-notes.mjs.\n * This is a build artifact assembled from distributed subject manifests.\n */\nexport const library = ${JSON.stringify(
  { owner, repository, branch, subjects, categories },
  null,
  2,
)} as const;\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, source, 'utf8');
console.log(`Synced ${subjects.length} subject manifest(s) and ${categories.length} category label(s).`);
