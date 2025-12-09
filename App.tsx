import React, { useState } from 'react';
import { GameStage, UserProfile } from './types';
import { LevelOnePrompt, LevelTwoExtension, LevelThreeCritical } from './components/Levels';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// --- Background Component ---
const Background = () => (
  <div className="fixed inset-0 -z-10 bg-[#0f172a] overflow-hidden">
    <div className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl -top-20 -left-20 animate-float" />
    <div className="absolute w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl bottom-0 right-0 animate-float" style={{ animationDelay: '2s' }} />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
  </div>
);

// --- Intro Screen ---
const IntroScreen = ({ onStart }: { onStart: (profile: UserProfile) => void }) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    school: '',
    grade: ''
  });

  const isValid = profile.name && profile.school && profile.grade;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8 animate-fadeIn">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 pb-2">
          AI Co-Pilot Academy
        </h1>
        <p className="text-xl md:text-2xl text-slate-300">
          AI와 함께 떠나는 나의 꿈 찾기 여행
        </p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <p className="mb-6 text-slate-300 leading-relaxed">
          환영합니다, 생도님!<br/>
          미래 시대의 리더가 되기 위한<br/>
          <span className="text-yellow-400 font-bold">3가지 핵심 미션</span>을 수행할 준비가 되셨나요?
        </p>
        
        <div className="space-y-3 mb-6">
           <input
            type="text"
            placeholder="학교 이름 (예: 서울중학교)"
            value={profile.school}
            onChange={(e) => setProfile({...profile, school: e.target.value})}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-center text-white focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <input
            type="text"
            placeholder="학년 반 (예: 1학년 3반)"
            value={profile.grade}
            onChange={(e) => setProfile({...profile, grade: e.target.value})}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-center text-white focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <input
            type="text"
            placeholder="이름 (예: 홍길동)"
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-center text-white focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        <button
          onClick={() => isValid && onStart(profile)}
          disabled={!isValid}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
        >
          미션 시작하기 🚀
        </button>
      </div>
    </div>
  );
};

// --- Certificate Screen ---
const CertificateScreen = ({ profile, onRestart }: { profile: UserProfile, onRestart: () => void }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    const element = document.getElementById('certificate-capture-area');
    if (!element) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions based on the canvas aspect ratio
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`AI_License_${profile.name}.pdf`);
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("PDF 다운로드 중 오류가 발생했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };
  
  const getFormattedDate = () => {
    const date = new Date();
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-fadeIn">
      {/* Certificate Capture Area */}
      <div 
        id="certificate-capture-area" 
        className="bg-white text-slate-900 p-12 rounded-2xl shadow-2xl max-w-3xl w-full border-8 border-yellow-400 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400 rotate-45 transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600 rotate-45 transform -translate-x-20 translate-y-20 opacity-20"></div>
        
        <div className="flex flex-col items-center border-b-4 border-slate-900 pb-6 mb-8">
           <h2 className="text-5xl font-display font-black text-slate-900 tracking-wider mb-2">AI CO-PILOT LICENSE</h2>
           <p className="text-slate-500 font-bold tracking-[0.5em] text-sm">OFFICIAL CERTIFICATION</p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-8 mb-10 w-full">
            <div className="text-left space-y-2">
                <div>
                    <span className="text-slate-500 text-sm font-bold block">SCHOOL</span>
                    <span className="text-2xl font-bold">{profile.school}</span>
                </div>
                <div>
                    <span className="text-slate-500 text-sm font-bold block">GRADE</span>
                    <span className="text-xl font-bold">{profile.grade}</span>
                </div>
            </div>
            <div className="mt-6 md:mt-0 text-right">
                <span className="text-slate-500 text-sm font-bold block">NAME</span>
                <span className="text-4xl font-black text-blue-600">{profile.name}</span>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-sm">
          <div className="bg-slate-100 p-5 rounded-xl border border-slate-200">
            <div className="text-3xl mb-2">🗣️</div>
            <div className="font-black text-lg text-slate-800">Prompt Master</div>
            <div className="text-slate-500 font-medium">질문이 곧 능력이다</div>
          </div>
          <div className="bg-slate-100 p-5 rounded-xl border border-slate-200">
            <div className="text-3xl mb-2">🧠</div>
            <div className="font-black text-lg text-slate-800">Thinking Partner</div>
            <div className="text-slate-500 font-medium">AI는 나의 확장 도구</div>
          </div>
          <div className="bg-slate-100 p-5 rounded-xl border border-slate-200">
            <div className="text-3xl mb-2">🕵️</div>
            <div className="font-black text-lg text-slate-800">Fact Checker</div>
            <div className="text-slate-500 font-medium">비판적 사고 완료</div>
          </div>
        </div>

        <p className="text-slate-700 text-lg font-medium leading-relaxed mb-8">
          위 사람은 AI 아카데미의 모든 과정을 우수하게 수료하였으며,<br/>
          AI를 단순한 도구가 아닌 <strong>'최고의 협력자'</strong>로 활용할 준비가 되었음을 증명합니다.
        </p>
        
        <div className="flex flex-col items-center justify-center border-t border-slate-200 pt-6">
           <div className="text-slate-900 font-bold text-xl tracking-tight mb-1">부산대학교 AI융합교육원</div>
           <div className="text-slate-400 text-xs font-mono">
             발급일자: {getFormattedDate()}
           </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-lg justify-center">
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isDownloading ? (
            <span>다운로드 중... ⏳</span>
          ) : (
            <><span>PDF로 저장하기</span> <span>📥</span></>
          )}
        </button>

        <button
          onClick={onRestart}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-full transition-colors border border-slate-500"
        >
          처음으로 돌아가기
        </button>
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [stage, setStage] = useState<GameStage>(GameStage.INTRO);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', school: '', grade: '' });

  const handleStart = (profile: UserProfile) => {
    setUserProfile(profile);
    setStage(GameStage.LEVEL_1_PROMPT);
  };

  const renderStage = () => {
    switch (stage) {
      case GameStage.INTRO:
        return <IntroScreen onStart={handleStart} />;
      case GameStage.LEVEL_1_PROMPT:
        return (
          <div className="min-h-screen p-6 pt-12 flex flex-col items-center">
            <LevelOnePrompt onComplete={() => setStage(GameStage.LEVEL_2_EXTENSION)} />
          </div>
        );
      case GameStage.LEVEL_2_EXTENSION:
        return (
          <div className="min-h-screen p-6 pt-12 flex flex-col items-center">
            <LevelTwoExtension onComplete={() => setStage(GameStage.LEVEL_3_CRITICAL)} />
          </div>
        );
      case GameStage.LEVEL_3_CRITICAL:
        return (
          <div className="min-h-screen p-6 pt-12 flex flex-col items-center">
            <LevelThreeCritical onComplete={() => setStage(GameStage.CERTIFICATE)} />
          </div>
        );
      case GameStage.CERTIFICATE:
        return <CertificateScreen profile={userProfile} onRestart={() => setStage(GameStage.INTRO)} />;
      default:
        return <div>Error</div>;
    }
  };

  return (
    <>
      <Background />
      {/* Progress Bar (Visible only during levels) */}
      {stage !== GameStage.INTRO && stage !== GameStage.CERTIFICATE && (
        <div className="fixed top-0 left-0 w-full h-2 bg-slate-800 z-50">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ 
              width: stage === GameStage.LEVEL_1_PROMPT ? '33%' : 
                     stage === GameStage.LEVEL_2_EXTENSION ? '66%' : '100%' 
            }}
          />
        </div>
      )}
      
      {renderStage()}
    </>
  );
}