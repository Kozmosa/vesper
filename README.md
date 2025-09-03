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
npm install
npm start
```

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
```