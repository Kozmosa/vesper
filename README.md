# Course Schedule Analyzer

A React application for analyzing multiple course schedules and visualizing free time intersections.

## Features

- Upload multiple course schedule files
- Parse and process schedule data
- Calculate free time intersections across all schedules
- Weekly visualization with linear time mapping
- Local storage persistence with user permission
- Configurable UI and behavior

## Getting Started

```bash
npm install --force
npm start
```

## Build for Production

```bash
npm run build
```

The build creates a `build/` directory with static files ready for deployment.

## Deployment

This project is automatically deployed to GitHub Pages via GitHub Actions:

- **Automatic Deployment**: Every push to the `main` branch triggers a build and deployment
- **GitHub Pages**: The site is served from the `gh-pages` branch
- **CI/CD Pipeline**: 
  1. Install dependencies with `npm install --force`
  2. Build the React app with `CI=false npm run build` 
  3. Deploy static files to GitHub Pages

The deployment workflow is defined in `.github/workflows/deploy.yml`.

## File Format

The application expects JSON files with the following structure:
- Time configuration object
- Array of time slots
- Course table metadata
- Course definitions
- Schedule entries

## Usage

1. Upload one or more schedule files
2. Grant permission for local storage (optional)
3. View the weekly visualization showing free time intersections
4. Previously uploaded schedules are remembered for convenience