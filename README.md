# Open Source Project Rescue Engine

## Overview

The **Open Source Project Rescue Engine** is a web-based discovery tool designed to help developers find dormant and stale GitHub repositories that may benefit from renewed maintenance, investigation, and community contribution.

Open-source projects can become inactive for many reasons. Valuable code, documentation, ideas, and learning opportunities can remain in repositories that receive little recent activity. This project provides a practical way to discover those repositories and review useful signals before deciding whether a project is worth exploring.

## Features

* 🔎 Search GitHub repositories using keywords
* ⭐ View repository star counts
* 🐛 View open issues
* 👥 View contributor information
* 💻 View the primary programming language
* 📄 Check README availability
* ⚖️ Display available licence information
* 🔄 Review recent commit activity
* 📊 Calculate a simple rescue-opportunity score
* 🕐 Explore dormant and stale repositories
* 📅 Filter projects by creation date
* ↕️ Sort projects by stars, creation date, and update activity
* 🔗 Open repositories directly on GitHub

## How It Works

1. Enter a search term into the Rescue Engine.
2. The application searches GitHub repositories using the GitHub REST API.
3. Repository information is collected and presented in the interface.
4. Project signals such as issues, contributors, README availability, licence information, and recent commits are displayed.
5. A rescue-opportunity score provides an additional indication of which repositories may be worth investigating.
6. Users can explore individual repositories directly on GitHub.

The scoring system is intended as a **discovery aid**, not a definitive judgement that a project has been abandoned. Repository activity should always be reviewed in context.

## Dormant & Stale Projects

The project includes a dedicated area for discovering potentially inactive repositories.

Users can explore projects using:

* Creation-year ranges
* Star counts
* Update activity
* Newest or oldest creation dates
* Recently updated or longest-since-update projects

This helps developers discover projects that may otherwise be overlooked.

## Technologies Used

* **Next.js** — Web application framework
* **React** — Interactive user interface
* **TypeScript** — Type-safe development
* **Tailwind CSS** — Responsive styling and interface design
* **GitHub REST API** — Live repository data
* **Git** — Version control
* **GitHub** — Source-code hosting
* **Visual Studio Code** — Development environment
* **Vercel** — Production deployment

## Getting Started

### Prerequisites

You will need:

* Node.js
* npm
* A GitHub account
* A GitHub personal access token for API access

### Installation

Clone the repository:

```bash
git clone https://github.com/axelkrogness1997-ui/Open-Source-Project-Rescue-Engine.git
```

Move into the project directory:

```bash
cd Open-Source-Project-Rescue-Engine
```

Install dependencies:

```bash
npm install
```

### Environment Variable

Create a local `.env.local` file and add your GitHub token:

```text
GITHUB_TOKEN=your_github_token
```

Do **not** commit your `.env.local` file to GitHub.

### Run the Development Server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Project Structure

```text
app/
├── api/
│   └── github/
│       └── route.ts
├── latest/
│   └── page.tsx
├── globals.css
└── page.tsx

public/
└── rescue-bg.png
```

The main page provides the repository search experience, while the `/latest` route provides the dormant and stale project discovery experience.

The GitHub API route handles repository searches and retrieves additional repository information required by the Rescue Engine.

## Deployment

The project is deployed using **Vercel** and connected to the GitHub repository.

The production application can be accessed at:

https://open-source-project-rescue-engine.vercel.app

## Project Goal

The goal of the Open Source Project Rescue Engine is to make discovering potentially overlooked open-source projects easier.

By combining GitHub repository search with useful project-health signals, the application aims to help developers identify opportunities for:

* Open-source contribution
* Project maintenance
* Code exploration
* Learning
* Community collaboration

**Built to help developers discover open-source projects that may still have something worth rescuing.**
