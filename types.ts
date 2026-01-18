
export interface Question {
  id: number;
  expression: string;
  answer: number;
  options: number[];
}

export interface GameState {
  currentStudent: string | null;
  currentQuestion: Question | null;
  selectedAnswer: number | null;
  isAnswerChecked: boolean;
  isCorrect: boolean | null;
  isSpinning: boolean;
}
