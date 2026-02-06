import type { Meta, StoryObj } from "@storybook/react-vite";
import { TruncatedValue } from "../src/react";

const meta = {
  title: "TruncatedValue",
  component: TruncatedValue,
  argTypes: {
    value: { control: "text" },
    startLength: { control: { type: "number", min: 0, max: 50 } },
    endLength: { control: { type: "number", min: 0, max: 50 } },
    ellipsis: { control: "text" },
    expandable: { control: "boolean" },
    className: { control: "text" },
  },
} satisfies Meta<typeof TruncatedValue>;

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

export const CustomLengths: Story = {
  args: {
    value: "0x1234567890abcdef1234567890abcdef12345678",
    startLength: 10,
    endLength: 8,
    expandable: true,
  },
};

export const ShortValue: Story = {
  args: {
    value: "0x1234",
  },
};

export const EthereumAddress: Story = {
  args: {
    value: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    expandable: true,
  },
};

export const TransactionHash: Story = {
  args: {
    value: "0xe75fb554e433e03763a1560646ee22dcb74e5274b34c5ad644e7c0f619a7e1d0",
    startLength: 10,
    endLength: 8,
    expandable: true,
  },
};

export const IPFS_CID: Story = {
  name: "IPFS CID",
  args: {
    value: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    expandable: true,
  },
};

export const Playground: Story = {
  args: {
    value: "0x1234567890abcdef1234567890abcdef12345678",
    startLength: 6,
    endLength: 4,
    ellipsis: "...",
    expandable: true,
  },
};
