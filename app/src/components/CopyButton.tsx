import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export function CopyButton({ text, className, ...rest }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <CopyToClipboard text={text} onCopy={handleCopy}>
      <button className={`btn btn-outline-secondary btn-xs ${className}`} {...rest} onClick={e => e.preventDefault()}>
        {copied ? <i className="bi bi-clipboard-check"></i> : <i className="bi bi-clipboard"></i>}
      </button>
    </CopyToClipboard>
  );
}
