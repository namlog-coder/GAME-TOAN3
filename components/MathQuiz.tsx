
import React from 'react';
import { Question } from '../types';

interface MathQuizProps {
  question: Question | null;
  selectedAnswer: number | null;
  onSelectAnswer: (answer: number) => void;
  isAnswerChecked: boolean;
  isCorrect: boolean | null;
}

const MathQuiz: React.FC<MathQuizProps> = ({ 
  question, 
  selectedAnswer, 
  onSelectAnswer,
  isAnswerChecked,
  isCorrect
}) => {
  if (!question) return (
    <div className="flex items-center justify-center h-full text-gray-400 italic">
      Đang chờ quay vòng quay...
    </div>
  );

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-yellow-400 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-blue-600 mb-2">Thử thách Toán học</h3>
        <div className="text-5xl font-black text-gray-800 bg-yellow-50 py-6 rounded-2xl border-2 border-dashed border-yellow-200">
          {question.expression}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option) => {
          let buttonClass = "py-4 text-2xl font-bold rounded-xl border-2 transition-all transform active:scale-95 ";
          
          if (isAnswerChecked) {
            if (option === question.answer) {
              buttonClass += "bg-green-500 border-green-600 text-white";
            } else if (option === selectedAnswer && !isCorrect) {
              buttonClass += "bg-red-500 border-red-600 text-white";
            } else {
              buttonClass += "bg-gray-100 border-gray-200 text-gray-400";
            }
          } else {
            if (selectedAnswer === option) {
              buttonClass += "bg-blue-500 border-blue-600 text-white scale-105 shadow-lg";
            } else {
              buttonClass += "bg-white border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50";
            }
          }

          return (
            <button
              key={option}
              disabled={isAnswerChecked}
              onClick={() => onSelectAnswer(option)}
              className={buttonClass}
            >
              {option}
            </button>
          );
        })}
      </div>

      {isAnswerChecked && (
        <div className={`mt-6 text-center text-xl font-bold p-3 rounded-lg ${isCorrect ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
          {isCorrect ? '🎉 Chúc mừng! Em trả lời đúng!' : '😊 Chưa đúng rồi! Hãy thử lại nhé!'}
        </div>
      )}
    </div>
  );
};

export default MathQuiz;
