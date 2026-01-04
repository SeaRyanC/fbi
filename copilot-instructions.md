# GitHub Copilot Instructions for FBI

## CRITICAL: Baseline Testing Only

**DO NOT EVER WRITE UNIT TESTS THAT VALIDATE OUTPUT OR BEHAVIOR.**

This project uses baseline testing exclusively. This means:

- ❌ **NEVER** create unit tests with assertions like `expect(output).toBe("expected value")`
- ❌ **NEVER** write tests that check specific behavior or output values
- ❌ **NEVER** add test frameworks that encourage explicit assertions (like Jest, Mocha, etc.)
- ✅ **ALWAYS** use baseline testing: compare actual CLI output to reference files
- ✅ **ALWAYS** store test inputs in `tests` folder
- ✅ **ALWAYS** store reference outputs in `baselines/reference` folder

## How to Work with Baseline Tests

When suggesting code changes:

1. Run `npm test` to compare against baselines
2. If output changes, show the diff
3. If changes are correct, suggest running `npm run baseline-accept`
4. Include baseline updates in code suggestions when output changes

## Testing Workflow

```bash
# Run tests (compares output to baselines/reference)
npm test

# Accept new output as correct baseline
npm run baseline-accept
```

## Adding Test Cases

To add a new test:
1. Create a .txt file in `tests` folder with blueprint data
2. Run `npm test` to generate output
3. Review output manually
4. Run `npm run baseline-accept` to set as reference
5. Commit both test file and baseline

## Architecture

- `src/index.ts` - CLI entry point
- `src/decoder.ts` - Blueprint decoding
- `src/analyzer.ts` - Production analysis
- `src/gameData.ts` - Factorio game data (recipes, machines, modules)
- `tests/` - Blueprint test files
- `baselines/reference/` - Known-good outputs
- `baselines/local/` - Actual outputs from test runs (not committed)
