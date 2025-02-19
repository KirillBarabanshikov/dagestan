import clsx from 'clsx';
import React, { FC, RefObject, useState } from 'react';

import { keyboard, keyboardNum } from './data/data.ts';
import styles from './Keyboard.module.scss';

interface IKeyboardProps {
    inputRef: RefObject<HTMLInputElement>;
    onEnter: () => void;
    variant?: 'default' | 'num';
    className?: string;
    isLoading?: boolean;
}

export const Keyboard: FC<IKeyboardProps> = ({ inputRef, onEnter, className, variant = 'default', isLoading }) => {
    const [isCaps, setIsCaps] = useState(false);
    const [currentLayout, setCurrentLayout] = useState<'rus' | 'en' | 'num'>('en');

    function onChange(e: React.MouseEvent<HTMLDivElement>) {
        const target = e.target as HTMLElement;
        const { code, key } = target.dataset;
        const { current: input } = inputRef;

        if (!input || !code || !key) return;

        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;

        switch (code) {
            case 'Backspace':
                if (start != end) {
                    input.value = input.value.slice(0, start) + input.value.slice(end);
                    input.setSelectionRange(start, start);
                } else {
                    input.value = input.value.slice(0, start && start - 1) + input.value.slice(end);
                    input.setSelectionRange(start && start - 1, end && end - 1);
                }
                break;

            case 'Enter':
                return onEnter();

            case 'KeyLang':
                return setCurrentLayout((prevState) => (prevState === 'en' ? 'rus' : 'en'));

            case 'KeyNum':
                return setCurrentLayout('num');

            case 'CapsLock':
                setIsCaps((prev) => !prev);
                break;

            default:
                if (start != end) {
                    input.value = input.value.slice(0, start) + key + input.value.slice(end);
                    input.setSelectionRange(start + 1, start + 1);
                } else {
                    input.value = input.value.slice(0, start) + key + input.value.slice(end);
                    input.setSelectionRange(start + 1, end + 1);
                }
        }
    }

    return (
        <div
            onClick={(e) => onChange(e)}
            onMouseDown={(e) => e.preventDefault()}
            className={clsx(styles.keyboard, className)}
        >
            {variant === 'default'
                ? keyboard[currentLayout].map((row, i) => {
                      return (
                          <div key={i} className={styles.row}>
                              {row.map(({ code, key }) => (
                                  <button
                                      key={code}
                                      data-code={code}
                                      data-key={isCaps ? key.toUpperCase() : key}
                                      className={clsx(styles.key, isCaps && styles.isCaps, styles[code])}
                                      disabled={isLoading}
                                  >
                                      {key}
                                  </button>
                              ))}
                          </div>
                      );
                  })
                : keyboardNum.num.map((row, i) => {
                      return (
                          <div key={i} className={styles.row}>
                              {row.map(({ code, key }) => (
                                  <button
                                      key={code}
                                      data-code={code}
                                      data-key={isCaps ? key.toUpperCase() : key}
                                      className={clsx(styles.key, isCaps && styles.isCaps, styles[code], styles.num)}
                                  >
                                      {key}
                                  </button>
                              ))}
                          </div>
                      );
                  })}
        </div>
    );
};
