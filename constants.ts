import { ProgrammingLanguage } from './types';
import { 
  FileCode, FileJson, FileType, 
  Code2, Codepen, Database, 
  Terminal, Globe, Cpu, Layers 
} from 'lucide-react';

export const LANGUAGES: ProgrammingLanguage[] = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'JSX', 'TSX',
  'Python', 'Java', 'Kotlin', 'Swift', 'C', 'C++',
  'C#', 'Go', 'Rust', 'Dart', 'PHP', 'Ruby',
  'SQL', 'Markdown'
];

export const LANGUAGE_ICONS: Record<ProgrammingLanguage, any> = {
  HTML: Globe,
  CSS: Codepen,
  JavaScript: FileCode,
  TypeScript: FileCode,
  JSX: FileCode,
  TSX: FileCode,
  Python: Terminal,
  Java: Codepen,
  Kotlin: Codepen,
  Swift: Codepen,
  C: Cpu,
  'C++': Cpu,
  'C#': Codepen,
  Go: Codepen,
  Rust: Layers,
  Dart: Codepen,
  PHP: Globe,
  Ruby: Codepen,
  SQL: Database,
  Markdown: FileType
};

export const SUGGESTIONS = [
  "Create a responsive navbar with a logo",
  "Generate a Python function to calculate Fibonacci",
  "Create a Java class for a simple banking system",
  "Write a Flutter widget for a custom card"
];

export const DEFAULT_CODE_PLACEHOLDER = "// Generated code will appear here";
