import Head from 'next/head';
import styles from './task.module.css';
import { GetServerSideProps } from 'next';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';
import { TaskProps } from '@/types/task';
import { Textarea } from '@/components/Textarea';
import { Button } from '@/components/Button';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Comment, CommentProps } from '@/types/comment';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';

interface TaskPageProps {
	item: TaskProps;
	allComments: CommentProps[];
}

export default function Task({ item, allComments }: TaskPageProps) {
	const { data: session } = useSession();
	const [input, setInput] = useState('');
	const [comments, setComments] = useState<CommentProps[]>(allComments || []);

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
			setComments((prev) => [{ ...data, id: docRef.id }, ...prev]);
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

			<section className={styles.commentsContainer}>
				<h2>Comentários</h2>
				{comments.length === 0 && <p>Nenhum comentário a ser exibido</p>}
				{comments.map((item) => (
					<article key={item.id} className={styles.comment}>
						<div className={styles.commentHeader}>
							<label className={styles.commentLabel}>{item.username}</label>
							{item.user === session?.user?.email && (
								<button className={styles.buttonTrash}>
									<FaTrash size={18} color="#e92f3f" />
								</button>
							)}
						</div>
						<p>{item.comment}</p>
					</article>
				))}
			</section>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const id = params?.id as string;

	const docRef = doc(db, 'tasks', id);
	const snapshotTask = await getDoc(docRef);

	const q = query(
		collection(db, 'comments'),
		where('taskId', '==', id),
		orderBy('createdAt', 'desc'),
	);
	const snapshotComments = await getDocs(q);

	let comments: CommentProps[] = [];
	snapshotComments.forEach((doc) => {
		comments.push({
			id: doc.id,
			comment: doc.data()?.comment,
			user: doc.data()?.user,
			username: doc.data()?.username,
			taskId: doc.data()?.taskId,
			createdAt: doc.data().createdAt?.toDate().toLocaleDateString('pt-BR'),
		});
	});

	if (!snapshotTask.exists()) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	if (!snapshotTask.data()?.public) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const task: TaskProps = {
		id: snapshotTask.id,
		task: snapshotTask.data()?.task,
		public: snapshotTask.data()?.public,
		user: snapshotTask.data()?.user,
		createdAt: snapshotTask.data()?.createdAt?.toDate().toLocaleDateString('pt-BR'),
	};

	return {
		props: {
			item: task,
			allComments: comments,
		},
	};
};
