import styles from './loader.module.css';

interface SpinnerProps {
	size?: number;
	color?: string;
}

export function Spinner({ size = 24, color = '#fafafa' }: SpinnerProps) {
	return (
		<div
			style={{
				width: size,
				height: size,
				border: `${size * 0.12}px solid rgba(0,0,0,0.1)`,
				borderTop: `${size * 0.12}px solid ${color}`,
			}}
			className={styles.loader}
		/>
	);
}
