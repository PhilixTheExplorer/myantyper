export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://myantyper.com"
).replace(/\/$/, "");

export const SITE_NAME = "MyanTyper";
export const GITHUB_REPO_URL = "https://github.com/PhilixTheExplorer/myantyper";
export const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;
export const GITHUB_SPONSOR_URL =
  "https://github.com/sponsors/PhilixTheExplorer";
export const PRIVACY_EMAIL = "philix.oss@gmail.com";

export function techArticleSchema({
  path,
  headline,
  description,
}: {
  path: string;
  headline: string;
  description: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline,
    description,
    url: `${SITE_URL}${path}`,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      sameAs: [GITHUB_REPO_URL],
    },
  };
}
