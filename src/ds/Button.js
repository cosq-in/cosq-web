import React, { useState } from 'react';

// Presses into its hard shadow on mouse down. Renders an <a> when given href.
const Button = ({ variant = 'primary', href, children, style, ...rest }) => {
  const [pressed, setPressed] = useState(false);
  const alt = variant === 'alt';
  const s = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 54,
    padding: '0 26px',
    border: '4px solid var(--cosq-purple)',
    borderRadius: 4,
    background: alt ? '#fff' : 'var(--cosq-pink)',
    color: alt ? 'var(--cosq-pink)' : '#fff',
    font: '400 20px var(--font-display)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    boxShadow: pressed ? '0 0 0 var(--cosq-purple)' : 'var(--shadow-hard)',
    transform: pressed ? 'translate(6px,6px)' : 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'transform .08s,box-shadow .08s',
    marginRight: 6,
    marginBottom: 6,
    ...style,
  };
  const props = {
    style: s,
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    ...rest,
  };
  return href
    ? <a href={href} {...props}>{children}</a>
    : <button type="button" {...props}>{children}</button>;
};

export default Button;
