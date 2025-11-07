'use server';

import { getDb } from '@/db';
import { sharedHtml } from '@/db/schema';
import { actionClient } from '@/lib/safe-action';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const shareHtmlSchema = z.object({
	markdown: z.string().min(1, 'Markdown content is required'),
	html: z.string().min(1, 'HTML content is required'),
	title: z.string().optional(),
});

const getSharedHtmlSchema = z.object({
	shareId: z.string().min(1, 'Share ID is required'),
});

/**
 * Server action to share HTML content.
 * Saves markdown and HTML to database and returns a shareable link.
 */
export const shareHtmlAction = actionClient
	.schema(shareHtmlSchema)
	.action(async ({ parsedInput: { markdown, html, title } }) => {
		try {
			const db = await getDb();

			// Generate a unique share ID (8 characters)
			const shareId = nanoid(8);

			// Insert into database
			const result = await db
				.insert(sharedHtml)
				.values({
					id: nanoid(),
					shareId,
					markdown,
					html,
					title: title || 'Untitled',
					viewCount: 0,
				})
				.returning();

			if (!result || result.length === 0) {
				return {
					success: false,
					error: 'Failed to save shared HTML',
				};
			}

			return {
				success: true,
				data: {
					shareId: result[0].shareId,
					title: result[0].title,
				},
			};
		} catch (error) {
			console.error('Error sharing HTML:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			};
		}
	});

/**
 * Server action to get shared HTML content.
 * Increments view count and returns the content.
 */
export const getSharedHtmlAction = actionClient
	.schema(getSharedHtmlSchema)
	.action(async ({ parsedInput: { shareId } }) => {
		try {
			const db = await getDb();

			// Get the shared HTML
			const result = await db
				.select()
				.from(sharedHtml)
				.where(eq(sharedHtml.shareId, shareId))
				.limit(1);

			if (!result || result.length === 0) {
				return {
					success: false,
					error: 'Shared HTML not found',
				};
			}

			const shared = result[0];

			// Check if expired
			if (shared.expiresAt && new Date(shared.expiresAt) < new Date()) {
				return {
					success: false,
					error: 'This shared HTML has expired',
				};
			}

			// Increment view count
			await db
				.update(sharedHtml)
				.set({ viewCount: shared.viewCount + 1 })
				.where(eq(sharedHtml.shareId, shareId));

			return {
				success: true,
				data: {
					title: shared.title,
					markdown: shared.markdown,
					html: shared.html,
					viewCount: shared.viewCount + 1,
					createdAt: shared.createdAt,
				},
			};
		} catch (error) {
			console.error('Error getting shared HTML:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error occurred',
			};
		}
	});
