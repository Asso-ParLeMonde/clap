import { useRouter } from "next/router";
import React from "react";

import Button from "@material-ui/core/Button";
// import DialogContentText from "@material-ui/core/DialogContentText";
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
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import HelpIcon from "@material-ui/icons/Help";

// import { Modal } from "src/components/Modal";
import { AdminTile } from "src/components/admin/AdminTile";
import { UserServiceContext } from "src/services/UserService";
import { useLanguages } from "src/services/useLanguages";
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

const HtmlTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    border: "1px solid grey",
  },
}))(Tooltip);

interface ScenarioData {
  id: number;
  startIndex: number;
  // theme: string;
  scenarios: GroupedScenario[];
}

const AdminThemes: React.FunctionComponent = () => {
  const classes = useTableStyles();
  const router = useRouter();
  const { languages } = useLanguages();
  const { axiosLoggedRequest } = React.useContext(UserServiceContext);
  const { themeNames } = useThemeNames(axiosLoggedRequest);
  const [scenarios, setScenarios] = React.useState<GroupedScenario[]>([]);
  // const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("fr");

  // get scenarios
  const getScenarios = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: "GET",
      url: `/scenarios?isDefault=true`,
    });
    if (response.error) {
      setScenarios([]);
      return;
    }
    setScenarios(groupScenarios(response.data));
  }, [axiosLoggedRequest]);
  React.useEffect(() => {
    getScenarios().catch();
  }, [getScenarios]);

  // get scenario per themes
  const scenariosData: ScenarioData[] = React.useMemo(() => {
    const data = Object.keys(themeNames).map((id) => ({
      id: parseInt(id, 10),
      startIndex: 0,
      scenarios: scenarios.filter((scenario) => scenario.themeId === parseInt(id, 10)),
    }));
    for (let i = 1, n = data.length; i < n; i++) {
      data[i].startIndex = data[i - 1].startIndex + data[i - 1].scenarios.length;
    }
    return data;
  }, [themeNames, scenarios]);

  const goToPath = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(path);
  };

  const onLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

  const selectLanguage = (
    <span style={{ marginLeft: "2rem" }}>
      (
      <Select value={selectedLanguage} color="secondary" style={{ color: "white" }} onChange={onLanguageChange}>
        {languages.map((l) => (
          <MenuItem key={l.value} value={l.value}>
            {l.label.toLowerCase()}
          </MenuItem>
        ))}
      </Select>
      )
    </span>
  );

  const helpIcon = (
    <HtmlTooltip
      title={
        <Typography color="inherit" variant="caption">
          {"Un scénario non traduit ne sera pas affiché. Il n'est donc pas nécessaire de le traduire si le scénario n'est que pour une langue spécifique."}
        </Typography>
      }
      style={{ cursor: "pointer" }}
    >
      <HelpIcon fontSize="inherit" />
    </HtmlTooltip>
  );

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <Typography variant="h1" color="primary">
        Scénarios
      </Typography>
      <AdminTile
        title="Liste des scénarios par thème"
        selectLanguage={selectLanguage}
        toolbarButton={
          scenariosData.length > 0 ? (
            <Button component="a" href="/admin/scenarios/new" onClick={goToPath("/admin/scenarios/new")} style={{ flexShrink: 0 }} variant="contained" startIcon={<AddCircleIcon />}>
              Ajouter un scénarios
            </Button>
          ) : null
        }
      >
        <TableContainer>
          <Table aria-labelledby="themetabletitle" size="medium" aria-label="tout les scénarios">
            {scenariosData.length > 0 ? (
              <>
                <TableHead style={{ borderBottom: "none" }} className={classes.toolbar}>
                  <TableRow>
                    <TableCell style={{ color: "white", fontWeight: "bold", border: "none" }}>#</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold", border: "none" }}>Nom</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold", border: "none" }}>Description</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold", border: "none" }} align="right">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scenariosData.map((theme) => (
                    <>
                      <TableRow key={theme.id}>
                        <TableCell colSpan={4} className={classes.themeRow}>
                          Thème : {themeNames[theme.id] ? themeNames[theme.id][selectedLanguage] || themeNames[theme.id].fr || "" : `numéro ${theme.id}`}
                        </TableCell>
                      </TableRow>
                      {theme.scenarios.length > 0 ? (
                        theme.scenarios.map((s, index) => (
                          <TableRow key={s.id} className={index % 2 === 0 ? classes.normalRow : classes.evenRow}>
                            <TableCell style={{ width: "3rem" }}>{index + theme.startIndex + 1}</TableCell>
                            <TableCell style={{ color: s.names[selectedLanguage] ? "inherit" : "grey" }}>
                              {s.names[selectedLanguage] || `${s.names.default} (non traduit)`}
                              {!s.names[selectedLanguage] && helpIcon}
                            </TableCell>
                            <TableCell style={{ color: s.descriptions[selectedLanguage] ? "inherit" : "grey" }}>{s.descriptions[selectedLanguage] || s.descriptions.default}</TableCell>
                            <TableCell align="right" padding="none">
                              <Tooltip title="Modifier">
                                <IconButton aria-label="edit" onClick={goToPath(`/admin/scenarios/edit/${s.id}`)}>
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Supprimer">
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => {
                                    // setDeleteIndex(index);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow className={classes.normalRow}>
                          <TableCell colSpan={4} align="center" style={{ padding: "4px" }}>
                            {`Ce thème n'a pas de scénario ! `}
                            <Link href="/admin/scenarios/new" onClick={goToPath("/admin/scenarios/new")}>
                              Ajouter un scénario ?
                            </Link>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </>
            ) : (
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
            )}
          </Table>
        </TableContainer>
      </AdminTile>
    </div>
  );
};

export default AdminThemes;
