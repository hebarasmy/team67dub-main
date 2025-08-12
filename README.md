# teamproject

This application was generated using JHipster 7.9.4, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v7.9.4](https://www.jhipster.tech/documentation-archive/v7.9.4).

# MySafety — Team67dub

A calm, accessible web app to reach **trusted contacts fast** in unsafe situations.  
Built for the University of Birmingham Team Project using **Angular (frontend)** and **Spring Boot (backend)** scaffolded with **JHipster**.

---

## 🧭 Why this exists

We set out to design a tool that works **under stress**: one tap, clear choices, and accessibility from the start. MySafety focuses on **speed, clarity, and reliability** so anyone can get help quickly.

---

## ✨ Features

- **SOS (one-tap)** — trigger an alert and notify trusted contacts
- **Contacts** — manage trusted people who can receive pings/updates
- **Chat & history** — in-app messaging with saved history
- **Voice recording** — record, upload, and review audio messages
- **Live location** — share current position
- **Danger zones** — mark/see unsafe areas
- **Nearby help** — hospitals & police stations
- **Auth & profile** — JWT auth, account settings
- **Accessibility-first UI** — large touch targets, strong contrast, clear language
- **Responsive** — works on mobile and desktop

---

## 🏗️ Architecture

- **Frontend:** Angular, RxJS, Router, Reactive Forms  
- **Backend:** Spring Boot, REST + WebSocket (Socket.IO), JWT security  
- **Persistence:** Liquibase migrations; **Dev:** H2; **Prod/Docker:** PostgreSQL  
- **Tooling:** Maven wrapper, JHipster configs, Webpack, Tailwind (some screens)

---
## 🎥 Demos

**Project Demo** — [▶️ Play (direct)](https://raw.githubusercontent.com/hebarasmy/team67dub-main/main/docs/T6704-app-demo-1.mp4)

**Accessibility Demo** — [▶️ Play (direct)](https://raw.githubusercontent.com/hebarasmy/team67dub-main/main/docs/T67P05-a11y-demo.mp4)

> Tip: If a corporate network/ad-blocker still blocks playback, right-click → “Save link as…” to download.

---

## 🧰 Tech stack (skills used)

**Frontend**
- Angular • TypeScript • RxJS • Router • Reactive Forms
- Responsive layout • Accessible components

**Backend**
- Spring Boot (Spring Web, Validation)
- JPA/Hibernate
- Service / DTO layers (JHipster conventions)

**Tooling**
- JHipster (monolith scaffold)
- Maven (wrapper) for builds
- Yarn / npm for the Angular workspace
- Git + GitHub

---

## 🚀 Quick start (local dev)

> **Requirements**
> - **Java 17** (JHipster supports 11–18; we use 17)
> - **Node 18 (LTS)** + **Yarn** (or npm)

### 1) Backend — Spring Boot API

From the project root (where `pom.xml` is):

```bash
./mvnw -ntp clean verify
./mvnw spring-boot:run   # API at http://localhost:8080

## Continuous Integration (optional)

To configure CI for your project, run the ci-cd sub-generator (`jhipster ci-cd`), this will let you generate configuration files for a number of Continuous Integration systems. Consult the [Setting up Continuous Integration][] page for more information.

[jhipster homepage and latest documentation]: https://www.jhipster.tech
[jhipster 7.9.4 archive]: https://www.jhipster.tech/documentation-archive/v7.9.4
[using jhipster in development]: https://www.jhipster.tech/documentation-archive/v7.9.4/development/
[using docker and docker-compose]: https://www.jhipster.tech/documentation-archive/v7.9.4/docker-compose
[using jhipster in production]: https://www.jhipster.tech/documentation-archive/v7.9.4/production/
[running tests page]: https://www.jhipster.tech/documentation-archive/v7.9.4/running-tests/
[code quality page]: https://www.jhipster.tech/documentation-archive/v7.9.4/code-quality/
[setting up continuous integration]: https://www.jhipster.tech/documentation-archive/v7.9.4/setting-up-ci/
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[webpack]: https://webpack.github.io/
[browsersync]: https://www.browsersync.io/
[jest]: https://facebook.github.io/jest/
[leaflet]: https://leafletjs.com/
[definitelytyped]: https://definitelytyped.org/
[angular cli]: https://cli.angular.io/
