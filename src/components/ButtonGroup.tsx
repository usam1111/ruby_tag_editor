import React from 'react';

interface ButtonGroupProps {
  onCopy: () => void;
  onUndo: () => void;
  onClear: () => void;
  canUndo: boolean;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  onCopy,
  onUndo,
  onClear,
  canUndo
}) => {
  return (
    <div className="button-area">
      <button onClick={onCopy}>ソースをコピー</button>
      <button 
        className="btn-secondary" 
        onClick={onUndo} 
        disabled={!canUndo}
      >
        ひとつ戻る
      </button>
      <button 
        className="btn-danger" 
        onClick={onClear}
      >
        クリア
      </button>
    </div>
  );
};

export default ButtonGroup;
