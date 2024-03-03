import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema.ts',
  out: './migrations',

  // Print all statements
  verbose: true,

  // Always confirm
  strict: true,

  // The driver parameter is responsible for explicitly providing a driver to use when accessing a database for the introspect and push commands.
  driver: 'better-sqlite',

  // https://andriisherman.medium.com/migrations-with-drizzle-just-got-better-push-to-sqlite-is-here-c6c045c5d0fb
  // blog post suggests url has `file:` prefix but that doesn't work.
  dbCredentials: {
    url: './sqlite.db',
  },
} satisfies Config
