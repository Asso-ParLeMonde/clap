import { useSnackbar } from "notistack";
import React from "react";

// import "./sharedLink.css";
import { Fab, Tooltip } from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";

interface SharedLinkProps {
  link?: string;
}

export const SharedLink: React.FunctionComponent<SharedLinkProps> = ({ link = "" }: SharedLinkProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      enqueueSnackbar("Code copié dans le presse-papier!", {
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Une erreur inconnue est survenue...", {
        variant: "error",
      });
    }
  };

  return (
    <div className="sharedLink">
      <span>{link}</span>
      {document.queryCommandSupported("copy") && (
        <>
          <Tooltip title="Cliquez pour copier" aria-label="Cliquez pour copier">
            <Fab color="primary" aria-label="copy" style={{ height: "2rem", width: "2rem", minHeight: "unset" }} onClick={copyToClipboard}>
              <FileCopyIcon style={{ height: "0.8em", width: "0.8em" }} />
            </Fab>
          </Tooltip>
        </>
      )}
    </div>
  );
};
