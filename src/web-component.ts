import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { truncate, styles } from "./core";

/**
 * A web component that intelligently truncates long string values.
 *
 * @element truncated-value
 *
 * @attr {string} value - The string value to display and potentially truncate
 * @attr {number} start-length - Number of characters to show at the start (default: 6)
 * @attr {number} end-length - Number of characters to show at the end (default: 4)
 * @attr {boolean} expandable - Whether the component should expand on focus/click
 *
 * @csspart container - The main container element
 * @csspart start - The start portion text
 * @csspart middle - The middle portion container
 * @csspart end - The end portion text
 *
 *
 * @example
 * ```html
 * <truncated-value
 *   value="0x1234567890abcdef1234567890abcdef12345678"
 *   start-length="8"
 *   end-length="6"
 *   expandable
 * ></truncated-value>
 * ```
 */
@customElement("truncated-value")
export class TruncatedValueElement extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
    }
    ${unsafeCSS(styles)}
  `;

  @property({ type: String })
  value = "";

  @property({ type: Number, attribute: "start-length" })
  startLength = 6;

  @property({ type: Number, attribute: "end-length" })
  endLength = 4;

  @property({ type: Boolean })
  expandable = false;

  override render() {
    const { start, middle, end, isTruncated } = truncate({
      value: this.value,
      startLength: this.startLength,
      endLength: this.endLength,
    });

    const middleFirstHalf = middle.slice(0, middle.length / 2);
    const middleSecondHalf = middle.slice(middle.length / 2);

    return html`<span
      part="container"
      data-is-truncated="${isTruncated}"
      tabindex="${this.expandable ? 0 : -1}"
      class="truncated-value"
      ><span part="start">${start}</span
      ><span part="middle" class="tv-middle"
        ><span>${middleFirstHalf}</span><span aria-hidden="true"></span
        ><span>${middleSecondHalf}</span></span
      ><span part="end">${end}</span></span
    >`;
  }
}

// Declare for type checking
declare global {
  interface HTMLElementTagNameMap {
    "truncated-value": TruncatedValueElement;
  }
}
