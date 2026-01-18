
import React, { useState, useCallback } from 'react';
import SpinWheel from './components/SpinWheel';
import MathQuiz from './components/MathQuiz';
import { GameState } from './types';
import { generateQuestion } from './utils/math';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    currentStudent: null,
    currentQuestion: null,
    selectedAnswer: null,
    isAnswerChecked: false,
    isCorrect: null,
    isSpinning: false,
  });

  const handleSpinStart = useCallback(() => {
    if (state.isSpinning) return;
    setState(prev => ({ 
      ...prev, 
      isSpinning: true, 
      currentStudent: null,
      currentQuestion: null,
      isAnswerChecked: false,
      selectedAnswer: null,
      isCorrect: null
    }));
  }, [state.isSpinning]);

  const handleSpinEnd = useCallback((student: string) => {
    setState(prev => ({ 
      ...prev, 
      isSpinning: false, 
      currentStudent: student,
      currentQuestion: generateQuestion()
    }));
  }, []);

  const handleSelectAnswer = useCallback((answer: number) => {
    setState(prev => ({ ...prev, selectedAnswer: answer }));
  }, []);

  const handleCheckResult = useCallback(() => {
    if (state.selectedAnswer === null || !state.currentQuestion) return;
    
    const isCorrect = state.selectedAnswer === state.currentQuestion.answer;
    setState(prev => ({ 
      ...prev, 
      isAnswerChecked: true, 
      isCorrect 
    }));
  }, [state.selectedAnswer, state.currentQuestion]);

  const handleNext = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStudent: null,
      currentQuestion: null,
      selectedAnswer: null,
      isAnswerChecked: false,
      isCorrect: null
    }));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-sky-100 p-4 md:p-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-black text-blue-700 drop-shadow-md tracking-tight">
          TRÒ CHƠI TOÁN HỌC LỚP 3
        </h1>
        <p className="text-xl md:text-2xl text-blue-500 font-bold mt-2 bg-white/50 inline-block px-6 py-1 rounded-full">
          Luyện tập Bảng Nhân & Bảng Chia
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full items-center lg:items-start justify-center">
        {/* Left Column - Wheel */}
        <section className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="bg-white/40 backdrop-blur-sm rounded-[3rem] p-8 shadow-inner border-4 border-white/50 w-full flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-black text-blue-800 mb-8 px-8 py-3 bg-white rounded-2xl shadow-sm border-b-4 border-blue-200 min-h-[4rem] flex items-center justify-center text-center w-full">
              {state.isSpinning ? "🔄 Đang chọn học sinh..." : (state.currentStudent ? `🎯 ${state.currentStudent}` : "Vòng Quay May Mắn")}
            </h2>
            <SpinWheel 
              isSpinning={state.isSpinning} 
              onSpinStart={handleSpinStart}
              onSpinEnd={handleSpinEnd} 
            />
          </div>
        </section>

        {/* Right Column - Question */}
        <section className="w-full lg:w-1/2 flex flex-col items-center justify-center h-full">
          <MathQuiz 
            question={state.currentQuestion}
            selectedAnswer={state.selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
            isAnswerChecked={state.isAnswerChecked}
            isCorrect={state.isCorrect}
          />
        </section>
      </main>

      {/* Control Buttons Area */}
      <div className="mt-8 flex flex-col items-center space-y-8 pb-12">
        <div className="flex flex-wrap justify-center gap-6">
          {!state.currentQuestion && (
            <button 
              onClick={handleSpinStart}
              disabled={state.isSpinning}
              className={`group relative px-12 py-5 text-3xl font-black rounded-3xl text-white shadow-[0_10px_0_0_rgba(30,58,138,1)] transform transition-all active:translate-y-1 active:shadow-none
                ${state.isSpinning ? 'bg-gray-400 grayscale' : 'bg-blue-600 hover:bg-blue-500 hover:-rotate-1'}`}
            >
              🎡 QUAY
            </button>
          )}

          {state.currentQuestion && !state.isAnswerChecked && (
            <button 
              onClick={handleCheckResult}
              disabled={state.selectedAnswer === null}
              className={`px-12 py-5 text-3xl font-black rounded-3xl text-white shadow-[0_10px_0_0_rgba(21,128,61,1)] transform transition-all active:translate-y-1 active:shadow-none
                ${state.selectedAnswer === null ? 'bg-gray-400 cursor-not-allowed grayscale' : 'bg-green-600 hover:bg-green-500 hover:rotate-1'}`}
            >
              ✅ KIỂM TRA
            </button>
          )}

          {state.isAnswerChecked && (
            <button 
              onClick={handleNext}
              className="px-12 py-5 text-3xl font-black rounded-3xl bg-purple-600 text-white shadow-[0_10px_0_0_rgba(88,28,135,1)] hover:bg-purple-500 transform transition-all active:translate-y-1 active:shadow-none hover:rotate-1"
            >
              ➡️ TIẾP TỤC
            </button>
          )}
        </div>

        {/* Author Credit */}
        <div className="text-blue-900 font-bold bg-white/60 backdrop-blur-sm px-10 py-3 rounded-2xl shadow-sm border-2 border-white/50 text-lg">
           Tác giả: <span className="text-pink-600">Phùng Thị Mười</span> – Trường TH Nguyễn Trãi
        </div>
      </div>
    </div>
  );
};

export default App;
