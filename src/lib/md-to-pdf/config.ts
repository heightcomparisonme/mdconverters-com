import type { MarkedExtension, MarkedOptions } from 'marked';
import type { PDFOptions } from 'puppeteer';

export interface MdToPdfConfig {
  /**
   * Custom css styles.
   */
  css?: string;

  /**
   * Name of the HTML Document.
   */
  document_title?: string;

  /**
   * List of classes for the body tag.
   */
  body_class?: string[];

  /**
   * Media type to emulate the page with.
   */
  page_media_type?: 'screen' | 'print';

  /**
   * Highlight.js stylesheet to use (without the .css extension).
   */
  highlight_style?: string;

  /**
   * Options for the Marked parser.
   */
  marked_options?: MarkedOptions;

  /**
   * PDF options for Puppeteer.
   */
  pdf_options?: PDFOptions;

  /**
   * Custom Extensions to be passed to marked.
   */
  marked_extensions?: MarkedExtension[];
}

export const defaultMdToPdfConfig: Required<MdToPdfConfig> = {
  css: '',
  document_title: 'Markdown to PDF',
  body_class: [],
  page_media_type: 'screen',
  highlight_style: 'github',
  marked_options: {},
  pdf_options: {
    printBackground: true,
    format: 'A4',
    margin: {
      top: '30mm',
      right: '40mm',
      bottom: '30mm',
      left: '20mm',
    },
  },
  marked_extensions: [],
};
