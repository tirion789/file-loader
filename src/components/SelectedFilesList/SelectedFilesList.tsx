import React from 'react';

import { Button } from '../Button';
import styles from './SelectedFilesList.module.scss';
import { SelectedFilesListProps } from './SelectedFilesList.props';
import documentIcon from '../../assets/documentIcon.svg';

export const SelectedFilesList = ({
  selectedFiles,
  handleClickRemoveFile,
  isDisabled,
}: SelectedFilesListProps) => {
  return (
    <>
      {selectedFiles.length ? <h1 className={styles.title}>Selected files list</h1> : ''}
      <ul className={styles.files_list}>
        {selectedFiles?.map((file, index) => (
          <li
            className={styles.file}
            key={`${file.name}_${file.lastModified}_${file.size}_${index}`}
          >
            <Button
              isDisabled={isDisabled}
              onClick={() => handleClickRemoveFile(file.name)}
              label="Delete file"
            />
            <img
              className={styles.files_image}
              src={file.type.startsWith('image') ? URL.createObjectURL(file) : documentIcon}
              alt={file.name}
            />
            <span className={styles.label}>{file.name}</span>
          </li>
        ))}
      </ul>
    </>
  );
};
