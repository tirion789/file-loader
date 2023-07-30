import axios from 'axios';
import { useState, ChangeEvent, DragEvent } from 'react';

const getUniqFiles = (newFiles: File[], files: File[]) => {
  if (!newFiles.length) {
    return files;
  }
  if (!files.length && newFiles.length) {
    return newFiles;
  }
  const filteredFiles = newFiles.filter((file) => !files.some((item) => file.name === item.name));

  return [...files, ...filteredFiles];
};

export const useFileUpload = (token: string) => {
  const [isDrag, setIsDrag] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processingFileName, setProcessingFileName] = useState('');

  const handleFileSelect = (files: FileList) => {
    if (files) {
      const filesArray = Array.from(files);
      setSelectedFiles(getUniqFiles(filesArray, selectedFiles));
    }
  };

  const handeFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFileSelect(event.target.files);
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    handleFileSelect(event.dataTransfer.files);
    setIsDrag(false);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDrag(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDrag(false);
  };

  const handleClickRemoveFile = (name: string) => {
    setSelectedFiles(selectedFiles.filter((file) => file.name !== name));
  };

  const handleUploadFile = async () => {
    if (selectedFiles.length > 0 && selectedFiles.length <= 100) {
      for await (const file of selectedFiles) {
        try {
          const formData = new FormData();
          formData.append('file', file);

          setProcessingFileName(file.name);

          const response = await axios.get(
            `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${encodeURIComponent(
              file.name
            )}`,
            {
              headers: {
                Authorization: `OAuth ${token}`,
              },
            }
          );

          const uploadUrl = response.data.href;

          const result = await axios.put(uploadUrl, formData, {
            headers: {
              'Content-Type': file.type,
            },
          });
          if (result.status === 201 || result.status === 202) {
            const indexToRemove = selectedFiles.indexOf(file);
            setSelectedFiles(selectedFiles.slice(indexToRemove + 1, selectedFiles.length));
          }
        } catch (error) {
          alert(`кажется файл ${file.name} уже есть на яндекс диске!`);
        }
      }
      setProcessingFileName('');
    } else {
      alert('Кажется вы выбрали слишком мало или слишком много файлов');
    }
  };

  return {
    handeFileChange,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileSelect,
    handleUploadFile,
    handleClickRemoveFile,
    setSelectedFiles,
    setProcessingFileName,
    processingFileName,
    isDrag,
    selectedFiles,
  };
};
