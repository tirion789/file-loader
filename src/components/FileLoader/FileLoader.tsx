import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './FileLoader.module.scss';
import { useFileUpload } from '../../hooks/useFileUpload';
import { Button } from '../Button';
import { SelectedFilesList } from '../SelectedFilesList/SelectedFilesList';

export const FileLoader = () => {
  const [token, setToken] = useState('');
  const {
    handeFileChange,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleClickRemoveFile,
    handleUploadFile,
    isDrag,
    selectedFiles,
    processingFileName,
  } = useFileUpload(token);

  const AUTH_URL = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${process.env.REACT_APP_CLIENT_ID}`;

  const labelFileLoaderClassNames = classNames(
    styles.dropzone,
    Boolean(processingFileName) && styles.dropzone_disabled,
    isDrag && styles.dropzone_dragover
  );

  const handleAuth = () => {
    window.location.href = AUTH_URL;
  };

  const handleToken = () => {
    const urlParams = new URLSearchParams(window.location.href.split('#')[1]);
    const code = urlParams.get('access_token');
    if (code) {
      setToken(code);
    }
  };

  useEffect(() => {
    if (window.location.hash) {
      handleToken();
    }
  }, []);

  if (!token) {
    return (
      <div className={styles.auth_container}>
        <Button label="Авторизоваться на Яндекс.Диске" onClick={handleAuth} />
      </div>
    );
  }

  return (
    <div className={styles.file_loader}>
      <div className={styles.dropzone_container}>
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={labelFileLoaderClassNames}
          htmlFor="fileUploader"
        >
          <span className={styles.dropzone_text}>Перетащите ваши файлы сюда, либо кликните</span>
          <input
            disabled={Boolean(processingFileName)}
            id="fileUploader"
            className={styles.hidden}
            type="file"
            onChange={handeFileChange}
            onClick={(event) => event.stopPropagation()}
            multiple
          />
        </label>
      </div>
      <Button
        onClick={handleUploadFile}
        label="Загрузить файлы на Яндекс.Диск"
        isDisabled={Boolean(processingFileName)}
      />
      {processingFileName && (
        <span className={styles.loading_label}>Загружается файл: {processingFileName}</span>
      )}
      <SelectedFilesList
        isDisabled={Boolean(processingFileName)}
        selectedFiles={selectedFiles}
        handleClickRemoveFile={handleClickRemoveFile}
      />
    </div>
  );
};
