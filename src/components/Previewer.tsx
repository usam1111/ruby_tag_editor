import React from 'react';

interface PreviewerProps {
  text: string;
}

const Previewer: React.FC<PreviewerProps> = ({ text }) => {
  const renderContent = () => {
    // 1. 改行で分割
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      // 2. ルビタグを正規表現でパース
      const rubyRegex = /<ruby=([^>]+)>([^<]+)<\/ruby>/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = rubyRegex.exec(line)) !== null) {
        // ルビタグより前のテキスト
        if (match.index > lastIndex) {
          parts.push(<span key={`text-${lastIndex}`}>{line.substring(lastIndex, match.index)}</span>);
        }
        
        // ルビ本体要素
        const rubyText = match[1];
        const baseText = match[2];
        parts.push(
          <ruby key={`ruby-${match.index}`}>
            {baseText}
            <rt>{rubyText}</rt>
          </ruby>
        );
        
        lastIndex = rubyRegex.lastIndex;
      }
      
      // 最後のルビタグ以降のテキスト
      if (lastIndex < line.length) {
        parts.push(<span key={`text-${lastIndex}`}>{line.substring(lastIndex)}</span>);
      }
      
      // 行要素と改行（<br/>）を結合して返す
      return (
        <React.Fragment key={`line-${lineIndex}`}>
          {parts.length > 0 ? parts : line}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="preview-area">
      <h2 className="area-title">プレビュー</h2>
      <div className="preview-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Previewer;
