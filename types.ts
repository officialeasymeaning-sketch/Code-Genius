export type ProgrammingLanguage = 
  | 'HTML' | 'CSS' | 'JavaScript' | 'TypeScript' | 'JSX' | 'TSX'
  | 'Python' | 'Java' | 'Kotlin' | 'Swift' | 'C' | 'C++'
  | 'C#' | 'Go' | 'Rust' | 'Dart' | 'PHP' | 'Ruby'
  | 'SQL' | 'Markdown';

export interface CodeGenerationResponse {
  code: string;
  explanation?: string;
  language: ProgrammingLanguage;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum TabOption {
  OUTPUT = 'Output',
  CONSOLE = 'Console'
}
