# Contributing to FBI

Thank you for your interest in contributing to the Factorio Blueprint Investigator!

## Testing Policy

**CRITICAL: We use baseline testing exclusively in this project.**

### What is Baseline Testing?

Baseline testing means we compare the actual output of the CLI against known-good reference outputs stored in the repository. We **DO NOT** write explicit unit tests that validate specific behavior or output values.

### Testing Rules

- ❌ **NEVER** write unit tests that validate specific output values
- ❌ **NEVER** write unit tests that check for specific behavior
- ✅ **ALWAYS** use baseline testing to verify changes
- ✅ **ALWAYS** review baseline diffs carefully when they occur

### How Baseline Testing Works

1. Test input files (blueprint .txt files) are stored in the `tests` folder
2. Known-good reference outputs are stored in `baselines/reference`
3. Running `npm test` executes the CLI on each test file and compares output to reference
4. If output differs, the test fails and shows a diff, with actual output saved to `baselines/local`
5. If the new output is correct, run `npm run baseline-accept` to update the reference baselines

### Making Changes

When you make changes that affect output:

1. Run `npm test` to see what changed
2. Review the diff carefully to ensure changes are intentional
3. If the new output is correct, run `npm run baseline-accept`
4. Commit the updated baseline files with your code changes

### Adding New Tests

To add a new test case:

1. Add a new blueprint .txt file to the `tests` folder
2. Run `npm test` - it will fail because there's no baseline
3. Verify the output is correct by manually reviewing it
4. Run `npm run baseline-accept` to create the reference baseline
5. Commit both the test file and its baseline

## Code Style

- Follow the existing TypeScript code style
- Use meaningful variable names
- Add comments only when necessary to explain complex logic

## Pull Requests

- Keep changes focused and minimal
- Update documentation if you change user-facing behavior
- Ensure all baseline tests pass before submitting
- Include baseline updates in your PR if output changes
