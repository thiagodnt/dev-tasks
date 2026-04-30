import Head from 'next/head';
import styles from './task.module.css';
import { GetServerSideProps } from 'next';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';
import { TaskProps } from '@/types/task';
import { Textarea } from '@/components/Textarea';
import { Button } from '@/components/Button';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Comment } from '@/types/comment';
import toast from 'react-hot-toast';

interface TaskPageProps {
	item: TaskProps;
}

export default function Task({ item }: TaskPageProps) {
	const [input, setInput] = useState('');
	const { data: session } = useSession();

	async function handleSubmit(e: React.SyntheticEvent) {
		e.preventDefault();

		if (input === '') return;
		if (!session?.user?.email || !session?.user?.name) return;

		const data: Comment = {
			comment: input,
			user: session?.user?.email,
			username: session?.user?.name,
			taskId: item.id,
			createdAt: new Date(),
		};

		try {
			const docRef = await addDoc(collection(db, 'comments'), data);
			setInput('');
			toast.success('Comentário adicionado com sucesso');
		} catch (error) {
			console.log(error);
			toast.error('Erro ao adicionar comentário');
		}
	}

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

				<form className={styles.form} onSubmit={handleSubmit}>
					<Textarea
						placeholder="Deixe o seu comentário..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
					<Button type="submit" disabled={!session?.user || input === ''}>
						Enviar comentário
					</Button>
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
