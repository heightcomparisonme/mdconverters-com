/**
 * Browser configuration for different environments
 * Handles Puppeteer setup for local development and Vercel deployment
 */

import type { LaunchOptions } from 'puppeteer-core';
import type { PuppeteerLike } from './types';

export async function getBrowserConfig(puppeteer: PuppeteerLike): Promise<LaunchOptions> {
	const isProduction = process.env.NODE_ENV === 'production';
	const isVercel = process.env.VERCEL === '1';

	// Development: Use local Puppeteer with downloaded Chrome
	if (!isProduction) {
		return {
			headless: true,
			args: puppeteer.defaultArgs({
				args: ['--no-sandbox', '--disable-setuid-sandbox'],
				headless: true,
			}),
		};
	}

	// Production on Vercel: Use @sparticuz/chromium (if installed)
	if (isVercel) {
		try {
			// Try to import @sparticuz/chromium (optional dependency)
			const { default: chromium } = await import('@sparticuz/chromium');

			return {
				args: puppeteer.defaultArgs({
					args: chromium.args,
					headless: 'shell',
				}),
				executablePath: await chromium.executablePath(),
				headless: 'shell',
			};
		} catch (error) {
			console.warn(
				'@sparticuz/chromium not found. Install it for Vercel deployment:',
				'pnpm add @sparticuz/chromium puppeteer-core',
			);

			// Fallback to default (will likely fail on Vercel)
			return {
				headless: true,
				args: puppeteer.defaultArgs({
					args: ['--no-sandbox', '--disable-setuid-sandbox'],
					headless: true,
				}),
			};
		}
	}

	// Production on other platforms (e.g., VPS, Docker)
	return {
		headless: true,
		args: puppeteer.defaultArgs({
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',
				'--disable-accelerated-2d-canvas',
				'--disable-gpu',
				// --- 推荐添加以下两个，提高 Docker 稳定性 ---
				'--disable-crash-reporter', // 禁用崩溃报告，解决 crashpad 错误
				'--single-process',         // 某些精简容器环境可能需要
				// --- 推荐添加结束 ---
			],
			headless: true,
		}),
	};
}

export function getPuppeteerPackage() {
	const isProduction = process.env.NODE_ENV === 'production';
	const isVercel = process.env.VERCEL === '1';

	// Use puppeteer-core on Vercel (lighter), full puppeteer elsewhere
	if (isProduction && isVercel) {
		return 'puppeteer-core';
	}

	return 'puppeteer';
}
