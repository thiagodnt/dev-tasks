export interface Comment {
	comment: string;
	user: string;
	username: string;
	taskId: string;
	createdAt: Date;
}

export interface CommentProps extends Comment {
	id: string;
}
