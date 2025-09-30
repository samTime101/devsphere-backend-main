## Contributor Cron Job Workflow

The flowchart below illustrates the workflow of the contributor CRON job done in `src/jobs/contributor.cron.ts`. The job runs periodically every day at midnight (00: 00) to update the list of contributors for each project in the database by fetching data from GitHub.

```mermaid
flowchart TD
    A[Start Cron Job] --> B[Fetch All Projects]
    B --> C{For Each Project}
    C -->|No GitHub Link| D[Skip Project]
    C -->|Has GitHub Link| E[Extract Repo Name]
    E --> F[Fetch Contributors from GitHub]
    F --> G[Compare with DB Contributors]
    G -->|No New Contributors| H[Skip]
    G -->|New Contributors Found| I[Add New Contributors to Project]
    I --> J[Log Result]
    J --> K[End]
```
