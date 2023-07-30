export interface SelectedFilesListProps {
  selectedFiles: File[];
  handleClickRemoveFile: (name: string) => void;
  isDisabled?: boolean;
}
