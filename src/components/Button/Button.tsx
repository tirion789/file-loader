import React from 'react';
import classNames from 'classnames';

import styles from './Button.module.scss';
import { ButtonProps } from './Button.props';

export const Button = ({ onClick, label, isDisabled }: ButtonProps) => {
  const buttonClassName = classNames(styles.button, isDisabled && styles.disabled);
  return (
    <button disabled={isDisabled} onClick={onClick} className={buttonClassName}>
      <span className={styles.label}>{label}</span>
    </button>
  );
};
