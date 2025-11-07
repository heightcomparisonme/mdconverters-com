export interface MarkdownViewerProps {
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	className?: string;
	fullScreen?: boolean;
}

export interface MarkdownViewerState {
	hasEdited: boolean;
	scrollBarSync: boolean;
}
