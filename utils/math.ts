
import { Question } from '../types';

export const generateQuestion = (): Question => {
  const isMultiplication = Math.random() > 0.5;
  let a = Math.floor(Math.random() * 8) + 2; // 2 to 9
  let b = Math.floor(Math.random() * 8) + 2; // 2 to 9
  
  let expression: string;
  let answer: number;

  if (isMultiplication) {
    expression = `${a} × ${b} = ?`;
    answer = a * b;
  } else {
    // Division: (a * b) / a = b
    const product = a * b;
    expression = `${product} : ${a} = ?`;
    answer = b;
  }

  const optionsSet = new Set<number>();
  optionsSet.add(answer);

  while (optionsSet.size < 4) {
    let offset = Math.floor(Math.random() * 10) - 5;
    if (offset === 0) offset = 1;
    const distractor = Math.max(1, answer + offset);
    optionsSet.add(distractor);
  }

  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  return {
    id: Date.now(),
    expression,
    answer,
    options
  };
};
