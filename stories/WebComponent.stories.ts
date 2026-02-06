import type { Meta, StoryObj } from "@storybook/react-vite";
import { createElement } from "react";
import "../src/web-component";

const meta = {
  title: "Web Component",
  parameters: {
    docs: {
      description: {
        component:
          "The `<truncated-value>` Lit web component. Uses native HTML custom element via `dangerouslySetInnerHTML`.",
      },
    },
  },
  argTypes: {
    value: { control: "text" },
    "start-length": { control: { type: "number", min: 0, max: 50 } },
    "end-length": { control: { type: "number", min: 0, max: 50 } },
    ellipsis: { control: "text" },
    expandable: { control: "boolean" },
  },
  render: (args) => {
    const attrs = Object.entries(args)
      .filter(([, v]) => v !== undefined && v !== false)
      .map(([k, v]) => (v === true ? k : `${k}="${String(v)}"`))
      .join(" ");

    return createElement("div", {
      dangerouslySetInnerHTML: {
        __html: `<truncated-value ${attrs}></truncated-value>`,
      },
    });
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "0x1234567890abcdef1234567890abcdef12345678",
  },
};

export const Expandable: Story = {
  args: {
    value: "0x1234567890abcdef1234567890abcdef12345678",
    expandable: true,
  },
};
