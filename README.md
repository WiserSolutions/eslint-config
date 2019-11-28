# eslint-config

Baseline ESLint configurations used by Wiser Solutions, Inc.

### Base Config

Every JavaScript project should start by extending the base config.

```json
{
  "extends": "@wisersolutions"
}
```

**Note:** The base config requires the `babel-eslint` parser installed.

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

- `cypress` - for applications that use Cypress for end-to-end testing **(requires `eslint-plugin-cypress`)**,
- `jest` - for any project using Jest for unit testing **(requires `eslint-plugin-jest`)**,
- `react` - for applications or component libraries using React **(requires `eslint-plugin-react`)**,
- `enzyme` - for applications or component libraries that use Enzyme for testing React components.

### Combinations

There are also combinations provides to simplify the most common use-cases.

```json
{
  "extend": "@wisersolutions/eslint-config/application"
}
```

The following combinations are provided:

- `application` - applications using React, Cypress, and Jest,
- `quadro-application` - applications built with the Quadro framework (plus all of the above).
