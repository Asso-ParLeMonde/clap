import { useSnackbar } from "notistack";
import React from "react";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import { Modal } from "src/components/Modal";
import { UserServiceContext } from "src/services/UserService";
import type { Language } from "types/models/language.type";

import allLanguages from "./iso_languages.json";

interface AddLanguageModalProps {
  open?: boolean;
  onClose?(): void;
  setLanguages?(f: (languages: Language[]) => Language[]): void;
}

export const AddLanguageModal: React.FunctionComponent<AddLanguageModalProps> = ({ open = false, onClose = () => {}, setLanguages = () => {} }: AddLanguageModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { axiosLoggedRequest } = React.useContext(UserServiceContext);
  const [selectedLanguageIndex, setSelectedLanguageIndex] = React.useState<number>(-1);

  const onSubmit = async () => {
    if (selectedLanguageIndex === -1) {
      return;
    }
    const newLanguage = {
      value: allLanguages[selectedLanguageIndex].code,
      label: allLanguages[selectedLanguageIndex].englishName,
    };
    const response = await axiosLoggedRequest({
      method: "POST",
      url: `/languages`,
      data: newLanguage,
    });
    if (response.error) {
      enqueueSnackbar("Une erreur inconnue est survenue...", {
        variant: "error",
      });
      setSelectedLanguageIndex(-1);
      onClose();
      return;
    }
    setLanguages((languages) => [...languages, newLanguage]);
    enqueueSnackbar("Langue ajoutée avec succès!", {
      variant: "success",
    });
    setSelectedLanguageIndex(-1);
    onClose();
  };

  const onSelectLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguageIndex(parseInt(event.target.value, 10));
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setSelectedLanguageIndex(-1);
        onClose();
      }}
      onConfirm={onSubmit}
      confirmLabel="Ajouter"
      cancelLabel="Annuler"
      title="Ajouter une langue"
      ariaLabelledBy="new-dialog-title"
      ariaDescribedBy="new-dialog-description"
      fullWidth
    >
      <div id="new-dialog-description">
        <FormControl fullWidth color="secondary">
          <InputLabel id="demo-simple-select-label">Choisir la langue</InputLabel>
          <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedLanguageIndex === -1 ? "" : selectedLanguageIndex} onChange={onSelectLanguage}>
            {allLanguages.map((l, index) => (
              <MenuItem value={index} key={l.code}>
                {l.englishName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </Modal>
  );
};
