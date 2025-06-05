export type DeadlineStatus = 'overdue' | 'warning' | 'normal';

export function checkDeadline(deadline: string): DeadlineStatus {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return 'overdue';
    } else if (diffDays <= 3) {
        return 'warning';
    }
    return 'normal';
} 