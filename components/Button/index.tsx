import { ButtonHTMLAttributes } from 'react';
import styles from './button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ children, ...rest }: ButtonProps) {
	return (
		<button type="button" className={styles.button} {...rest}>
			{children}
		</button>
	);
}
