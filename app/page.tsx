"use client";

import { useEffect, useState } from "react";

type Repository = {
  id: number;
  name: string;
  description: string | null;
  stars: number;
  updatedAt: string;
  openIssues: number;
  language: string | null;
  license: string | null;
  hasReadme: boolean;
  contributors: number;
  latestCommit: string | null;
};

const getRescueScore = (repo: Repository) => {
  return (
    (repo.openIssues > 0 ? 1 : 0) +
    (repo.contributors > 0 ? 1 : 0) +
    (repo.hasReadme ? 1 : 0) +
    (repo.license ? 1 : 0) +
    (repo.latestCommit &&
    new Date(repo.latestCommit) >
      new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
      ? 2
      : 0)
  );
};

const getRescueOpportunity = (
  repo: Repository,
  score: number
) => {
  if (
    repo.openIssues > 0 &&
    repo.contributors > 0 &&
    repo.hasReadme &&
    repo.license &&
    repo.latestCommit &&
    new Date(repo.latestCommit) >
      new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
  ) {
    return `Strong contribution opportunity (${score}/6)`;
  }

  if (
    repo.openIssues > 0 &&
    repo.contributors > 0
  ) {
    return "Some positive signals — review the missing evidence";
  }

  return "Needs closer review";
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLatestButton, setShowLatestButton] =
    useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLatestButton(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) {
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);
    setError("");
    setRepositories([]);

    try {
      const response = await fetch(
        `/api/github?repo=${encodeURIComponent(
          search.trim()
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong."
        );
      }

      setRepositories(data.repositories || []);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="rescue-background min-h-screen text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 py-12 text-center">

        <p className="text-sm font-medium uppercase tracking-widest">
          Open Source Project Rescue Engine
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
          Rescue Open Source Projects
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8">
          Search GitHub for projects that may be dormant or
          stale and identify evidence that could make them
          worth investigating.
        </p>

        <div className="mt-10 flex w-full max-w-2xl flex-col gap-3 sm:flex-row">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search GitHub, e.g. microsoft"
            className="flex-1 rounded-xl border border-white/40 bg-black/40 px-5 py-4 text-white placeholder:text-white/60 outline-none backdrop-blur-md"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="rounded-xl border border-white/40 bg-white/20 px-7 py-4 font-semibold text-white backdrop-blur-sm transition hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>

        </div>

        {error && (
          <p className="mt-5 rounded-xl border border-red-300/40 bg-red-500/20 px-5 py-3 text-red-100">
            {error}
          </p>
        )}

        {loading && (
          <p className="mt-10 text-lg">
            Searching GitHub for dormant and stale projects...
          </p>
        )}

        {!loading && repositories.length > 0 && (
          <div className="mt-12 w-full space-y-6">

            <div className="mb-8">
              <p className="text-sm uppercase tracking-widest">
                Search results
              </p>

              <h2 className="mt-2 text-3xl font-bold">
              Showing {repositories.length} of{" "}
              {totalCount.toLocaleString()} repositories
            </h2>

              <p className="mt-2 text-white/80">
                Evidence, not verdicts — review each project
                before deciding whether it needs rescuing.
              </p>
            </div>

            {repositories.map((repo) => {
              const rescueScore =
                getRescueScore(repo);

              const rescueOpportunity =
                getRescueOpportunity(
                  repo,
                  rescueScore
                );

              return (
                <div
                  key={repo.id}
                  className="rounded-2xl border border-white/30 bg-white/10 p-6 text-center backdrop-blur-md"
                >

                  <p className="text-sm font-semibold uppercase tracking-wider">
                    🔎 Dormant or stale — worth investigating
                  </p>

                  <h2 className="mt-3 text-2xl font-bold text-white">
                    {repo.name}
                  </h2>

                  <a
                    href={`https://github.com/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block rounded-xl border border-white/40 bg-white/20 px-5 py-2 font-medium text-white backdrop-blur-sm transition hover:bg-white/30"
                  >
                    🔗 View this repository on GitHub →
                  </a>

                  <p className="mt-4 text-white/90">
                  {repo.description
                    ? repo.description.length > 300
                      ? `${repo.description.slice(0, 300)}… [description truncated]`
                      : repo.description
                    : "No description available."}
                </p>

                  <div className="mt-5 space-y-2 text-sm">

                    <p>
                      ⭐{" "}
                      {(repo.stars ?? 0).toLocaleString()} stars
                    </p>

                    <p>
                      🕒 Last updated:{" "}
                      {new Date(
                        repo.updatedAt
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      🐛{" "}
                      {(repo.openIssues ?? 0).toLocaleString()} open issues
                    </p>

                    <p>
                      👥{" "}
                      {(repo.contributors ?? 0).toLocaleString()} contributors
                    </p>

                    <p>
                      💻{" "}
                      {repo.language ||
                        "Language not detected"}
                    </p>

                    <p>
                      📖 README:{" "}
                      {repo.hasReadme
                        ? "Available"
                        : "Not detected"}
                    </p>

                    <p>
                      ⚖️{" "}
                      {repo.license
                        ? `License: ${repo.license}`
                        : "No license detected"}
                    </p>

                    <p>
                      🧑‍💻 Latest commit:{" "}
                      {repo.latestCommit
                        ? new Date(
                            repo.latestCommit
                          ).toLocaleDateString()
                        : "Not detected"}
                    </p>

                  </div>

                  <div className="mt-6 rounded-xl border border-white/20 bg-black/20 px-5 py-4">

                    <p className="text-sm uppercase tracking-wider text-white/70">
                      Rescue assessment
                    </p>

                    <p className="mt-2 text-lg font-semibold text-white">
                      {rescueOpportunity}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>
        )}

        {showLatestButton && (
  <div className="mt-5 text-center">
    <a
      href="/latest"
      className="stale-project-button inline-block rounded-xl border border-white/40 px-6 py-3 font-medium text-white backdrop-blur-sm"
    >
      🔎 Explore Dormant & Stale Projects →
    </a>

    <p className="mt-3 text-sm text-white/80">
      Browse other stale projects on GitHub
    </p>
  </div>
)}
        <footer className="mt-auto pt-10 text-base font-medium text-blue-400">
          Powered by Codyza
        </footer>

      </section>
    </main>
  );
}