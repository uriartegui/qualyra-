export interface Template {
  id: string;
  name: string;
  description: string;
  totalRules: number;
  createdAt: string;
  updatedAt: string;
  rules?: TemplateRule[];
}

export interface TemplateRule {
  id: string;
  title: string;
  topicName: string;
  expectedResult: string;
}

export interface Rule {
  id: string;
  title: string;
  topicName: string;
  topicId: string;
  expectedResult: string;
  description?: string;
  steps?: string;
  observations?: string;
}

export type UserRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';