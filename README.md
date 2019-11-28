# eslint-config

Baseline ESLint configurations used by Wiser Solutions, Inc.

### Base Config

Every JavaScript project should start by extending the base config.

```json
{
  "extends": "@wisersolutions"
}
```

### Extensions

In some specific use-cases (e.g. application projects) or when using some common libraries (e.g. `jest`),
use the provided additional config extensions.

```json
{
  "extends": [
    "@wisersolutions",
    "@wisersolutions/eslint-config/jest",
    "@wisersolutions/eslint-config/cypress",
    "…"
  ]
}
```

The following extensions are provided:

- `cypress` - for applications that use Cypress for end-to-end testing,
- `jest` - for any project using Jest for unit testing,
- `react` - for applications or component libraries using React,
- `enzyme` - for applications or component libraries that use Enzyme for testing React components,
- `quadro-application` - for applications built with the `quadro` framework.
