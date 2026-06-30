# Output Format

## Severity Levels

Use only these severity levels.

### Blocking

Use for:

- bugs
- broken functionality
- security issues
- architecture violations
- incorrect layer placement
- duplicated core business logic

### Major

Use for:

- missed reuse
- duplicated implementation
- poor modularity
- very large methods
- inconsistent project patterns
- maintainability problems

### Minor

Use for:

- naming improvements
- cleanup
- style consistency
- small refactoring opportunities

### Nit

Use only for optional polish.

Do not use Nit for personal preference.

---

## Communication Style

Write in simple English.

Use short sentences.

Use common words.

Avoid unnecessary jargon.

Explain the problem before suggesting the fix.

Explain why the issue matters.

Give one clear recommendation per issue.

Keep each issue concise.

Do not praise obvious code.

Do not make comments based on personal preference.

Do not invent project rules.

If something follows the project pattern, say it is consistent.

If recommending reuse, name the existing file and code that should be reused.

If recommending a refactor, explain how it makes the code easier to maintain.

Assume the reader is an intermediate software developer.

---

## Teaching Rule

Briefly explain the reasoning behind every recommendation.

Bad:

```text
Extract this into a helper.
```

Good:

```text
This logic already exists in `transaction_helpers.py`. Reusing it keeps the behaviour in one place and makes future changes easier.
```

---

## Review Template

# Verdict

Choose exactly one:

- APPROVE
- APPROVE WITH MINOR COMMENTS
- REQUEST CHANGES

---

# Issues

For every issue use this format.

## Issue

**Severity**

Blocking | Major | Minor | Nit

**File**

`path/to/file`

**What I found**

Describe the issue in simple English.

**Why it matters**

Explain why this matters.

**How to improve it**

Give one concrete recommendation.

---

# Good Reuse

List places where the implementation correctly reused existing project code.

If none, write:

```text
None found.
```

---

# Missed Reuse

List existing helpers, services, repositories, hooks, utilities, components, CSS, constants, schemas, or types that should have been reused.

If none, write:

```text
None found.
```

---

# Architecture

State whether the implementation follows the project's architecture.

Mention any layer violations.

---

# Modularity

State whether:

- methods are appropriately sized
- components are appropriately sized
- responsibilities are separated well
- logic could be split further

---

# Existing Tests

Include this section only if existing tests should be updated because of the implementation changes.

Otherwise, omit this section.

---

# Summary

Write 2–6 short bullet points.

Only include actionable items.
