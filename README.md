# teamproject

This application was generated using JHipster 7.9.4, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v7.9.4](https://www.jhipster.tech/documentation-archive/v7.9.4).

# MySafety — Team67dub

A calm, accessible web app to reach **trusted contacts fast** in unsafe situations.  
Built as part of the University of Birmingham Team Project using **Angular (frontend)** and **Spring Boot (backend)** scaffolded with **JHipster**.

---

## 🧭 Why this exists

While coding my dissertation, I always needed background noise — so I put on Ancient Egypt documentaries. That “white noise” turned into a full obsession with my country’s history. During that same time, I wanted an app that anyone in my family could use **in one tap** if they ever felt unsafe — big buttons, clear actions, no friction. So we built **MySafety**.

> PS: That obsession also led me to build a separate hieroglyphics converter so I could copy accurate symbols. Different repo, same energy.


---

## ✨ Features

- **SOS button** — one tap sends an alert with your **live location** to **trusted contacts**  
- **Trusted contacts** — add/manage the people notified first  
- **Voice recording** — capture audio during an incident as evidence  
- **Real-time chat** — coordinate with contacts inside the app  
- **Safety map** — shows your position and nearby help (e.g., hospitals)  
- **Profile & settings** — control permissions and what gets shared  
- **Accessibility-first UI** — large round buttons, strong contrast, clear typography

---
## 🎥 Demos

### Project Demo
<video controls width="720" src="docs/T6704-app-demo-1.mp4?raw=1">
  Your browser does not support the video tag.
  <a href="docs/T6704-app-demo-1.mp4?raw=1">Download the demo video</a>.
</video>

### Accessibility Demo
<video controls width="720" src="docs/T67P05-a11y-demo.mp4?raw=1">
  Your browser does not support the video tag.
  <a href="docs/T67P05-a11y-demo.mp4?raw=1">Download the accessibility demo</a>.
</video>

> Tip: If the embedded player doesn’t render on some GitHub clients (rare), the links above still let viewers download or play the files directly.

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
