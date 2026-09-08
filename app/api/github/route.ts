import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("repo");

  if (!search) {
    return NextResponse.json(
      { error: "Please enter a search term." },
      { status: 400 }
    );
  }

  const query = encodeURIComponent(
    `${search} stars:>5`
  );

  const response = await fetch(
    `https://api.github.com/search/repositories?q=${query}&sort=updated&order=asc&per_page=10`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "GitHub search failed." },
      { status: response.status }
    );
  }

  const searchData = await response.json();

  const repositories = await Promise.all(
    (searchData.items || []).slice(0, 10).map(async (repo: any) => {
      const readmeResponse = await fetch(
        `https://api.github.com/repos/${repo.full_name}/readme`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        }
      );

      const contributorsResponse = await fetch(
        `https://api.github.com/repos/${repo.full_name}/contributors?per_page=1`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        }
      );

      const contributorsData = await contributorsResponse.json();

      const commitsResponse = await fetch(
        `https://api.github.com/repos/${repo.full_name}/commits?per_page=1`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        }
      );

      const commitsData = await commitsResponse.json();

      const contributorsLink =
        contributorsResponse.headers.get("link");

      const contributors = contributorsLink
        ? Number(
            contributorsLink.match(
              /page=(\d+)>; rel="last"/
            )?.[1] || 1
          )
        : Array.isArray(contributorsData)
        ? contributorsData.length
        : 0;

      return {
        id: repo.id,
        name: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        updatedAt: repo.updated_at,
        openIssues: repo.open_issues_count,
        language: repo.language,
        license: repo.license?.spdx_id || null,
        hasReadme: readmeResponse.ok,
        contributors,
        latestCommit:
          commitsData[0]?.commit?.author?.date || null,
      };
    })
  );

  return NextResponse.json({
  repositories,
  totalCount: searchData.total_count || 0,
});
}