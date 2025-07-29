# Gemini Code Generation Guide

This document provides guidelines for interacting with the codebase to ensure consistency and adherence to project standards.

## Project Overview

This is a personal finance management application built with the T3 Stack, featuring:

- **Framework:** Next.js (including React Server Components)
- **API:** tRPC for end-to-end typesafe APIs
- **ORM:** Prisma for database access
- **Styling:** Tailwind CSS with Shadcn UI components
- **Linting & Formatting:** Biome
- **Validation, Error Handling & Schemas:** Effect-ts
- **Language:** TypeScript

## File Structure

The project follows a feature-based organization within the `src/features` directory. Each feature encapsulates its own logic, including TRPC routers, services, schemas, and UI components.

- **`src/app`**: Contains the Next.js pages and layouts.
- **`src/components`**: Holds shared, reusable UI components.
  - **`src/components/ui`**: Shadcn UI components.
- **`src/features`**: Houses the core application features.
  - **`[feature]/router.ts`**: tRPC router definition.
  - **`[feature]/schema.ts`**: Effect-ts schemas for input validation.
  - **`[feature]/service.ts`**: Business logic and database interactions.
  - **`[feature]/components`**: React components specific to the feature.
  - **`[feature]/pages`**: Next.js pages specific to the feature.
- **`src/lib`**: Contains utility functions and libraries.
  - **`src/lib/prisma`**: Prisma client and utility functions.
  - **`src/lib/runtime-server`**: Runtime server for running effects on the server.
- **`src/server`**: Server-side code, including tRPC setup.
- **`prisma`**: Prisma schema, migrations, and seed scripts.

## Coding Style and Conventions

- **TypeScript:**
  - Use strict TypeScript (`strict: true` in `tsconfig.json`).
  - Leverage Effect-ts for schema validation on both client and server.
  - Use `React.FC` for functional components.
- **React:**
  - Use React Server Components (RSC) where possible. Client components (`"use client"`) should only be used when necessary (e.g., for hooks, event listeners).
  - Components should be small and focused on a single responsibility.
- **tRPC:**
  - Define tRPC routers in the corresponding feature's `router.ts` file.
  - Use Effect-ts schemas for input validation in procedures.
  - Business logic should be placed in `service.ts` files, not directly in the router.
- **Prisma:**
  - Interact with the database through the `db` client from `@/lib/prisma/client`.
  - Use the `execute` utility from `@/lib/prisma/execute` to handle potential database errors gracefully.
- **Styling:**
  - Use Tailwind CSS for styling.
  - Utilize Shadcn UI components from `@/components/ui` and compose them to build more complex UI elements.
  - Use the `cn` utility from `@/lib/utils` to merge Tailwind CSS classes.
- **Linting and Formatting:**
  - Adhere to the Biome configuration (`biome.jsonc`).
  - Run `bun check` before committing to ensure code quality.
- **Validation, Error Handling & Schemas:**
  - Use Effect-ts for validation, error handling and form schemas.
  - Do not use zod in any way in this project.

## Example Workflow: Adding a New Feature

1.  **Create a new feature directory:** `src/features/new-feature`. This is not necessary if the page that's being created is a subpage of an existing feature.
2.  **Define the Prisma schema:** If necessary, add new models to `prisma/schema.prisma` and run `bun prisma:migrate dev --name <migration-name>`.
3.  **Create the Effect-ts schema:** Define input validation schemas in `src/features/new-feature/schema.ts`.
4.  **Implement the service:** Write the business logic in `src/features/new-feature/service.ts`. This service must be an `Effect.Service`.
5.  **Create the tRPC router:** Define the tRPC procedures in `src/features/new-feature/router.ts` and add it to the `appRouter` in `src/server/api/root.ts`. Handle errors using `Effect.match`.
6.  **Build the UI:** Create React components in `src/features/new-feature/components` and the page in `src/app/new-feature/page.tsx`. Use `useMutation` and `useQuery` from `@trpc/react` to interact with the tRPC router if the component is client-side, if not, use `api` from `@/trpc/server` and use the methods such as prefetch to retrieve the information on the server.
7.  **Add navigation:** If needed, add a link to the new feature in `src/components/app-sidebar.tsx`.
8.  **Format files:** Run `bun biome format` to format the files.

By following these guidelines, we can maintain a clean, consistent, and maintainable codebase.
