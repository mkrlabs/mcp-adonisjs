---
name: AdonisJS v7 Documentation
description: Complete reference to the official AdonisJS v7 documentation. All URLs return raw markdown when suffixed with .md. Use this skill to find the right doc page before writing AdonisJS code.
---

# AdonisJS v7 Documentation Reference

All documentation URLs below return **raw markdown** — append `.md` to any page
URL.

> [!TIP]
> Use the MCP tool `check_docs` to fetch any page directly, or `list_docs` to
> browse by category.

---

## Start

Essential pages for project setup and understanding.

| Topic                 | URL                                                  |
| :-------------------- | :--------------------------------------------------- |
| Introduction          | https://docs.adonisjs.com/introduction.md            |
| Stacks & Starter Kits | https://docs.adonisjs.com/stacks-and-starter-kits.md |
| Installation          | https://docs.adonisjs.com/installation.md            |
| Folder Structure      | https://docs.adonisjs.com/folder-structure.md        |
| Dev Environment       | https://docs.adonisjs.com/dev-environment.md         |
| Configuration         | https://docs.adonisjs.com/configuration.md           |
| Deployment            | https://docs.adonisjs.com/deployment.md              |
| FAQs                  | https://docs.adonisjs.com/faqs.md                    |

---

## Guides — Basics

Core HTTP layer: routing, controllers, middleware, request/response, validation.

| Topic              | URL                                                           | When to consult                                |
| :----------------- | :------------------------------------------------------------ | :--------------------------------------------- |
| Routing            | https://docs.adonisjs.com/guides/basics/routing.md            | Defining routes, route groups, resource routes |
| Controllers        | https://docs.adonisjs.com/guides/basics/controllers.md        | Creating controllers, resource controllers     |
| HTTP Context       | https://docs.adonisjs.com/guides/basics/http-context.md       | Accessing request, response, auth in handlers  |
| Middleware         | https://docs.adonisjs.com/guides/basics/middleware.md         | Global/route middleware, middleware stacks     |
| Request            | https://docs.adonisjs.com/guides/basics/request.md            | Query params, headers, content negotiation     |
| Response           | https://docs.adonisjs.com/guides/basics/response.md           | Sending responses, redirects, streaming        |
| Body Parser        | https://docs.adonisjs.com/guides/basics/body-parser.md        | Parsing JSON, form data, multipart             |
| Validation         | https://docs.adonisjs.com/guides/basics/validation.md         | VineJS validators, custom rules                |
| File Uploads       | https://docs.adonisjs.com/guides/basics/file-uploads.md       | Handling file uploads, storage                 |
| Session            | https://docs.adonisjs.com/guides/basics/session.md            | Session config, flash messages                 |
| URL Builder        | https://docs.adonisjs.com/guides/basics/url-builder.md        | Generating URLs, signed URLs                   |
| Exception Handling | https://docs.adonisjs.com/guides/basics/exception-handling.md | Custom exceptions, error pages                 |
| Debugging          | https://docs.adonisjs.com/guides/basics/debugging.md          | Dump/dd, debugging tools                       |
| Static File Server | https://docs.adonisjs.com/guides/basics/static-file-server.md | Serving static assets                          |

---

## Guides — Frontend

Rendering views and building frontend integrations.

| Topic          | URL                                                         | When to consult                   |
| :------------- | :---------------------------------------------------------- | :-------------------------------- |
| Edge.js        | https://docs.adonisjs.com/guides/frontend/edgejs.md         | Server-side templating with Edge  |
| Inertia        | https://docs.adonisjs.com/guides/frontend/inertia.md        | Inertia.js + React/Vue/Svelte SPA |
| Transformers   | https://docs.adonisjs.com/guides/frontend/transformers.md   | Data transformation for frontend  |
| API Client     | https://docs.adonisjs.com/guides/frontend/api-client.md     | Type-safe API client generation   |
| TanStack Query | https://docs.adonisjs.com/guides/frontend/tanstack-query.md | TanStack Query integration        |
| Vite           | https://docs.adonisjs.com/guides/frontend/vite.md           | Vite asset bundling               |

---

## Guides — Database

ORM and data stores.

| Topic     | URL                                                | When to consult                            |
| :-------- | :------------------------------------------------- | :----------------------------------------- |
| Lucid ORM | https://docs.adonisjs.com/guides/database/lucid.md | Models, migrations, queries, relationships |
| Redis     | https://docs.adonisjs.com/guides/database/redis.md | Redis pub/sub, caching                     |

---

## Guides — Auth

Authentication and authorization.

| Topic                 | URL                                                                 | When to consult              |
| :-------------------- | :------------------------------------------------------------------ | :--------------------------- |
| Introduction          | https://docs.adonisjs.com/guides/auth/introduction.md               | Auth overview, guard concept |
| Verifying Credentials | https://docs.adonisjs.com/guides/auth/verifying-user-credentials.md | Login, password verification |
| Session Guard         | https://docs.adonisjs.com/guides/auth/session-guard.md              | Cookie/session-based auth    |
| Access Tokens Guard   | https://docs.adonisjs.com/guides/auth/access-tokens-guard.md        | API token authentication     |
| Basic Auth Guard      | https://docs.adonisjs.com/guides/auth/basic-auth-guard.md           | HTTP Basic auth              |
| Custom Auth Guard     | https://docs.adonisjs.com/guides/auth/custom-auth-guard.md          | Building custom guards       |
| Social Authentication | https://docs.adonisjs.com/guides/auth/social-authentication.md      | OAuth (Google, GitHub, etc.) |
| Authorization         | https://docs.adonisjs.com/guides/auth/authorization.md              | Bouncer policies, abilities  |

---

## Guides — Security

Hardening and protecting your application.

| Topic             | URL                                                                    | When to consult                       |
| :---------------- | :--------------------------------------------------------------------- | :------------------------------------ |
| Hashing           | https://docs.adonisjs.com/guides/security/hashing.md                   | Bcrypt/scrypt/argon2 password hashing |
| Encryption        | https://docs.adonisjs.com/guides/security/encryption.md                | Encrypting/decrypting data            |
| CORS              | https://docs.adonisjs.com/guides/security/cors.md                      | Cross-origin resource sharing config  |
| Securing SSR Apps | https://docs.adonisjs.com/guides/security/securing-ssr-applications.md | CSRF, CSP, XSS protection             |
| Rate Limiting     | https://docs.adonisjs.com/guides/security/rate-limiting.md             | Throttling requests                   |

---

## Guides — Concepts

Architecture and framework internals.

| Topic                 | URL                                                                | When to consult              |
| :-------------------- | :----------------------------------------------------------------- | :--------------------------- |
| Application Lifecycle | https://docs.adonisjs.com/guides/concepts/application-lifecycle.md | Boot phases, hooks           |
| Dependency Injection  | https://docs.adonisjs.com/guides/concepts/dependency-injection.md  | `@inject()`, IoC container   |
| Service Providers     | https://docs.adonisjs.com/guides/concepts/service-providers.md     | Registering services at boot |
| Container Services    | https://docs.adonisjs.com/guides/concepts/container-services.md    | Resolving from the container |
| Barrel Files          | https://docs.adonisjs.com/guides/concepts/barrel-files.md          | `#` imports, subpath imports |
| Assembler Hooks       | https://docs.adonisjs.com/guides/concepts/assembler-hooks.md       | Build-time hooks             |
| Scaffolding           | https://docs.adonisjs.com/guides/concepts/scaffolding.md           | `make:*` command internals   |
| Extending AdonisJS    | https://docs.adonisjs.com/guides/concepts/extending-adonisjs.md    | Macros, packages             |

---

## Guides — Digging Deeper

Advanced features and integrations.

| Topic         | URL                                                              | When to consult                  |
| :------------ | :--------------------------------------------------------------- | :------------------------------- |
| Drive         | https://docs.adonisjs.com/guides/digging-deeper/drive.md         | File storage (local, S3, GCS)    |
| Emitter       | https://docs.adonisjs.com/guides/digging-deeper/emitter.md       | Events, listeners                |
| Health Checks | https://docs.adonisjs.com/guides/digging-deeper/health-checks.md | Readiness/liveness probes        |
| i18n          | https://docs.adonisjs.com/guides/digging-deeper/i18n.md          | Internationalization             |
| Locks         | https://docs.adonisjs.com/guides/digging-deeper/locks.md         | Distributed locking              |
| Logger        | https://docs.adonisjs.com/guides/digging-deeper/logger.md        | Pino-based logging               |
| Mail          | https://docs.adonisjs.com/guides/digging-deeper/mail.md          | Sending emails (SMTP, SES, etc.) |
| OpenTelemetry | https://docs.adonisjs.com/guides/digging-deeper/opentelemetry.md | Tracing, metrics                 |

---

## Guides — Ace CLI

Command-line interface for AdonisJS.

| Topic             | URL                                                       | When to consult                 |
| :---------------- | :-------------------------------------------------------- | :------------------------------ |
| Introduction      | https://docs.adonisjs.com/guides/ace/introduction.md      | Ace overview, built-in commands |
| Creating Commands | https://docs.adonisjs.com/guides/ace/creating-commands.md | Custom Ace commands             |
| Arguments         | https://docs.adonisjs.com/guides/ace/arguments.md         | Positional arguments            |
| Flags             | https://docs.adonisjs.com/guides/ace/flags.md             | Command flags/options           |
| Prompts           | https://docs.adonisjs.com/guides/ace/prompts.md           | Interactive prompts             |
| Terminal UI       | https://docs.adonisjs.com/guides/ace/terminal-ui.md       | Tables, progress bars           |
| REPL              | https://docs.adonisjs.com/guides/ace/repl.md              | Interactive REPL                |

---

## Guides — Testing

Writing and running tests with Japa.

| Topic           | URL                                                                       | When to consult                |
| :-------------- | :------------------------------------------------------------------------ | :----------------------------- |
| Introduction    | https://docs.adonisjs.com/guides/testing/introduction.md                  | Test setup, runners, suites    |
| API Tests       | https://docs.adonisjs.com/guides/testing/api-tests.md                     | HTTP integration tests         |
| Browser Tests   | https://docs.adonisjs.com/guides/testing/browser-tests.md                 | Playwright-based E2E tests     |
| Console Tests   | https://docs.adonisjs.com/guides/testing/console-tests.md                 | Testing Ace commands           |
| Resetting State | https://docs.adonisjs.com/guides/testing/resetting-state-between-tests.md | Database cleanup, transactions |
| Test Doubles    | https://docs.adonisjs.com/guides/testing/test-doubles.md                  | Mocks, stubs, fakes            |

---

## Tutorial — Hypermedia (Edge + HTMX)

Step-by-step tutorial for building a server-rendered app.

| Step                       | URL                                                                      |
| :------------------------- | :----------------------------------------------------------------------- |
| Overview                   | https://docs.adonisjs.com/tutorial/hypermedia/overview.md                |
| CLI and REPL               | https://docs.adonisjs.com/tutorial/hypermedia/cli-and-repl.md            |
| Database and Models        | https://docs.adonisjs.com/tutorial/hypermedia/database-and-models.md     |
| Routes, Controllers, Views | https://docs.adonisjs.com/tutorial/hypermedia/routes-controller-views.md |
| Forms and Validation       | https://docs.adonisjs.com/tutorial/hypermedia/forms-and-validation.md    |
| Styling and Cleanup        | https://docs.adonisjs.com/tutorial/hypermedia/styling-and-cleanup.md     |
| Authorization              | https://docs.adonisjs.com/tutorial/hypermedia/authorization.md           |

---

## Tutorial — React (Inertia)

Step-by-step tutorial for building an Inertia + React app.

| Step                       | URL                                                                 |
| :------------------------- | :------------------------------------------------------------------ |
| Overview                   | https://docs.adonisjs.com/tutorial/react/overview.md                |
| CLI and REPL               | https://docs.adonisjs.com/tutorial/react/cli-and-repl.md            |
| Database and Models        | https://docs.adonisjs.com/tutorial/react/database-and-models.md     |
| Routes, Controllers, Views | https://docs.adonisjs.com/tutorial/react/routes-controller-views.md |
| Forms and Validation       | https://docs.adonisjs.com/tutorial/react/forms-and-validation.md    |
| Styling and Cleanup        | https://docs.adonisjs.com/tutorial/react/styling-and-cleanup.md     |
| Authorization              | https://docs.adonisjs.com/tutorial/react/authorization.md           |

---

## Reference

API reference and configuration details.

| Topic              | URL                                                    |
| :----------------- | :----------------------------------------------------- |
| Application        | https://docs.adonisjs.com/reference/application.md     |
| RC File (adonisrc) | https://docs.adonisjs.com/reference/adonisrc-rcfile.md |
| Commands           | https://docs.adonisjs.com/reference/commands.md        |
| Edge               | https://docs.adonisjs.com/reference/edge.md            |
| Events             | https://docs.adonisjs.com/reference/events.md          |
| Exceptions         | https://docs.adonisjs.com/reference/exceptions.md      |
| Helpers            | https://docs.adonisjs.com/reference/helpers.md         |
| Type Helpers       | https://docs.adonisjs.com/reference/types-helpers.md   |

---

## Resources

| Topic              | URL                                       |
| :----------------- | :---------------------------------------- |
| Contributing       | https://docs.adonisjs.com/contributing.md |
| Releases           | https://docs.adonisjs.com/releases.md     |
| Governance         | https://docs.adonisjs.com/governance.md   |
| v6 to v7 Migration | https://docs.adonisjs.com/v6-to-v7.md     |

---

## Quick Lookup Guide

When working on an AdonisJS project, consult these pages first:

| Task                            | Pages to check                                        |
| :------------------------------ | :---------------------------------------------------- |
| Setting up routes + controllers | routing, controllers, middleware                      |
| Form handling + validation      | validation, body-parser, file-uploads                 |
| Database work                   | lucid                                                 |
| Adding authentication           | auth/introduction, then the relevant guard            |
| Protecting routes               | authorization, middleware                             |
| Sending emails                  | mail                                                  |
| Writing tests                   | testing/introduction, then api-tests or browser-tests |
| Creating CLI commands           | ace/creating-commands, arguments, flags               |
| File storage (S3, local)        | drive                                                 |
| API development                 | routing, controllers, api-client, access-tokens-guard |
| Deploying                       | deployment, configuration                             |
