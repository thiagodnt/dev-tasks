import Head from 'next/head';
import styles from './task.module.css';
import { GetServerSideProps } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';
import { TaskProps } from '@/types/task';
import { Textarea } from '@/components/Textarea';
import { Button } from '@/components/Button';

interface TaskPageProps {
	item: TaskProps;
}

export default function Task({ item }: TaskPageProps) {
	return (
		<div className={styles.container}>
			<Head>
				<title>DevTasks | Detalhes da tarefa</title>
			</Head>

			<main className={styles.main}>
				<h1>Tarefa</h1>
				<article className={styles.task}>
					<p>{item.task}</p>
				</article>
			</main>

			<section className={styles.commentsContainer}>
				<h2>Deixar comentário</h2>

				<form className={styles.form}>
					<Textarea placeholder="Deixe o seu comentário..." />
					<Button type="submit">Enviar comentário</Button>
				</form>
			</section>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const id = params?.id as string;

	const docRef = doc(db, 'tasks', id);
	const snapshot = await getDoc(docRef);

	if (!snapshot.exists()) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	if (!snapshot.data()?.public) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const task: TaskProps = {
		id: snapshot.id,
		task: snapshot.data()?.task,
		public: snapshot.data()?.public,
		user: snapshot.data()?.user,
		createdAt: snapshot.data()?.createdAt?.toDate().toLocaleDateString('pt-BR'),
	};

	return {
		props: {
			item: task,
		},
	};
};
