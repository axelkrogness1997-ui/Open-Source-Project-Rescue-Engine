"use client";

import { useEffect, useState } from "react";

type Repository = {
  id: number;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  updated_at: string;
  created_at: string;
  open_issues_count: number;
  language: string | null;
  license: {
    spdx_id: string | null;
  } | null;
};

type YearRange =
  | "2008-2012"
  | "2012-2016"
  | "2016-2020"
  | "2020-2024"
  | "2024-2026";

type SortOption =
  | "stars-desc"
  | "stars-asc"
  | "created-desc"
  | "created-asc"
  | "updated-desc"
  | "updated-asc";

const getAgeInYears = (date: string) => {
  return (
    (Date.now() - new Date(date).getTime()) /
    (1000 * 60 * 60 * 24 * 365.25)
  ).toFixed(1);
};

const getYear = (date: string) => {
  return new Date(date).getFullYear();
};

export default function LatestPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  const [yearRange, setYearRange] =
    useState<YearRange>("2008-2012");

  const [sortBy, setSortBy] =
    useState<SortOption>("updated-asc");

  useEffect(() => {
    const fetchRepositories = async () => {
      setLoading(true);

      try {
        const [startYear, endYear] = yearRange.split("-");

        const query = [
          "stars:>5",
          "forks:>0",
          `created:${startYear}-01-01..${endYear}-12-31`,
          "pushed:<2026-03-08",
        ].join(" ");

        const url =
          `https://api.github.com/search/repositories` +
          `?q=${encodeURIComponent(query)}` +
          `&sort=updated&order=asc&per_page=10`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("GitHub search failed");
        }

        const data = await response.json();

        const uniqueRepositories = Array.from(
          new Map(
            (data.items || []).map((repo: Repository) => [
              repo.full_name,
              repo,
            ])
          ).values()
        );

        setRepositories(
          uniqueRepositories.slice(0, 10) as Repository[]
        );
      } catch (error) {
        console.error("Failed to load repositories:", error);
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [yearRange]);

  const sortedRepositories = [...repositories].sort((a, b) => {
    if (sortBy === "stars-desc") {
      return b.stargazers_count - a.stargazers_count;
    }

    if (sortBy === "stars-asc") {
      return a.stargazers_count - b.stargazers_count;
    }

    if (sortBy === "created-desc") {
      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
    }

    if (sortBy === "created-asc") {
      return (
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
      );
    }

    if (sortBy === "updated-desc") {
      return (
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
      );
    }

    return (
      new Date(a.updated_at).getTime() -
      new Date(b.updated_at).getTime()
    );
  });

  return (
    <main className="rescue-background min-h-screen text-white">
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <p className="text-sm font-medium uppercase tracking-widest">
          Open Source Project Rescue Engine
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
          Dormant & Stale Projects
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8">
          These repositories may have been quiet for a long time. They are
          potential projects worth investigating, not automatically abandoned
          projects.
        </p>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/30 bg-transparent p-5 text-center backdrop-blur-sm">
          <label
            htmlFor="yearRange"
            className="font-medium"
          >
            Search year
          </label>

          <select
            id="yearRange"
            value={yearRange}
            onChange={(e) =>
              setYearRange(e.target.value as YearRange)
            }
            className="mx-auto mt-3 block w-full max-w-md rounded-xl border border-white/40 bg-black px-4 py-3 text-center text-white outline-none backdrop-blur-md"
          >
            <option value="2008-2012">
              🔎 2008–2012
            </option>

            <option value="2012-2016">
              🔎 2012–2016
            </option>

            <option value="2016-2020">
              🔎 2016–2020
            </option>

            <option value="2020-2024">
              🔎 2020–2024
            </option>

            <option value="2024-2026">
              🔎 2024–2026
            </option>
          </select>

          <label
            htmlFor="sort"
            className="mt-5 block font-medium"
          >
            Sort projects
          </label>

          <select
            id="sort"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as SortOption)
            }
            className="mx-auto mt-3 block w-full max-w-md rounded-xl border border-white/40 bg-black px-4 py-3 text-center text-white outline-none backdrop-blur-md"
          >
            <option value="stars-desc">
              ⭐ Most stars
            </option>

            <option value="stars-asc">
              ⭐ Fewest stars
            </option>

            <option value="created-desc">
              🏗️ Newest created
            </option>

            <option value="created-asc">
              🏗️ Oldest created
            </option>

            <option value="updated-desc">
              🕒 Recently updated
            </option>

            <option value="updated-asc">
              🕒 Longest since update
            </option>
          </select>
        </div>

        {loading ? (
          <p className="mt-12 text-lg">
            Searching GitHub for dormant and stale projects...
          </p>
        ) : sortedRepositories.length === 0 ? (
          <p className="mt-12 text-lg">
            No suitable projects were found for this year range.
          </p>
        ) : (
          <div className="mt-12 space-y-6">
            {sortedRepositories.map((repo) => (
              <div
                key={repo.full_name}
                className="rounded-2xl border border-white/30 bg-white/10 p-6 text-center backdrop-blur-md"
              >
                <p className="text-sm font-semibold uppercase tracking-wider">
                  🔎 Dormant or stale — worth investigating
                </p>

                <h2 className="mt-3 text-2xl font-bold">
                  {repo.full_name}
                </h2>

                <p className="mt-3 text-white/90">
                  {repo.description ||
                    "No description available."}
                </p>

                <div className="mt-5 space-y-2 text-sm">
                  <p>
                    ⭐{" "}
                    {repo.stargazers_count.toLocaleString()} stars
                  </p>

                  <p>
                    🕒 Last updated:{" "}
                    {new Date(
                      repo.updated_at
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    🏗️ Created:{" "}
                    {getYear(repo.created_at)} (
                    {getAgeInYears(repo.created_at)} years ago)
                  </p>

                  <p>
                    🐛{" "}
                    {repo.open_issues_count.toLocaleString()} open
                    issues
                  </p>

                  <p>
                    💻{" "}
                    {repo.language ||
                      "Language not detected"}
                  </p>

                  <p>
                    ⚖️{" "}
                    {repo.license?.spdx_id
                      ? `License: ${repo.license.spdx_id}`
                      : "No license detected"}
                  </p>
                </div>

                <a
                  href={`https://github.com/${repo.full_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-block rounded-xl border border-white/40 bg-white/20 px-5 py-2 font-medium text-white backdrop-blur-sm transition hover:bg-white/30"
                >
                  🔗 View on GitHub →
                </a>
              </div>
            ))}
          </div>
        )}

        <a
          href="https://github.com/search?q=stars%3A%3E5+forks%3A%3E0+pushed%3A%3C%3D2026-03-08&type=repositories&s=updated&o=asc"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-8 inline-block rounded-xl border border-white/40 bg-white/20 px-6 py-3 font-medium text-white backdrop-blur-sm transition hover:bg-white/30"
        >
          🔎 Browse more inactive projects on GitHub →
        </a>

        <footer className="mt-16 text-base font-medium text-blue-400">
          Powered by Codyza
        </footer>
      </section>
    </main>
  );
}