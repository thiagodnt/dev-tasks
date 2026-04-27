import { GetServerSideProps } from 'next';
import styles from './dashboard.module.css';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { Textarea } from '@/components/Textarea';
import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';

export default function Dashboard() {
	return (
		<div className={styles.container}>
			<Head>
				<title>DevTasks | Meu Painel</title>
			</Head>
			<main className={styles.main}>
				<section className={styles.content}>
					<div className={styles.contentForm}>
						<h1 className={styles.title}>Qual a sua tarefa?</h1>
						<form>
							<Textarea placeholder="Digite a sua tarefa..." />
							<div className={styles.checkboxArea}>
								<input
									type="checkbox"
									className={styles.checkbox}
									id="public-task-checkbox"
								/>
								<label htmlFor="public-task-checkbox">Deixar tarefa pública</label>
							</div>
							<button type="submit" className={styles.button}>
								Criar tarefa
							</button>
						</form>
					</div>
				</section>

				<section className={styles.taskContainer}>
					<h1>Minhas tarefas</h1>

					<article className={styles.task}>
						<div className={styles.tagContainer}>
							<label className={styles.tag}>PÚBLICO</label>
							<button className={styles.shareButton}>
								<FiShare2 size={22} color="#0f0f0f" />
							</button>
						</div>

						<div className={styles.taskContent}>
							<p>Descrição tarefa</p>
							<button className={styles.trashButton}>
								<FaTrash size={24} color="#ea3140" />
							</button>
						</div>
					</article>
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
		props: {},
	};
};
