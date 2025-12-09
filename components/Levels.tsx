import React, { useState, useEffect } from 'react';
import { PromptChallenge, FactCheckScenario } from '../types';
import { generateFutureDiary, generateTrickyFact } from '../services/geminiService';
import { parse } from 'marked';

// --- UI Helpers ---
const Card: React.FC<{ children?: React.ReactNode; className?: string, onClick?: () => void }> = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-white/90 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-600 rounded-2xl p-6 shadow-xl transition-colors duration-300 ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, children, variant = 'primary', disabled = false }: { onClick: () => void, children?: React.ReactNode, variant?: 'primary' | 'secondary' | 'danger' | 'success', disabled?: boolean }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30",
    secondary: "bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-500",
    danger: "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/30",
    success: "bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/30",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} font-bold py-3 px-6 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};

// --- Level 1: Questioning Power ---
export const LevelOnePrompt = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const challenges: PromptChallenge[] = [
    {
      id: 1,
      scenario: "유튜브 크리에이터가 되고 싶어. AI에게 도움을 요청해보자.",
      badPrompt: "유튜브 어떻게 해?",
      betterPromptOptions: [
        "유튜브 알고리즘 알려줘.",
        "중학생이 시작하기 좋은 유튜브 주제 3가지만 추천해줘. 나는 춤추는 걸 좋아해.",
        "유명한 유튜버 이름 알려줘."
      ],
      correctIndex: 1,
      explanation: "👍 완벽해! 구체적인 상황(중학생, 춤)과 원하는 결과(3가지 추천)를 말해주면 AI는 최고의 파트너가 됩니다."
    },
    {
      id: 2,
      scenario: "숙제로 '환경 오염' 포스터를 그려야 해.",
      badPrompt: "환경 오염 그림 그려줘.",
      betterPromptOptions: [
        "지구가 아파하는 그림 그려줘.",
        "미래 도시의 모습을 그려줘.",
        "쓰레기로 뒤덮인 바다에서 로봇 물고기가 청소하는 모습을 긍정적인 톤으로 그려줘."
      ],
      correctIndex: 2,
      explanation: "🎨 멋져요! AI에게 '무엇을', '어떻게', '어떤 분위기로' 그릴지 설명하면 상상 속 이미지를 그대로 꺼낼 수 있어요."
    }
  ];

  const handleChoice = (index: number) => {
    if (index === challenges[step].correctIndex) {
      setFeedback(challenges[step].explanation);
    } else {
      setFeedback("😅 조금 더 구체적인 질문이 필요해요. AI가 헷갈리지 않게 자세히 말해볼까요?");
    }
  };

  const nextStep = () => {
    setFeedback(null);
    if (step < challenges.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const current = challenges[step];

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display text-blue-600 dark:text-blue-400">Mission 1: 질문이 곧 실력이다</h2>
        <p className="text-slate-600 dark:text-slate-300">"과거에는 정답을 외우는 게 중요했지만, 미래는 <span className="text-amber-600 dark:text-yellow-400 font-bold">핵심을 찌르는 질문</span>을 하는 사람이 리더가 됩니다."</p>
      </div>

      <Card>
        <div className="mb-4">
          <span className="bg-slate-200 dark:bg-slate-700 text-xs px-2 py-1 rounded text-slate-600 dark:text-slate-300 font-bold">상황</span>
          <p className="text-xl font-bold mt-2 text-slate-800 dark:text-white">{current.scenario}</p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/50 p-4 rounded-lg mb-6 flex items-center gap-3">
          <div className="text-2xl">❌</div>
          <div>
            <div className="text-xs text-red-600 dark:text-red-300 font-bold">나쁜 질문 (Too Simple)</div>
            <div className="text-slate-700 dark:text-slate-200">"{current.badPrompt}"</div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-bold text-blue-600 dark:text-blue-300">더 좋은 질문을 선택해주세요:</p>
          {current.betterPromptOptions.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleChoice(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all text-slate-800 dark:text-slate-100 ${
                feedback && idx === current.correctIndex
                  ? "bg-green-100 dark:bg-green-900/40 border-green-500 text-green-800 dark:text-green-100"
                  : "bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-blue-400"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </Card>

      {feedback && (
        <div className="animate-bounce-in bg-blue-50 dark:bg-blue-900/80 border border-blue-200 dark:border-blue-400 p-4 rounded-xl text-center shadow-lg">
          <p className="mb-4 text-lg text-slate-800 dark:text-white">{feedback}</p>
          {feedback.includes("완벽해") || feedback.includes("멋져요") ? (
            <Button onClick={nextStep} variant="success">다음 미션으로 이동 &rarr;</Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

// --- Level 2: Extension of Intelligence ---
export const LevelTwoExtension = ({ onComplete }: { onComplete: (story: string) => void }) => {
  const [input, setInput] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [iteration, setIteration] = useState(0);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    // Pass current story as context if it exists (for refinement)
    const aiResponse = await generateFutureDiary(input, story);
    setStory(aiResponse);
    setLoading(false);
    setIteration(prev => prev + 1);
    setInput("");
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
       <div className="text-center space-y-2">
        <h2 className="text-3xl font-display text-purple-600 dark:text-purple-400">Mission 2: 미래 일기장</h2>
        <p className="text-slate-600 dark:text-slate-300">"AI를 나의 두뇌를 확장시켜주는 <span className="text-amber-600 dark:text-yellow-400 font-bold">생각 파트너(Thinking Partner)</span>로 활용해 20년 후의 꿈을 함께 그려보세요."</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col justify-between min-h-[400px]">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
              <span className="text-2xl">✍️</span> 
              {iteration === 0 ? "2045년의 나 상상하기" : "AI에게 피드백 주기"}
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              {iteration === 0 
                ? "20년 후, 어떤 직업을 가지고 있을까요? AI에게 상황을 설명해주세요." 
                : "AI가 쓴 일기가 어떤가요? 더 구체적으로 묘사하거나 내용을 추가해달라고 요청해보세요."}
            </p>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-xl p-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none h-40 mb-3 transition-colors"
              placeholder={iteration === 0 
                ? "예시: 2045년, 나는 화성 탐사 기지에서 식물을 키우는 우주 농부가 되었다. 오늘 가장 기억에 남는 사건은..." 
                : "예시: 갑자기 산소 공급 장치가 고장나는 위기 상황을 추가해줘."}
            />

            {iteration > 0 && (
              <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                <button onClick={() => handleSuggestion("더 감동적으로 바꿔줘")} className="text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 whitespace-nowrap border border-slate-300 dark:border-slate-600">😭 더 감동적으로</button>
                <button onClick={() => handleSuggestion("갑작스러운 위기 상황을 추가해줘")} className="text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 whitespace-nowrap border border-slate-300 dark:border-slate-600">🚨 위기 상황 추가</button>
                <button onClick={() => handleSuggestion("미래 기술에 대해 더 자세히 묘사해줘")} className="text-xs bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 whitespace-nowrap border border-slate-300 dark:border-slate-600">🤖 기술 묘사 추가</button>
              </div>
            )}
          </div>
          <div className="mt-2">
            <Button onClick={handleGenerate} disabled={loading || !input} variant="primary">
              {loading ? "AI가 상상하는 중..." : (iteration === 0 ? "미래 일기 생성 ✨" : "수정 요청하기 🔄")}
            </Button>
          </div>
        </Card>

        <Card className="min-h-[400px] bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-500/30 flex flex-col">
           <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
              <span className="text-2xl">📔</span> 2045년 미래 일기장
            </h3>
            <div className="flex-grow overflow-y-auto leading-relaxed text-indigo-900 dark:text-indigo-100 text-lg">
              {story ? (
                <div 
                  className="animate-fadeIn prose prose-slate dark:prose-invert prose-headings:text-indigo-800 dark:prose-headings:text-indigo-300 prose-headings:font-bold prose-headings:text-xl prose-strong:text-amber-700 dark:prose-strong:text-yellow-200 max-w-none"
                  dangerouslySetInnerHTML={{ __html: parse(story) as string }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 italic text-center">
                  왼쪽 창에 2045년의 꿈을 입력하면<br/>AI가 생생한 미래 일기를 써줍니다.
                </div>
              )}
            </div>
        </Card>
      </div>

      {iteration >= 1 && (
         <div className="text-center animate-fade-in mt-8 bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
           <p className="text-green-600 dark:text-green-400 mb-4 font-bold text-lg">
             {iteration === 1 ? "AI가 작성한 미래가 마음에 드시나요? 피드백을 통해 내용을 더 풍성하게 만들어보세요!" : "멋진 협업입니다! AI 파트너와 함께 상상하면 꿈이 더 구체적으로 변합니다."}
           </p>
           {iteration >= 2 && (
             <Button onClick={() => onComplete(story)} variant="success">다음 단계: 팩트 체크 &rarr;</Button>
           )}
         </div>
      )}
    </div>
  );
};

// --- Level 3: Critical Thinking ---
export const LevelThreeCritical = ({ onComplete }: { onComplete: () => void }) => {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [scenario, setScenario] = useState<FactCheckScenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [clearedTopics, setClearedTopics] = useState<string[]>([]);

  const topics = [
    { id: "역사", icon: "📜" }, 
    { id: "과학", icon: "🧪" }, 
    { id: "우주", icon: "🚀" }, 
    { id: "동물", icon: "🦁" }
  ];

  const startTopic = async (topicId: string) => {
    setActiveTopic(topicId);
    setLoading(true);
    setScenario(null);
    setResult(null);
    const fact = await generateTrickyFact(topicId);
    setScenario({ ...fact, topic: topicId });
    setLoading(false);
  };

  const handleGuess = (guessTrue: boolean) => {
    if (!scenario || !activeTopic) return;
    if (guessTrue === scenario.isTrue) {
      setResult("correct");
      if (!clearedTopics.includes(activeTopic)) {
        setClearedTopics(prev => [...prev, activeTopic]);
      }
    } else {
      setResult("incorrect");
    }
  };

  const closeModal = () => {
    setActiveTopic(null);
    setScenario(null);
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-display text-red-500 dark:text-red-400">Mission 3: 팩트 체크 (Critical Thinking)</h2>
        <p className="text-slate-600 dark:text-slate-300">"AI 파트너도 실수할 수 있어요. 4가지 주제의 팩트를 검증하여 AI의 실수를 잡아내세요!"</p>
      </div>

      {/* Topic Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {topics.map(t => {
          const isCleared = clearedTopics.includes(t.id);
          return (
            <Card 
              key={t.id} 
              onClick={() => { if (!isCleared) startTopic(t.id); }}
              className={`flex flex-col items-center justify-center p-6 cursor-pointer transition-all hover:scale-105 min-h-[160px] 
                ${isCleared ? 'bg-green-100 dark:bg-green-900/40 border-green-500 opacity-80' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
            >
              <div className="text-4xl mb-3">{t.icon}</div>
              <div className="font-bold text-lg text-slate-800 dark:text-white">{t.id}</div>
              {isCleared ? (
                <div className="text-green-600 dark:text-green-400 font-bold text-sm mt-2">CLEAR ✅</div>
              ) : (
                <div className="text-slate-500 text-sm mt-2">도전하기</div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Question Modal/Area */}
      {activeTopic && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <Card className="max-w-xl w-full relative bg-white dark:bg-slate-800">
             <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
             
             <h3 className="text-2xl font-bold mb-6 text-center text-blue-600 dark:text-blue-300">{activeTopic} 팩트 체크</h3>

             {loading ? (
               <div className="py-12 text-center text-slate-500 dark:text-slate-400 animate-pulse">
                 AI가 문제를 생성하고 있습니다... <br/>(데이터베이스 스캔 중 📡)
               </div>
             ) : scenario ? (
               <div className="space-y-6">
                 <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-500 mb-2 font-bold">AI의 주장:</div>
                    <p className="text-xl font-medium leading-relaxed text-slate-900 dark:text-slate-100">"{scenario.statement}"</p>
                 </div>

                 {!result ? (
                   <div className="grid grid-cols-2 gap-4">
                     <Button onClick={() => handleGuess(true)} variant="primary">진실 (True) ⭕</Button>
                     <Button onClick={() => handleGuess(false)} variant="danger">거짓 (False) ❌</Button>
                   </div>
                 ) : (
                    <div className="animate-fade-in bg-slate-100 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                        <div className={`text-3xl font-bold mb-4 ${result === 'correct' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {result === 'correct' ? '정답입니다! 🎯' : '틀렸습니다 😅'}
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 mb-6">{scenario.correction}</p>
                        
                        {result === 'correct' ? (
                          <Button onClick={closeModal} variant="success">미션 완료! 목록으로</Button>
                        ) : (
                          <Button onClick={closeModal} variant="secondary">다시 시도하기</Button>
                        )}
                    </div>
                 )}
               </div>
             ) : (
               <div className="text-center text-red-500 dark:text-red-400">문제를 불러오지 못했습니다. 다시 시도해주세요.</div>
             )}
          </Card>
        </div>
      )}
      
      {/* Final Complete Button */}
      {clearedTopics.length === 4 && (
         <div className="text-center mt-12 animate-bounce">
            <p className="text-xl font-bold text-amber-600 dark:text-yellow-400 mb-4">모든 팩트 체크 완료! 🎉</p>
            <Button onClick={onComplete} variant="success">수료증 발급 받기 🏆</Button>
         </div>
      )}
    </div>
  );
};