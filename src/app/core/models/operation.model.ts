export type OperationStatus = 'Pending' | 'Approved' | 'Rejected';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface Operation {
    id: string;
    clientName: string;
    amount: number;
    status: OperationStatus;
    riskLevel: RiskLevel;
    description: string;
    createdAt: string;
}