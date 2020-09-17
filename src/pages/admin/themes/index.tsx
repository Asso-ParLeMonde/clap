import { useRouter } from "next/router";
import { ReactSortable } from "react-sortablejs";
import React from "react";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles, withStyles, Theme as MaterialTheme } from "@material-ui/core/styles";
import { Link } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import EditIcon from "@material-ui/icons/Edit";

import { AdminTile } from "src/components/admin/AdminTile";
import { UserServiceContext } from "src/services/UserService";
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
  const [defaultThemes, setDefaultThemes] = React.useState<Theme[]>([]);

  const getThemes = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: "GET",
      url: "/themes",
    });
    if (!response.error) {
      setDefaultThemes(response.data.filter((theme: Theme) => theme.isDefault));
    }
  }, [axiosLoggedRequest]);

  React.useEffect(() => {
    getThemes().catch();
  }, [getThemes]);
  // const [page, setPage] = React.useState<number>(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);

  // const handleChangePage = (_event: unknown, newPage: number) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  const goToPath = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(path);
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
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Id</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Nom</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Image</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <ReactSortable tag={TableBody} list={defaultThemes} setList={setDefaultThemes} animation={100} handle=".theme-index">
                  {defaultThemes.map((t) => (
                    <StyledTableRow key={t.id}>
                      <TableCell padding="none" className="theme-index">
                        <div style={{ display: "flex", alignItems: "center", cursor: "grab", marginLeft: "8px" }}>
                          <DragIndicatorIcon />
                          {t.id}
                        </div>
                      </TableCell>
                      <TableCell>{t.names.fr}</TableCell>
                      <TableCell style={{ padding: "0 16px" }} padding="none">
                        {t.image ? <img style={{ display: "table-cell" }} height="40" src={t.image.path} /> : "Aucune image"}
                      </TableCell>
                      <TableCell align="right" padding="none">
                        <IconButton aria-label="delete">
                          <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                  {/* <TablePagination rowsPerPageOptions={[5, 10, 25]} count={themes.length} rowsPerPage={rowsPerPage} page={page} onChangePage={handleChangePage} onChangeRowsPerPage={handleChangeRowsPerPage} /> */}
                </ReactSortable>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Cette liste est vide !{" "}
                  <Link href="/admin/themes/new" onClick={goToPath("/admin/themes/new")} color="secondary">
                    Ajouter un thème ?
                  </Link>
                </TableCell>
              </TableRow>
            )}
          </Table>
        </TableContainer>
      </AdminTile>
    </div>
  );
};

export default AdminThemes;
