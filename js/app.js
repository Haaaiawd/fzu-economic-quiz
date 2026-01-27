// ==================== 图标组件 ====================

// 对勾图标
function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// 叉号图标
function XIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// 返回图标
function BackIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

// 锁图标
function LockIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

// 书本图标
function BookIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

// 图表图标
function ChartIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

// ==================== 组件 ====================

// 首页组件
function HomePage({ onSelectQuiz }) {
  const quizList = window.QuizData.getQuizList();

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">Quiz Hub</h1>
        <p className="home-subtitle">选择要开始的测验</p>
      </header>

      <main className="quiz-grid">
        {quizList.map((quiz) => (
          <div
            key={quiz.id}
            className={`quiz-card ${quiz.locked ? 'locked' : ''}`}
            onClick={() => !quiz.locked && onSelectQuiz(quiz.id)}
          >
            <div className={`quiz-tag ${quiz.color || 'bg-gray-400'}`}>
              {quiz.questionCount > 0 ? `${quiz.questionCount} 题` : '即将推出'}
            </div>
            <h2 className="quiz-title">{quiz.title}</h2>
            <p className="quiz-desc">{quiz.description}</p>

            {quiz.tags && quiz.tags.length > 0 && (
              <div className="quiz-tags">
                {quiz.tags.map((tag, idx) => (
                  <span key={idx} className="tag">{tag}</span>
                ))}
              </div>
            )}

            {quiz.locked && (
              <div className="quiz-lock">
                <LockIcon className="icon-sm" />
                <span>锁定</span>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}

// 测验卡片组件
function QuizCard({ question, index, total, onSelect, selectedAnswers, showRationale }) {
  const currentSelection = selectedAnswers[question.id];
  const isAnswered = currentSelection !== undefined;

  const getOptionClass = (idx) => {
    let classes = 'option-btn';
    const isSelected = question.isMultiple
      ? currentSelection?.includes(idx)
      : currentSelection === idx;
    const correctAns = question.answer;
    const isCorrect = question.isMultiple
      ? correctAns.includes(idx)
      : correctAns === idx;

    if (isAnswered) {
      if (isCorrect) {
        classes += ' correct';
      } else if (isSelected && !isCorrect) {
        classes += ' incorrect';
      } else {
        classes += ' disabled';
      }
    } else {
      if (isSelected) {
        classes += ' selected';
      }
    }
    return classes;
  };

  const getIcon = (idx) => {
    if (!isAnswered) return null;
    const correctAns = question.answer;
    const isCorrect = question.isMultiple
      ? correctAns.includes(idx)
      : correctAns === idx;

    if (isCorrect) {
      return <CheckIcon className="icon-sm text-green-600" />;
    }
    if (currentSelection === idx && !isCorrect) {
      return <XIcon className="icon-sm text-red-600" />;
    }
    return null;
  };

  return (
    <div className="quiz-question-card">
      <div className="question-header">
        <span className="question-type">
          {question.isMultiple ? '不定项' : '单选'}
        </span>
        <span className="question-progress">
          {index + 1} / {total}
        </span>
      </div>

      <h3 className="question-text">{question.question}</h3>

      <div className="options-list">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => !isAnswered && onSelect(idx)}
            disabled={isAnswered}
            className={getOptionClass(idx)}
          >
            <span className="option-content">
              {question.isMultiple && (
                <span className="option-checkbox">
                  {currentSelection?.includes(idx) && <span className="checkbox-check" />}
                </span>
              )}
              {opt}
            </span>
            {getIcon(idx)}
          </button>
        ))}
      </div>

      {showRationale && (
        <div className="rationale-box animate-fade-in">
          <div className="rationale-header">
            <BookIcon className="icon-sm" />
            <span>解析</span>
          </div>
          <p className="rationale-text">{question.rationale}</p>
        </div>
      )}
    </div>
  );
}

// 结果页面组件
function ResultPage({ score, total, onRestart, onBack }) {
  const percentage = Math.round((score / total) * 100);
  let grade = '', gradeClass = '';

  if (percentage >= 90) {
    grade = '优秀';
    gradeClass = 'grade-excellent';
  } else if (percentage >= 70) {
    grade = '良好';
    gradeClass = 'grade-good';
  } else if (percentage >= 60) {
    grade = '及格';
    gradeClass = 'grade-pass';
  } else {
    grade = '需努力';
    gradeClass = 'grade-fail';
  }

  return (
    <div className="result-page">
      <div className="result-card">
        <ChartIcon className="icon-xl" />
        <h2 className="result-title">测验结果</h2>
        <div className="score-display">
          <span className="score-number">{score}</span>
          <span className="score-total"> / {total}</span>
        </div>
        <p className={`grade-text ${gradeClass}`}>{grade}</p>
        <p className="percentage-text">正确率 {percentage}%</p>
        <div className="result-actions">
          <button onClick={onRestart} className="brutalist-btn brutalist-btn-primary">再测一次</button>
          <button onClick={onBack} className="brutalist-btn">返回主页</button>
        </div>
      </div>
    </div>
  );
}

// 测验页面组件
function QuizPage({ quizId, onBack }) {
  const quiz = window.QuizData.getQuizData(quizId);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState({});
  const [showRationale, setShowRationale] = React.useState(false);
  const [score, setScore] = React.useState(0);

  if (!quiz) {
    return (
      <div className="error-page" style={{ padding: '40px', textAlign: 'center' }}>
        <p>测验不存在</p>
        <button onClick={onBack} className="brutalist-btn" style={{ marginTop: '20px' }}>返回</button>
      </div>
    );
  }

  const question = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  const handleMultiSelect = (idx) => {
    if (selectedAnswers[question.id] !== undefined) return;
    const current = selectedAnswers[question.id] || [];
    const newSelection = current.includes(idx)
      ? current.filter(i => i !== idx)
      : [...current, idx];
    handleSelect(newSelection);
  };

  const handleSingleSelect = (idx) => {
    if (selectedAnswers[question.id] !== undefined) return;
    handleSelect(idx);
  };

  const handleSelect = (selection) => {
    const isCorrect = question.isMultiple
      ? selection.every(i => question.answer.includes(i)) && selection.length === question.answer.length
      : selection === question.answer;

    setSelectedAnswers({ ...selectedAnswers, [question.id]: selection });
    setShowRationale(true);

    if (isCorrect) {
      setScore(s => s + 1);
    }
  };

  const goNext = () => {
    if (isLastQuestion) {
      setCurrentIndex(-1);
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setShowRationale(selectedAnswers[quiz.questions[nextIdx].id] !== undefined);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowRationale(true);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowRationale(false);
    setScore(0);
  };

  if (currentIndex === -1) {
    return <ResultPage score={score} total={quiz.questions.length} onRestart={restart} onBack={onBack} />;
  }

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <button onClick={onBack} className="back-btn">
          <BackIcon className="icon-sm" /> 返回
        </button>
        <span className="quiz-progress-indicator">
          {currentIndex + 1} / {quiz.questions.length}
        </span>
      </header>

      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }} />
      </div>

      <main className="quiz-main">
        <QuizCard
          question={question}
          index={currentIndex}
          total={quiz.questions.length}
          onSelect={question.isMultiple ? handleMultiSelect : handleSingleSelect}
          selectedAnswers={selectedAnswers}
          showRationale={showRationale}
        />
      </main>

      <footer className="quiz-footer">
        <button onClick={goPrev} disabled={currentIndex === 0} className="brutalist-btn nav-btn prev-btn">上一题</button>
        <button onClick={goNext} className="brutalist-btn brutalist-btn-primary nav-btn next-btn">
          {isLastQuestion ? '查看结果' : '下一题 →'}
        </button>
      </footer>
    </div>
  );
}

// ==================== 主应用 ====================

function App() {
  const [currentView, setCurrentView] = React.useState('home');
  const [currentQuizId, setCurrentQuizId] = React.useState(null);

  const handleSelectQuiz = (quizId) => {
    setCurrentQuizId(quizId);
    setCurrentView('quiz');
  };

  const handleBackHome = () => {
    setCurrentView('home');
    setCurrentQuizId(null);
  };

  if (currentView === 'quiz' && currentQuizId) {
    return <QuizPage quizId={currentQuizId} onBack={handleBackHome} />;
  }

  return <HomePage onSelectQuiz={handleSelectQuiz} />;
}

// 渲染应用
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
