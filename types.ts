
export enum EarningCategory {
    UBER = 'Uber',
    NINENINE = '99',
    PARTICULAR = 'Particular',
}

export enum ExpenseCategory {
    FUEL = 'Combustível',
    RENTAL = 'Aluguel',
    FOOD = 'Alimentação',
    MAINTENANCE = 'Manutenção',
    FINES = 'Multas',
    OTHER = 'Outros',
}

export interface EntryBase {
    id: string;
    date: string;
}

export interface Earning extends EntryBase {
    type: 'earning';
    category: EarningCategory;
    amount: number;
}

export interface Expense extends EntryBase {
    type: 'expense';
    category: ExpenseCategory;
    amount: number;
    description?: string;
}

export interface WorkShift extends EntryBase {
    type: 'shift';
    startTime: string;
    endTime: string;
    durationMinutes: number;
}

export type Entry = Earning | Expense | WorkShift;

export enum GoalType {
    EARNING = 'earning',
    HOURS = 'hours',
}

export enum GoalPeriod {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
}

export interface Goal {
    id: string;
    type: GoalType;
    period: GoalPeriod;
    target: number;
    description: string;
}
