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
import { useLanguages } from "src/services/useLanguages";

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
  const classes = useTableStyles();
  const { languages } = useLanguages();
  return (
    <div style={{ paddingBottom: "2rem" }}>
      <Typography variant="h1" color="primary">
        Langues
      </Typography>
      <NoSsr>
        <AdminTile
          title="Liste des langues"
          toolbarButton={
            <Button onClick={() => {}} style={{ flexShrink: 0 }} variant="contained" startIcon={<AddCircleIcon />}>
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
                  {languages.map((l) => (
                    <StyledTableRow key={l.value}>
                      <TableCell style={{ maxWidth: "2rem" }}>
                        <strong>{l.value.toUpperCase()}</strong>
                      </TableCell>
                      <TableCell>{l.label}</TableCell>
                      <TableCell align="right" padding="none" style={{ minWidth: "96px" }}>
                        <Tooltip title="Télécharger le fichier des traductions (.po)">
                          <IconButton aria-label="edit" onClick={() => {}}>
                            <GetAppIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Uploader le fichier des traductions">
                          <IconButton aria-label="edit" onClick={() => {}}>
                            <BackupIcon />
                          </IconButton>
                        </Tooltip>
                        {l.value !== "fr" && (
                          <Tooltip title="Supprimer">
                            <IconButton aria-label="delete" onClick={() => {}}>
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
                    <Link onClick={() => {}} style={{ cursor: "pointer" }} color="secondary">
                      Ajouter une langue ?
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </AdminTile>
      </NoSsr>
    </div>
  );
};

export default AdminLanguages;
