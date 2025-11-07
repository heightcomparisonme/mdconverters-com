'use server';

import { type MdToPdfConfig, convertMarkdownToPdf } from '@/lib/md-to-pdf';
import { actionClient } from '@/lib/safe-action';
import { z } from 'zod';

// Note: Server Actions run in Node.js runtime by default
// Runtime configuration should be set in the page component

const mdToPdfSchema = z.object({
  markdown: z.string().min(1, 'Markdown content is required'),
  config: z
    .object({
      css: z.string().optional(),
      document_title: z.string().optional(),
      body_class: z.array(z.string()).optional(),
      page_media_type: z.enum(['screen', 'print']).optional(),
      highlight_style: z.string().optional(),
    })
    .optional(),
});

/**
 * Server action to convert markdown to PDF.
 */
export const convertMdToPdfAction = actionClient
  .schema(mdToPdfSchema)
  .action(async ({ parsedInput: { markdown, config } }) => {
    try {
      const result = await convertMarkdownToPdf(
        markdown,
        config as MdToPdfConfig
      );

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Failed to convert markdown to PDF',
        };
      }

      // Convert buffer to base64 for transmission
      const base64Pdf = result.content.toString('base64');

      // Validate base64
      if (!base64Pdf || typeof base64Pdf !== 'string') {
        console.error(
          'Invalid base64 generated:',
          typeof base64Pdf,
          base64Pdf?.length
        );
        return {
          success: false,
          error: 'Failed to encode PDF data',
        };
      }

      console.log(
        'PDF converted successfully, base64 length:',
        base64Pdf.length
      );

      return {
        success: true,
        data: {
          pdf: base64Pdf,
          size: result.content.length,
        },
      };
    } catch (error) {
      console.error('Error converting markdown to PDF:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  });
