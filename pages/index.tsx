import Head from 'next/head';
import styles from '@/styles/home.module.css';
import hero from '@/public/assets/hero.png';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';

interface HomeProps {
	tasks: number;
	comments: number;
}

export default function Home({ tasks, comments }: HomeProps) {
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
					<div className={styles.infoContent}>
						<section className={styles.box}>+{tasks} Tarefas</section>
						<section className={styles.box}>+{comments} Comentários</section>
					</div>
				</main>
			</div>
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const tasksRef = collection(db, 'tasks');
	const commentsRef = collection(db, 'comments');

	const tasks = await getDocs(tasksRef);
	const comments = await getDocs(commentsRef);

	return {
		props: {
			tasks: tasks.size || 0,
			comments: comments.size || 0,
		},
		revalidate: 60, // Revalidar após 60 segundos
	};
};
