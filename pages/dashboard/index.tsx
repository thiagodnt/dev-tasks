import styles from './dashboard.module.css';
import Head from 'next/head';

export default function Dashboard() {
	return (
		<div className={styles.container}>
			<Head>
				<title>DevTasks | Meu Painel</title>
			</Head>
			<h1>Meu Painel</h1>
		</div>
	);
}
