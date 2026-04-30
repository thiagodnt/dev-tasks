export interface Task {
	task: string;
	public: boolean;
	user: string;
	createdAt: Date;
}

export interface TaskProps extends Task {
	id: string;
}
