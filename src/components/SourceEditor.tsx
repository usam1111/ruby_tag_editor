import React from 'react';

interface SourceEditorProps {
  text: string;
  onChange: (text: string) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

const SourceEditor: React.FC<SourceEditorProps> = ({
  text,
  onChange,
  onMouseDown,
  onMouseUp,
  textareaRef
}) => {
  return (
    <div className="editor-area">
      <h2 className="area-title">ソース</h2>
      <textarea
        ref={textareaRef}
        className="source-textarea"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        placeholder="テキストを入力してください..."
      />
    </div>
  );
};

export default SourceEditor;
