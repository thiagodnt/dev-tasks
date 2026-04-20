import Head from 'next/head';
import styles from '@/styles/home.module.css';
import hero from '@/public/assets/hero.png';
import Image from 'next/image';

export default function Home() {
	return (
		<>
			<Head>
				<title>DevTasks</title>
				<meta name="description" content="Organize suas tarefas de forma fácil" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className={styles.container}>
				<main className={styles.main}>
					<div className={styles.heroWrapper}>
						<Image className={styles.hero} alt="Logo DevTasks" src={hero} priority />
						<h1 className={styles.title}>
							Sistema feito para você organizar
							<br />
							seus estudos e tarefas
						</h1>
					</div>
				</main>
			</div>
		</>
	);
}
