# Farouk.Studio

A polished portfolio website built with Next.js, React, Tailwind CSS, and GSAP animations. The project delivers a modern, interactive landing experience with smooth scrolling, animated page transitions, and a reusable component structure.

## Key Features

- Responsive portfolio landing page with hero, about, projects, playground, and contact sections
- Smooth scrolling and preloader wrapper for refined page transitions
- GSAP-powered animation support through `@gsap/react`
- Clean component-driven layout with reusable UI sections
- Tailwind CSS v4 configured for modern styling and utility-first development

## Project Structure

- `app/` - Next.js App Router entrypoints and global layout
- `app/page.tsx` - Main landing page layout that composes the page sections
- `app/layout.tsx` - Root layout with metadata and global wrappers
- `app/components/` - UI sections and page components
- `app/components/wrapper/PreloaderWrapper.tsx` - Preloader wrapper component
- `app/components/SmoothScroll.tsx` - Smooth scroll wrapper component
- `public/` - Static assets and public files

## Technologies

- Next.js 16.2.2
- React 19.2.4
- Tailwind CSS 4
- GSAP 3.14.2
- Lenis smooth scroll library
- Lucide React icons
- TypeScript
- ESLint

## Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally.

## Scripts

- `npm run dev` - start the Next.js development server
- `npm run build` - build the production application
- `npm run start` - run the production build locally
- `npm run lint` - run ESLint checks

## Deployment

This project is ready to deploy on platforms that support Next.js, such as Vercel or Netlify. For Vercel, simply connect the repository and use the default build command:

```bash
npm run build
```

## Notes

- The app uses the Next.js App Router with a custom `RootLayout`
- Styling is handled globally in `app/globals.css`
- Page composition is managed through modular components imported in `app/page.tsx`

## Contact

For updates or customization, modify the components under `app/components/` and adjust layout behavior in `app/layout.tsx`.
