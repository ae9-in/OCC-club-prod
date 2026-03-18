export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type SlugDelegate = {
  findUnique(args: unknown): Promise<unknown>;
};

export async function ensureUniqueSlug(modelDelegate: SlugDelegate, input: string, suffixField = "slug") {
  const base = slugify(input) || "item";
  let slug = base;
  let counter = 1;

  while (await modelDelegate.findUnique({ where: { [suffixField]: slug } })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}
