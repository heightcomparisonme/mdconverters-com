export interface MdToJpgConfig {
	width?: number;
	height?: number;
	scale?: number;
	backgroundColor?: string;
	quality?: number;
}

export interface MdToJpgResult {
	imageUrl: string;
	success: boolean;
	error?: string;
}

