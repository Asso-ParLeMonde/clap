import React from "react";

import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from "@material-ui/core/styles";

import { useTranslation } from "src/i18n/useTranslation";

const RedButton = withStyles((theme) => ({
  root: {
    color: theme.palette.error.contrastText,
    background: theme.palette.error.light,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
}))(Button);

interface ModalProps {
  open?: boolean;
  onClose?(): void;
  onConfirm?(): void;
  ariaLabelledBy: string;
  ariaDescribedBy: string;
  title?: string;
  children?: React.ReactNode | React.ReactNodeArray;
  cancelLabel?: string;
  confirmLabel?: string;
  fullWidth?: boolean;
  maxWidth?: false | "sm" | "xs" | "md" | "lg" | "xl";
  noCloseOutsideModal?: boolean;
  error?: boolean;
}

export const Modal: React.FunctionComponent<ModalProps> = ({
  open = true,
  onClose = () => {},
  onConfirm = null,
  ariaLabelledBy,
  ariaDescribedBy,
  title = "",
  children = <div />,
  cancelLabel = "",
  confirmLabel = "",
  fullWidth = false,
  noCloseOutsideModal = false,
  maxWidth = "sm",
  error = false,
}: ModalProps) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={noCloseOutsideModal ? () => {} : onClose} aria-labelledby={ariaLabelledBy} aria-describedby={ariaDescribedBy} fullWidth={fullWidth} maxWidth={maxWidth}>
      <DialogTitle id={ariaLabelledBy}>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          {cancelLabel || t("cancel")}
        </Button>
        {onConfirm !== null && error && (
          <RedButton onClick={onConfirm} variant="contained">
            {confirmLabel || t("yes")}
          </RedButton>
        )}
        {onConfirm !== null && !error && (
          <Button onClick={onConfirm} color="secondary" variant="contained">
            {confirmLabel || t("yes")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
