import { useSnackbar } from "notistack";
import { useQueryCache } from "react-query";
import React from "react";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import NoSsr from "@material-ui/core/NoSsr";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles, withStyles, Theme as MaterialTheme } from "@material-ui/core/styles";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import BackupIcon from "@material-ui/icons/Backup";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";

import { AdminTile } from "src/components/admin/AdminTile";
import { AddLanguageModal } from "src/components/admin/languages/AddLanguageModal";
import { DeleteLanguageModal } from "src/components/admin/languages/DeleteLanguageModal";
import { UploadLanguageModal } from "src/components/admin/languages/UploadLanguageModal";
import { UserServiceContext } from "src/services/UserService";
import { useLanguages } from "src/services/useLanguages";
import type { Language } from "types/models/language.type";

const useTableStyles = makeStyles((theme: MaterialTheme) =>
  createStyles({
    toolbar: {
      backgroundColor: theme.palette.secondary.main,
      color: "white",
      fontWeight: "bold",
      minHeight: "unset",
      padding: "8px 8px 8px 16px",
    },
    title: {
      flex: "1 1 100%",
    },
    button: {
      color: "white",
    },
  }),
);

const StyledTableRow = withStyles(() =>
  createStyles({
    root: {
      backgroundColor: "white",
      "&:nth-of-type(even)": {
        backgroundColor: "rgb(224 239 232)",
      },
      "&.sortable-ghost": {
        opacity: 0,
      },
    },
  }),
)(TableRow);

const AdminLanguages: React.FunctionComponent = () => {
  const queryCache = useQueryCache();
  const classes = useTableStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { axiosLoggedRequest } = React.useContext(UserServiceContext);
  const { languages } = useLanguages();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState<boolean>(false);
  const [uploadLanguageIndex, setUploadLanguageIndex] = React.useState<number>(-1);
  const [deleteLanguageIndex, setDeleteLanguageIndex] = React.useState<number>(-1);

  const setLanguages = React.useCallback(
    (f: (ll: Language[]) => Language[]) => {
      queryCache.setQueryData(["languages"], f(languages));
    },
    [languages, queryCache],
  );

  const onDownload = (l: Language) => async (event: React.MouseEvent) => {
    event.preventDefault();
    window.open(`/api/locales/${l.value}.po`);
  };

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <Typography variant="h1" color="primary">
        Langues
      </Typography>
      <NoSsr>
        <AdminTile
          title="Liste des langues"
          toolbarButton={
            <Button
              onClick={() => {
                setIsAddModalOpen(true);
              }}
              style={{ flexShrink: 0 }}
              variant="contained"
              startIcon={<AddCircleIcon />}
            >
              Ajouter une langue
            </Button>
          }
        >
          <Table aria-labelledby="themetabletitle" size="medium" aria-label="toutes les langues">
            {languages.length > 0 ? (
              <>
                <TableHead style={{ borderBottom: "1px solid white" }} className={classes.toolbar}>
                  <TableRow>
                    <TableCell style={{ color: "white", fontWeight: "bold", maxWidth: "2rem" }}>Code langue</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Langue</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {languages.map((l, index) => (
                    <StyledTableRow key={l.value}>
                      <TableCell style={{ maxWidth: "2rem" }}>
                        <strong>{l.value.toUpperCase()}</strong>
                      </TableCell>
                      <TableCell>{l.label}</TableCell>
                      <TableCell align="right" padding="none" style={{ minWidth: "96px" }}>
                        <Tooltip title="Télécharger le fichier des traductions (.po)">
                          <IconButton aria-label="edit" onClick={onDownload(l)}>
                            <GetAppIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Uploader le fichier des traductions">
                          <IconButton
                            aria-label="edit"
                            onClick={() => {
                              setUploadLanguageIndex(index);
                            }}
                          >
                            <BackupIcon />
                          </IconButton>
                        </Tooltip>
                        {l.value !== "fr" && (
                          <Tooltip title="Supprimer">
                            <IconButton
                              aria-label="delete"
                              onClick={() => {
                                setDeleteLanguageIndex(index);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Cette liste est vide !{" "}
                    <Link
                      onClick={() => {
                        setIsAddModalOpen(true);
                      }}
                      style={{ cursor: "pointer" }}
                      color="secondary"
                    >
                      Ajouter une langue ?
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </AdminTile>
        <AddLanguageModal
          open={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
          }}
          setLanguages={setLanguages}
        />
        <UploadLanguageModal
          language={uploadLanguageIndex === -1 ? null : languages[uploadLanguageIndex] || null}
          onClose={() => {
            setUploadLanguageIndex(-1);
          }}
        />
        <DeleteLanguageModal
          language={deleteLanguageIndex === -1 ? null : languages[deleteLanguageIndex] || null}
          onClose={() => {
            setDeleteLanguageIndex(-1);
          }}
          setLanguages={setLanguages}
        />
      </NoSsr>
    </div>
  );
};

export default AdminLanguages;
