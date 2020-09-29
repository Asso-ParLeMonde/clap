import { useRouter } from "next/router";
import { ReactSortable } from "react-sortablejs";
import React from "react";

import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles, withStyles, Theme as MaterialTheme } from "@material-ui/core/styles";
import { Link } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import EditIcon from "@material-ui/icons/Edit";

import { Modal } from "src/components/Modal";
import { AdminTile } from "src/components/admin/AdminTile";
import { UserServiceContext } from "src/services/UserService";
import { useLanguages } from "src/services/useLanguages";
import { useThemes } from "src/services/useThemes";
import type { Theme } from "types/models/theme.type";

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

const AdminThemes: React.FunctionComponent = () => {
  const classes = useTableStyles();
  const router = useRouter();
  const { axiosLoggedRequest } = React.useContext(UserServiceContext);
  const { languages } = useLanguages();
  const { themes: defaultThemes, setThemes: setDefaultThemes } = useThemes({ isDefault: true });
  const { themes: userThemes, setThemes: setUserThemes } = useThemes({ isDefault: false });
  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("fr");

  // const [page, setPage] = React.useState<number>(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);

  // const handleChangePage = (_event: unknown, newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };
  const validateTheme = (themeId: number | string, themeIndex: number) => async () => {
    const response = await axiosLoggedRequest({
      method: "PUT",
      url: `/themes/${themeId}`,
      data: {
        isDefault: true,
        order: defaultThemes.length + userThemes.length + 1,
      },
    });
    if (response.error) {
      return;
    }
    const newUserThemes = [...userThemes];
    const theme = newUserThemes.splice(themeIndex, 1)[0];
    setUserThemes(newUserThemes);
    setDefaultThemes([...defaultThemes, theme]);
  };

  const setThemesOrder = async (themes: Theme[]) => {
    if (themes.map((t) => t.id).join(",") === defaultThemes.map((t) => t.id).join(",")) {
      return;
    }
    setDefaultThemes(themes);
    const order = themes.map((t) => t.id);
    try {
      const response = await axiosLoggedRequest({
        method: "PUT",
        url: "/themes/update-order",
        data: {
          order,
        },
      });
      if (response.error) {
        console.error(response.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const goToPath = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(path);
  };

  const onDeleteTheme = async () => {
    if (deleteIndex === null) {
      return;
    }
    const response = await axiosLoggedRequest({
      method: "DELETE",
      url: `/themes/${defaultThemes[deleteIndex].id}`,
    });
    if (response.error) {
      console.error(response.error);
    }
    const themes = [...defaultThemes];
    themes.splice(deleteIndex, 1);
    setDefaultThemes(themes);
    setDeleteIndex(null);
  };

  const onLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <Typography variant="h1" color="primary">
        Thèmes
      </Typography>
      <AdminTile
        title="Liste des thèmes"
        toolbarButton={
          <Button component="a" href="/admin/themes/new" onClick={goToPath("/admin/themes/new")} style={{ flexShrink: 0 }} variant="contained" startIcon={<AddCircleIcon />}>
            Ajouter un thème
          </Button>
        }
      >
        <TableContainer>
          <Table aria-labelledby="themetabletitle" size="medium" aria-label="tout les thèmes">
            {defaultThemes.length > 0 ? (
              <>
                <TableHead style={{ borderBottom: "1px solid white" }} className={classes.toolbar}>
                  <TableRow>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Ordre</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>
                      Nom{" "}
                      <span style={{ marginLeft: "2rem" }}>
                        (
                        <Select value={selectedLanguage} color="secondary" style={{ color: "white" }} onChange={onLanguageChange}>
                          {languages.map((l) => (
                            <MenuItem key={l.value} value={l.value}>
                              {l.label.toLowerCase()}
                            </MenuItem>
                          ))}
                        </Select>
                      </span>
                      )
                    </TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Image</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <ReactSortable tag={"tbody"} list={defaultThemes} setList={setThemesOrder} animation={100} handle=".theme-index">
                  {defaultThemes.map((t, index) => (
                    <StyledTableRow key={t.id}>
                      <TableCell padding="none" className="theme-index">
                        <div style={{ display: "flex", alignItems: "center", cursor: "grab", marginLeft: "8px" }}>
                          <DragIndicatorIcon />
                          {index}
                        </div>
                      </TableCell>
                      <TableCell style={{ color: t.names[selectedLanguage] ? "inherit" : "grey" }}>{t.names[selectedLanguage] || `${t.names.fr} (non traduit)`}</TableCell>
                      <TableCell style={{ padding: "0 16px" }} padding="none">
                        {t.image ? <img style={{ display: "table-cell" }} height="40" src={t.image.path} /> : "Aucune image"}
                      </TableCell>
                      <TableCell align="right" padding="none">
                        <Tooltip title="Modifier">
                          <IconButton aria-label="edit" onClick={goToPath(`/admin/themes/edit/${t.id}`)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            aria-label="delete"
                            onClick={() => {
                              setDeleteIndex(index);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                  {/* <TablePagination rowsPerPageOptions={[5, 10, 25]} count={themes.length} rowsPerPage={rowsPerPage} page={page} onChangePage={handleChangePage} onChangeRowsPerPage={handleChangeRowsPerPage} /> */}
                </ReactSortable>
              </>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Cette liste est vide !{" "}
                    <Link href="/admin/themes/new" onClick={goToPath("/admin/themes/new")} color="secondary">
                      Ajouter un thème ?
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </AdminTile>
      <Modal
        open={deleteIndex !== null}
        onClose={() => {
          setDeleteIndex(null);
        }}
        onConfirm={onDeleteTheme}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        title="Supprimer le thème ?"
        error={true}
        ariaLabelledBy="delete-dialog-title"
        ariaDescribedBy="delete-dialog-description"
        fullWidth
      >
        <DialogContentText id="delete-dialog-description">
          Voulez-vous vraiment supprimer le thème <strong>{deleteIndex !== null && defaultThemes[deleteIndex].names.fr}</strong> ?
        </DialogContentText>
      </Modal>

      {userThemes.length > 0 && (
        <AdminTile title="Thèmes des utilisateurs" style={{ marginTop: "2rem" }}>
          <TableContainer>
            <Table aria-labelledby="themetabletitle" size="medium" aria-label="tout les thèmes">
              <TableHead style={{ borderBottom: "1px solid white" }} className={classes.toolbar}>
                <TableRow>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>Nom</TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userThemes.map((t, index) => (
                  <StyledTableRow key={t.id}>
                    <TableCell>{t.names.fr}</TableCell>
                    <TableCell align="right" padding="none">
                      <Tooltip title="Valider le thème">
                        <IconButton aria-label="valider" onClick={validateTheme(t.id, index)}>
                          <CheckIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AdminTile>
      )}
    </div>
  );
};

export default AdminThemes;
