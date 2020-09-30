import React from "react";

import DialogContentText from "@material-ui/core/DialogContentText";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";

import { Modal } from "src/components/Modal";

interface CreateQuestionModalProps {
  scenarioId: number | string | null;
  languageCode: string;
  open?: boolean;
  onClose?(): void;
}

export const CreateQuestionModal: React.FunctionComponent<CreateQuestionModalProps> = ({ scenarioId, languageCode, open = false, onClose = () => {} }: CreateQuestionModalProps) => {
  const [question, setQuestion] = React.useState<string>("");
  const [hasError, setHasError] = React.useState<boolean>(false);

  const onQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value.slice(0, 280));
    setHasError(false);
  };
  const onSubmit = () => {
    if (question.length === 0) {
      setHasError(true);
      return;
    }
    onClose();
  };

  if (scenarioId === null) {
    return null;
  }
  return (
    <Modal open={open} onClose={onClose} onConfirm={onSubmit} confirmLabel="Créer" cancelLabel="Annuler" title="Ajouter une question" ariaLabelledBy="create-dialog-title" ariaDescribedBy="create-dialog-description" fullWidth>
      <DialogContentText id="create-dialog-description">
        <TextField value={question} onChange={onQuestionChange} error={hasError} className={hasError ? "shake" : ""} label="Question" variant="outlined" fullWidth color="secondary" />
        <FormHelperText id="component-helper-text" style={{ marginLeft: "0.2rem", marginTop: "0.2rem" }}>
          {question.length}/280
        </FormHelperText>
      </DialogContentText>
    </Modal>
  );
};
