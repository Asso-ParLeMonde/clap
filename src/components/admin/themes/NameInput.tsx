import React from "react";

import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Close from "@material-ui/icons/Close";

import type { Language } from "types/models/language.type";

const useStyles = makeStyles(() => ({
  containerNames: {
    display: "flex",
    marginBottom: 16,
    alignItems: "center",
  },
  textFieldLanguage: {
    marginRight: "8px",
    fontWeight: "bold",
  },
  textFieldNames: {
    margin: "0px 0px 0px 4px",
  },
}));

interface NameInputProps {
  value?: string;
  language?: Language;
  canDelete?: boolean;
  onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
  onDelete?(): void;
}

export const NameInput: React.FunctionComponent<NameInputProps> = ({ value = "", language = { label: "Français", value: "fr" }, canDelete = false, onChange = () => {}, onDelete = () => {} }: NameInputProps) => {
  const classes = useStyles();

  return (
    <div className={classes.containerNames}>
      <div className={classes.textFieldLanguage}>{language.label}</div>

      <TextField color="secondary" id={language.value} type="text" value={value} onChange={onChange} fullWidth className={classes.textFieldNames} />

      {canDelete && (
        <Button style={{ borderRadius: "100px", minWidth: "32px", marginLeft: "8px" }} onClick={onDelete}>
          <Close />
        </Button>
      )}
    </div>
  );
};
