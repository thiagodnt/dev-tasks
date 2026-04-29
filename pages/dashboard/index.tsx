import styles from './dashboard.module.css';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Textarea } from '@/components/Textarea';
import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';
import { ChangeEvent, useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/Loader/spinner';
import Link from 'next/link';

interface Task {
	task: string;
	public: boolean;
	user: string;
	createdAt: Date;
}

interface TaskProps extends Task {
	id: string;
}

interface DashboardProps {
	user: {
		email: string;
	};
}

export default function Dashboard({ user }: DashboardProps) {
	const [input, setInput] = useState('');
	const [publicTask, setPublicTask] = useState(false);
	const [tasks, setTasks] = useState<TaskProps[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const taskRef = collection(db, 'tasks');
		const q = query(taskRef, orderBy('createdAt', 'desc'), where('user', '==', user?.email));

		const unsub = onSnapshot(q, (snapshot) => {
			let list = [] as TaskProps[];

			snapshot.forEach((doc) => {
				list.push({
					id: doc.id,
					task: doc.data().task,
					public: doc.data().public,
					user: doc.data().user,
					createdAt: doc.data().createdAt,
				});
			});

			setTasks(list);
			setLoading(false);
		});

		return () => {
			unsub();
		};
	}, [user?.email]);

	function handlePublicTask(e: ChangeEvent<HTMLInputElement>) {
		setPublicTask(e.target.checked);
	}

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();

		if (input === '') {
			return;
		}

		const data: Task = {
			task: input,
			public: publicTask,
			user: user?.email,
			createdAt: new Date(),
		};

		try {
			await addDoc(collection(db, 'tasks'), data);
			toast.success('Tarefa criada com sucesso');
			setInput('');
			setPublicTask(false);
		} catch (error) {
			console.log(error);
			toast.error('Erro ao criar tarefa');
		}
	}

	async function handleShare(id: string) {
		await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/task/${id}`);
		toast.success('Copiado para a área de transferência');
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>DevTasks | Meu Painel</title>
			</Head>
			<main className={styles.main}>
				<section className={styles.content}>
					<div className={styles.contentForm}>
						<h1 className={styles.title}>Qual a sua tarefa?</h1>
						<form onSubmit={handleSubmit}>
							<Textarea
								placeholder="Digite a sua tarefa..."
								value={input}
								onChange={(e) => setInput(e.target.value)}
							/>
							<div className={styles.checkboxArea}>
								<input
									type="checkbox"
									id="public-task-checkbox"
									className={styles.checkbox}
									checked={publicTask}
									onChange={handlePublicTask}
								/>
								<label htmlFor="public-task-checkbox">Deixar tarefa pública</label>
							</div>
							<button type="submit" className={styles.button} disabled={input.length === 0}>
								Criar tarefa
							</button>
						</form>
					</div>
				</section>

				<section className={styles.taskContainer}>
					<h1>Minhas tarefas</h1>

					{loading && (
						<div className={styles.loaderWrapper}>
							<Spinner size={32} color="#0f0f0f" />
						</div>
					)}

					{tasks.map((task) => (
						<article key={task.id} className={styles.task}>
							{task.public && (
								<div className={styles.tagContainer}>
									<label className={styles.tag}>PÚBLICO</label>
									<button
										className={styles.shareButton}
										onClick={() => handleShare(task.id)}
									>
										<FiShare2 size={22} color="#0f0f0f" />
									</button>
								</div>
							)}

							<div className={styles.taskContent}>
								{task.public ? (
									<Link href={`/task/${task.id}`}>
										<p>{task.task}</p>
									</Link>
								) : (
									<p>{task.task}</p>
								)}
								<button className={styles.trashButton}>
									<FaTrash size={24} color="#ea3140" />
								</button>
							</div>
						</article>
					))}
				</section>
			</main>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getSession({ req });

	if (!session?.user) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: {
			user: {
				email: session?.user?.email,
			},
		},
	};
};
