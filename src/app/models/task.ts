export class Task {
    id!: number;
    text!: string;
    start_date!: string;
    duration!: number;
    progress!: number;
    parent!: number;
    priority?: number;
    users?: number[];
    type?: string;
    project_id?: number | string;
    responsible?: string; // Added responsible field
}
