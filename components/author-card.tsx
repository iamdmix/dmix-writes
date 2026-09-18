import Link from "next/link";
import { author } from "@/lib/seo";

const personalSite = "https://dharmikshinde.tech";
const githubProfile = "https://github.com/iamdmix";

export function AuthorCard() {
  return (
    <section className="author-card" aria-label="About the author">
      <h2 className="metadata">written by</h2>
      <p className="author-name">
        <Link href={personalSite} target="_blank" rel="noopener noreferrer">
          {author.name}
          <span aria-hidden="true"> ↗</span>
        </Link>
      </p>
      <p className="author-bio">
        Systems engineer behind dmix writes — writing about containers, Linux internals, and
        macOS tooling from hands-on experience, one sharp edge at a time.
      </p>
      <p className="author-links metadata">
        <a href={githubProfile} target="_blank" rel="noopener noreferrer">
          github/iamdmix
        </a>
        <a href={personalSite} target="_blank" rel="noopener noreferrer">
          dharmikshinde.tech
        </a>
      </p>
    </section>
  );
}
