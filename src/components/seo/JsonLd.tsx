export type JsonLdPrimitive = string | number | boolean | null;

export type JsonLdValue =
  | JsonLdPrimitive
  | readonly JsonLdValue[]
  | { readonly [key: string]: JsonLdValue };

export type JsonLdObject = { readonly [key: string]: JsonLdValue };

/**
 * Renders a schema.org structured-data block as an inline
 * `<script type="application/ld+json">` tag for search engines.
 *
 * `<` is escaped to `<` per the Next.js JSON-LD guidance so that a stray
 * `</script>` sequence inside serialised content cannot break out of the tag.
 */
export function JsonLd({ data }: { data: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
