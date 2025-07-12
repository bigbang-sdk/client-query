<a aria-lable="Next Query" href="https://query.bigbang.build/">
  <picture>
    <source srcset="https://raw.githubusercontent.com/bigbang-sdk/assets/refs/heads/main/hero-banners/hero-dark.svg" media="(prefers-color-scheme: dark)" />
    <source srcset="https://raw.githubusercontent.com/bigbang-sdk/assets/refs/heads/main/hero-banners/hero-light.svg" media="(prefers-color-scheme: light)" />
    <img src="https://raw.githubusercontent.com/bigbang-sdk/assets/refs/heads/main/hero-banners/hero-light.svg" alt="Fetch Pattern" referrerpolicy="no-referrer-when-downgrade" />
  </picture>
</a>

<p align="center">
  <a aria-label="Bigbang logo" href="https://query.bigbang.build/">
    <img src="https://badgen.net/badge/icon/Made%20by%20Bigbang?icon=https://raw.githubusercontent.com/bigbang-sdk/assets/refs/heads/main/logo/logo-white.svg&label&color=black&labelColor=black"/>
  </a>
  <br/>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@bigbang-sdk/next-query">
    <img alt="" src="https://badgen.net/npm/v/@bigbang-sdk/next-query?&labelColor=black"/>
  </a>
  <a aria-label="Package size" href="https://bundlephobia.com/result?p=@bigbang-sdk/next-query">
    <img alt="" src="https://badgen.net/bundlephobia/minzip/@bigbang-sdk/next-query?&labelColor=black"/>
  </a>
  <a aria-label="License" href="https://github.com/bigbang-sdk/next-query/blob/main/package/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/@bigbang-sdk/next-query?&labelColor=black"/>
  </a>
</p>

<p align="center">
  <a href="https://query.bigbang.build/"><strong>Website</strong></a> /
  <a href="https://query.bigbang.build/docs"><strong>Documentation</strong></a> /
  <a href="https://www.npmjs.com/package/@bigbang-sdk/next-query"><strong>NPM</strong></a>
</p>

## Introduction

Next Query is a data-fetching library for Next.js that simplifies the process of retrieving data in both Server and Client Components.

Built on top of Next.js’s built-in fetch cache, Next Query focuses on delivering a seamless, clutter-free experience. It abstracts away the complexities of data fetching—such as caching, revalidation, and SWR (Stale-While-Revalidate)—so you can focus on building your application.

- Fast, lightweight, and reusable data fetching
- Built-in support for SWR (Stale-While-Revalidate)
- Automatic caching and revalidation
- Real-time-ready experience
- Powered by Next.js’s native fetch cache
- Fully typed with TypeScript support

## One Library, Multiple Patterns

Next Query provides two core functions: clientQuery and serverQuery. These functions can be used in different ways to support a variety of data fetching patterns.

When caching is enabled, both functions utilize Next.js’s native fetch cache to store and retrieve data. However, while this cache is natively available in Server Components, it is not accessible in Client Components. To bridge this gap, clientQuery uses API route handlers to access the server-side cache from the client.

By enabling access to the cache on the client, Next Query ensures instant page loads—cached data is shared across browsers, sessions, and users. Additionally, the cache enables real-time updates using the SWR (Stale-While-Revalidate) pattern.

### 1. Client Query

Client Components, `clientQuery` can be used to fetch data in the following ways:

<picture>
  <source srcset="https://raw.githubusercontent.com/bigbang-sdk/assets/refs/heads/main/fetch-patterns/fetch-pattern-client-dark.svg" media="(prefers-color-scheme: dark)" />
    <source srcset="https://raw.githubusercontent.com/bigbang-sdk/assets/refs/heads/main/fetch-patterns/fetch-pattern-client-light.svg" media="(prefers-color-scheme: light)" />
    <img src="https://raw.githubusercontent.com/bigbang-sdk/assets/refs/heads/main/fetch-patterns/fetch-pattern-client-light.svg" alt="Fetch Pattern" referrerpolicy="no-referrer-when-downgrade" />
</picture>

#### - Fresh data

When using this pattern, the data is fetched directly from the fetch URL and is not cached.

#### - Cached data

When using this pattern, the data is fetched from Next.js's native fetch cache via an API route handler.

#### - SWR

When using this pattern, the data is fetched from Next.js's native fetch cache and is revalidated when the component is mounted on the client.

### 2. Server Query

Server Components, `serverQuery` can be used to fetch data in the following ways:

<picture>
  <source srcset="https://raw.githubusercontent.com/bigbang-sdk/assets/refs/heads/main/fetch-patterns/fetch-pattern-server-dark.svg" media="(prefers-color-scheme: dark)" />
    <source srcset="https://raw.githubusercontent.com/bigbang-sdk/assets/refs/heads/main/fetch-patterns/fetch-pattern-server-light.svg" media="(prefers-color-scheme: light)" />
    <img src="https://raw.githubusercontent.com/bigbang-sdk/assets/refs/heads/main/fetch-patterns/fetch-pattern-server-light.svg" alt="Fetch Pattern" referrerpolicy="no-referrer-when-downgrade" />
</picture>

#### - Fresh data

When using this pattern, the data is fetched directly from the fetch URL and is not cached.

#### - Cached data

When using this pattern, the data is fetched from Next.js's native fetch cache.

### 3. Server + Client Query

To fetch data using SWR (Stale-While-Revalidate) while leveraging both Server and Client Components, you can combine the `serverQuery` and `clientQuery` functions.
In this pattern, the cached data is sent from the server to the client upon the page request, and when the component is mounted on the client, the data is revalidated.

<picture>
  <source srcset="https://raw.githubusercontent.com/bigbang-sdk/assets/refs/heads/main/fetch-patterns/fetch-pattern-both-dark.svg" media="(prefers-color-scheme: dark)" />
    <source srcset="https://raw.githubusercontent.com/bigbang-sdk/assets/refs/heads/main/fetch-patterns/fetch-pattern-both-light.svg" media="(prefers-color-scheme: light)" />
    <img src="https://raw.githubusercontent.com/bigbang-sdk/assets/refs/heads/main/fetch-patterns/fetch-pattern-both-light.svg" alt="Fetch Pattern" referrerpolicy="no-referrer-when-downgrade" />
</picture>

Since the data is fetched on the server, it's included in the initial page load, significantly improving perceived performance.

## Contributing

We welcome contributions! To get started:

1. Fork the repository on [GitHub](https://github.com/bigbang-sdk/next-query)
2. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/en)

```bash
git commit -m "feat: add new feature"
```

3. Open a Pull Request targeting the `main` branch.

If you encounter bugs or have feature suggestions, please open an issue.

## License

This project is licensed under the [MIT License](https://github.com/bigbang-sdk/next-query/blob/main/LICENSE).
