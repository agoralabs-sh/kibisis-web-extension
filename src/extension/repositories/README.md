# Repositories

Repositories serve the sole purpose as a wrapper around storage. They directly maintain interactions with the `<browser|chrome>.stroage.local` API.

Repositories usually serve as a dependency of a higher level service, such as [`managers/`](../managers/README.md).

> ⚠️ **NOTE:** Avoid using dependencies in repositories in order avoid circular dependencies.
