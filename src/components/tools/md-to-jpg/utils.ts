import type { MdToJpgConfig } from './types';
import { DEFAULT_CONFIG } from './constants';

/**
 * Validate configuration parameters
 */
export function validateConfig(config: MdToJpgConfig): string | null {
	if (config.width && (config.width < 100 || config.width > 5000)) {
		return 'Width must be between 100-5000 pixels';
	}
	if (config.height && (config.height < 100 || config.height > 5000)) {
		return 'Height must be between 100-5000 pixels';
	}
	if (config.scale && (config.scale < 0.5 || config.scale > 5)) {
		return 'Scale must be between 0.5-5';
	}
	if (config.quality && (config.quality < 0.1 || config.quality > 1)) {
		return 'Quality must be between 0.1-1';
	}
	return null;
}

/**
 * Merge configuration with default values
 */
export function mergeConfig(
	config: Partial<MdToJpgConfig> = {},
): Required<MdToJpgConfig> {
	return {
		width: config.width ?? DEFAULT_CONFIG.width,
		height: config.height ?? DEFAULT_CONFIG.height,
		scale: config.scale ?? DEFAULT_CONFIG.scale,
		backgroundColor: config.backgroundColor ?? DEFAULT_CONFIG.backgroundColor,
		quality: config.quality ?? DEFAULT_CONFIG.quality,
	};
}

/**
 * Download image
 */
export function downloadImage(dataUrl: string, filename: string): void {
	const link = document.createElement('a');
	link.href = dataUrl;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

