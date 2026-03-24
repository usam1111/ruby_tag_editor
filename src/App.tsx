import { useState, useRef } from 'react';
import './App.css';
import SourceEditor from './components/SourceEditor';
import Previewer from './components/Previewer';
import ButtonGroup from './components/ButtonGroup';

function App() {
  const defaultText = "ここに<ruby=もじ>文字</ruby>をいれてください";
  const [text, setText] = useState(defaultText);
  const [history, setHistory] = useState<string[]>([defaultText]);
  const [isInitialText, setIsInitialText] = useState(true);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<number | null>(null);

  const pushHistory = (newText: string) => {
    setHistory(prev => {
      const last = prev[prev.length - 1];
      if (last === newText) return prev;
      const next = [...prev, newText];
      if (next.length > 6) return next.slice(1);
      return next;
    });
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (isInitialText) setIsInitialText(false);
    
    // 履歴保存のデバウンス処理（入力が1秒間止まったら保存）
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      pushHistory(newText);
    }, 1000);
  };

  const handleMouseDown = () => {
    if (isInitialText) {
      setText("");
      pushHistory("");
      setIsInitialText(false);
    }
  };

  const handleMouseUp = () => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    
    if (start !== end) {
      const before = text.substring(0, start);
      const selected = text.substring(start, end);
      const after = text.substring(end);
      
      const newText = `${before}<ruby=>${selected}</ruby>${after}`;
      setText(newText);
      pushHistory(newText);
      setIsInitialText(false);
      
      const newCursorPos = start + 6; // "<ruby=" の文字数分進める
      
      // State更新後にカーソル位置を設定するため非同期で実行
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // 現在の状態を削除
      const previousText = newHistory[newHistory.length - 1];
      setText(previousText);
      setHistory(newHistory);
    }
  };

  const handleClear = () => {
    setText("");
    pushHistory("");
    if (isInitialText) setIsInitialText(false);
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-title">ルビタグ編集ツール</h1>
        <p className="app-desc">漢字部分を選択するとルビタグが差し込まれます。</p>
      </div>
      <div className="main-content">
        <SourceEditor
          text={text}
          onChange={handleTextChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          textareaRef={textareaRef}
        />
        <Previewer text={text} />
      </div>
      <ButtonGroup
        onCopy={handleCopy}
        onUndo={handleUndo}
        onClear={handleClear}
        canUndo={history.length > 1}
      />
    </div>
  );
}

export default App;
