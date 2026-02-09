# truncated-value

Truncate long strings safely, without destroying searchability or verifiability.

[Live Demo & Playground](https://umpeth.github.io/truncated-value/)

## The Problem: Address Poisoning

Almost all apps, wallets and explorers display addresses truncated to their first and last few characters (e.g. `0xd8dA...6045`). [Address poisoning scams](https://support.metamask.io/stay-safe/protect-yourself/wallet-and-hardware/address-poisoning-scams) exploit this: attackers generate addresses matching the visible prefix and suffix, seed them into transaction histories, and wait for users to copy the wrong one.

**Truncation hides the characters that matter most for verification.**

## How This Helps

`@umplabs/truncated-value` keeps the **full value in the DOM at all times**. The middle portion is visually collapsed with CSS, but never removed.

- **Browser find (Ctrl+F) matches the complete address**, even while truncated
- **Optional expansion**: Enable `expandable` to let users click/focus to inspect every character before copying

Poisoned addresses become significantly harder to miss.

## Installation

```bash
npm install @umplabs/truncated-value
# or
pnpm add @umplabs/truncated-value
# or
yarn add @umplabs/truncated-value
```

## Usage

### React

```tsx
import { TruncatedValue } from "@umplabs/truncated-value/react";

function App() {
  return (
    <TruncatedValue
      value="0x1234567890abcdef1234567890abcdef12345678"
      startLength={6}
      endLength={4}
      expandable
    />
  );
}
```

### Web Component (Vue, Svelte, or any framework)

```ts
// Import once to register the custom element
import "@umplabs/truncated-value/web-component";
```

```html
<truncated-value
  value="0x1234567890abcdef1234567890abcdef12345678"
  start-length="6"
  end-length="4"
  expandable
></truncated-value>
```

### CDN (No bundler required)

```html
<script type="module" src="https://unpkg.com/@umplabs/truncated-value"></script>

<truncated-value
  value="0x1234567890abcdef1234567890abcdef12345678"
  expandable
></truncated-value>
```

## Examples

### Ethereum Address

```tsx
<TruncatedValue value="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" expandable />
// Displays: 0xd8dA...6045
```

### Transaction Hash

```tsx
<TruncatedValue
  value="0xf7b9d38a3c5e4e7b9d38a3c5e4e7b9d38a3c5e4e7b9d38a3c5e4e7b9d38a3c5e4e"
  startLength={10}
  endLength={8}
  expandable
/>
// Displays: 0xf7b9d38a...38a3c5e4e
```

### IPFS CID

```tsx
<TruncatedValue
  value="QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
  startLength={6}
  endLength={6}
  expandable
/>
// Displays: QmYwAP...nPbdG
```

### Custom Styling

```tsx
<TruncatedValue
  value="0x1234567890abcdef"
  expandable
  className="my-custom-class"
/>
```

To style the visual ellipsis in React:

```css
.my-custom-class .tv-ellipsis {
  letter-spacing: 0.12em;
}
```

For the web component, use the exposed shadow part:

```css
truncated-value::part(ellipsis) {
  letter-spacing: 0.12em;
}
```

## Features

- **Smart truncation**: Shows start and end characters, visually collapses the middle
- **Interactive expansion** (optional): Click or focus to reveal and verify the full value
- **Fully searchable**: Browser find (Ctrl+F) works on the complete text, even when truncated
- **Multi-framework**: React component + Web Component (Vue, Svelte, vanilla HTML)
- **Accessible**: Keyboard navigation and ARIA attributes
- **Tiny footprint**: Tree-shakable, minimal dependencies

## Unopinionated by Design

This component ships with **no visual opinions** — no colors, fonts, sizes, or spacing baked in. The only built-in CSS handles the truncation mechanics (collapsing the middle text and cursor hints). Everything else — how it looks, how it fits your brand — is up to you. Style it with plain CSS, theme tokens, or your design system as you would any other inline element.

## API

### React Component Props

| Prop          | Type      | Default | Description                                          |
| ------------- | --------- | ------- | ---------------------------------------------------- |
| `value`       | `string`  | `""`    | The string value to display and potentially truncate |
| `startLength` | `number`  | `6`     | Number of characters to show at the start            |
| `endLength`   | `number`  | `4`     | Number of characters to show at the end              |
| `ellipsis`    | `string`  | `"..."` | Ellipsis indicator shown when truncated              |
| `expandable`  | `boolean` | `false` | Whether the component expands on focus/click         |
| `className`   | `string`  | -       | Additional CSS class name                            |

### Web Component Attributes

| Attribute      | Type      | Default | Description                                  |
| -------------- | --------- | ------- | -------------------------------------------- |
| `value`        | `string`  | `""`    | The string value to display                  |
| `start-length` | `number`  | `6`     | Characters to show at the start              |
| `end-length`   | `number`  | `4`     | Characters to show at the end                |
| `ellipsis`     | `string`  | `"..."` | Ellipsis indicator shown when truncated      |
| `expandable`   | `boolean` | `false` | Whether the component expands on focus/click |

### Shadow DOM Parts (Web Component)

Style internal elements using `::part()`:

```css
truncated-value::part(container) {
  font-weight: bold;
}

truncated-value::part(start),
truncated-value::part(end) {
  color: #888;
}

truncated-value::part(middle) {
  color: #666;
}

truncated-value::part(ellipsis) {
  letter-spacing: 0.12em;
}
```

## Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge).

## License

MIT
