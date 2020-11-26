import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useQueryCache } from "react-query";
import React from "react";

import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import NoSsr from "@material-ui/core/NoSsr";
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
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import HelpIcon from "@material-ui/icons/Help";

import { Modal } from "src/components/Modal";
import { AdminTile } from "src/components/admin/AdminTile";
import { UserServiceContext } from "src/services/UserService";
import { useLanguages } from "src/services/useLanguages";
import { useScenarios } from "src/services/useScenarios";
import { useThemeNames } from "src/services/useThemes";
import { GroupedScenario, groupScenarios } from "src/util/groupScenarios";

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
    themeRow: {
      padding: "4px 16px",
      backgroundColor: theme.palette.secondary.dark,
      borderBottom: "none",
      color: "white",
    },
    normalRow: {
      backgroundColor: "white",
    },
    evenRow: {
      backgroundColor: "rgb(224 239 232)",
    },
  }),
);

const AdminInspiration: React.FunctionComponent = () => {
  const classes = useTableStyles();
  const router = useRouter();
  const queryCache = useQueryCache();
  const { enqueueSnackbar } = useSnackbar();
  const { themeNames } = useThemeNames();
  const { axiosLoggedRequest } = React.useContext(UserServiceContext);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const videosData = [];

  const goToPath = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(path);
  };

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <Typography variant="h1" color="primary">
        Inspiration
      </Typography>
      <NoSsr>
        <AdminTile
          title="Liste des vidéos"
          toolbarButton={
            Object.keys(themeNames).length > 0 ? (
              <Button component="a" href="/admin/inspiration/new" onClick={goToPath("/admin/inspiration/new")} style={{ flexShrink: 0 }} variant="contained" startIcon={<AddCircleIcon />}>
                Ajouter une vidéo
              </Button>
            ) : null
          }
        >
          <TableContainer>
            <Table aria-labelledby="themetabletitle" size="medium" aria-label="tout les scénarios">
              {videosData.length > 0 ? (
                <>
                  <TableHead style={{ borderBottom: "none" }} className={classes.toolbar}>
                    <TableRow>
                      <TableCell style={{ color: "white", fontWeight: "bold", border: "none" }}>#</TableCell>
                      <TableCell style={{ color: "white", fontWeight: "bold", border: "none" }}>Nom</TableCell>
                      <TableCell style={{ color: "white", fontWeight: "bold", border: "none" }} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody></TableBody>
                </>
              ) : Object.keys(themeNames).length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      {"Vous n'avez pas de thème ! "}
                      <Link href="/admin/themes/new" onClick={goToPath("/admin/themes/new")} color="secondary">
                        Ajouter un thème ?
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      {"Vous n'avez pas de vidéos ! "}
                      <Link href="/admin/inspiration/new" onClick={goToPath("/admin/inspiration/new")} color="secondary">
                        Ajouter une vidéo ?
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </AdminTile>
      </NoSsr>
    </div>
  );
};

export default AdminInspiration;
