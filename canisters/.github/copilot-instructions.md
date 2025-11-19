# Copilot Instructions for HeliosHash-DAO

## Project Overview
- This is a modular DAO system written in Motoko for the Internet Computer (IC).
- The codebase is organized by domain: each major feature or service is in its own directory (e.g., `dao/`, `governance/`, `treasury/`, `nft/`, etc.).
- Most logic is implemented in `main.mo` or `src/` subfolders, with tests in `test/` or files ending in `.test.mo`.

## Architecture & Patterns
- Each domain (e.g., governance, treasury, micro_grants) is a separate canister or module, often with its own entrypoint and internal library.
- Cross-module communication is explicit; look for import statements and actor references.
- Shared logic is placed in `lib.mo` files within `src/` folders.
- Test runners and utilities are in `test-runner/` and `hhdao/test/`.
- Naming conventions: `main.mo` is the entrypoint; `lib.mo` is for shared logic; `*.test.mo` for tests.

## Developer Workflows
- **Build:** Use the `msbuild` task (see VS Code tasks) for building the project.
- **Testing:** Tests are written in Motoko and can be run via scripts in `test-runner/` (e.g., `run-tests.sh`).
- **Dev Server:** A dev server can be started with the `pnpm dev` task (see VS Code tasks), but note the custom `cwd`.
- **Debugging:** Use the test runner scripts and inspect test output in `test-runner/`.

## Project-Specific Conventions
- All canisters/modules are self-contained; avoid circular dependencies.
- Use Motoko idioms for actor and async patterns.
- Place integration tests in `test-runner/` and unit tests in each module's `test/` folder.
- Use `lib.mo` for utilities and shared logic within a module.
- When adding a new feature, create a new directory or submodule as needed, following the existing structure.

## Key Files & Directories
- `dao/`, `governance/`, `treasury/`, `nft/`, `micro_grants/`, etc.: Main modules/canisters.
- `test-runner/`: Test orchestration scripts and integration tests.
- `hhdao/test/`: Unit and scenario tests for the main DAO logic.
- `src/`: Subdirectory for internal logic and libraries within each module.

## Examples
- To add a new canister, create a new directory with `src/main.mo` and update any integration tests in `test-runner/`.
- To share logic, add to `src/lib.mo` in the relevant module.
- To run all tests: `cd test-runner && ./run-tests.sh`

---

For questions about architecture or workflows, see the structure above and follow the established patterns. If unsure, review similar modules for guidance.
