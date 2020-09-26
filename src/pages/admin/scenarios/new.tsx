import { useRouter } from "next/router";
import React from "react";

import Backdrop from "@material-ui/core/Backdrop";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "@material-ui/core/Link";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles, Theme as MaterialTheme } from "@material-ui/core/styles";
import Close from "@material-ui/icons/Close";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { Modal } from "src/components/Modal";
import { AdminTile } from "src/components/admin/AdminTile";
// import { UserServiceContext } from "src/services/UserService";
import { useLanguages } from "src/services/useLanguages";
// import { useThemeNames } from "src/services/useThemes";
import { GroupedScenario } from "src/util/groupScenarios";
import type { Language } from "types/models/language.type";

// import type { Theme } from "types/models/theme.type";

const useStyles = makeStyles((theme: MaterialTheme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  }),
);

const AdminNewScenario: React.FunctionComponent = () => {
  const classes = useStyles();
  const router = useRouter();
  const { languages } = useLanguages();
  const languagesMap = React.useMemo(() => languages.reduce((acc: { [key: string]: number }, language: Language, index: number) => ({ ...acc, [language.value]: index }), {}), [languages]);
  // const { axiosLoggedRequest } = React.useContext(UserServiceContext);
  // const { themeNames } = useThemeNames(axiosLoggedRequest);
  const [scenario, setScenario] = React.useState<GroupedScenario>({
    id: 0,
    themeId: 0,
    names: {},
    descriptions: {},
    isDefault: true,
  });
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [languageToAdd, setLanguageToAdd] = React.useState<number>(0);
  const [selectedLanguages, setSelectedLanguages] = React.useState<number[]>([]);
  const [loading /* setLoading */] = React.useState<boolean>(false);
  const availableLanguages = languages.filter((_l, index) => !selectedLanguages.includes(index));

  const goToPath = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(path);
  };

  React.useEffect(() => {
    if (languagesMap.fr !== undefined && selectedLanguages.length === 0) {
      setSelectedLanguages([languagesMap.fr]);
    }
  }, [selectedLanguages, languagesMap]);
  const onAddLanguage = () => {
    setShowModal(false);
    setSelectedLanguages([...selectedLanguages, languagesMap[availableLanguages[languageToAdd].value]]);
    setLanguageToAdd(0);
  };
  const onDeleteLanguage = (deleteIndex: number) => () => {
    const language = languages[selectedLanguages[deleteIndex]];
    const s = [...selectedLanguages];
    s.splice(deleteIndex, 1);
    setSelectedLanguages(s);
    const newScenario = { ...scenario };
    delete newScenario.names[language.value];
    delete newScenario.descriptions[language.value];
    setScenario(newScenario);
  };

  const onNameInputChange = (languageValue: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newScenario = { ...scenario };
    newScenario.names[languageValue] = event.target.value;
    setScenario(newScenario);
  };
  const onDescInputChange = (languageValue: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newScenario = { ...scenario };
    newScenario.descriptions[languageValue] = event.target.value;
    setScenario(newScenario);
  };

  const onSubmit = async () => {
    // TODO
  };

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="large" color="primary" />} aria-label="breadcrumb">
        <Link href="/admin/themes" onClick={goToPath("/admin/themes")}>
          <Typography variant="h1" color="primary">
            Scénarios
          </Typography>
        </Link>
        <Typography variant="h1" color="textPrimary">
          Nouveau
        </Typography>
      </Breadcrumbs>
      <AdminTile title="Créer un scénario">
        <div style={{ padding: "1rem" }}>
          <Typography variant="h3" color="textPrimary">
            Thème associé:
          </Typography>
          <br />
          <Typography variant="h3" color="textPrimary">
            Scénario :
          </Typography>
          {selectedLanguages.map((languageIndex, index) => (
            <Card key={languages[languageIndex].value} variant="outlined" style={{ margin: "8px 0" }}>
              <CardActions>
                <div style={{ marginLeft: "8px", fontWeight: "bold" }}>{languages[languageIndex].label}</div>
                {selectedLanguages.length > 1 && (
                  <IconButton style={{ marginLeft: "auto" }} size="small" onClick={onDeleteLanguage(index)}>
                    <Close />
                  </IconButton>
                )}
              </CardActions>
              <CardContent style={{ paddingTop: "0" }}>
                <TextField label="Nom" value={scenario.names[languages[languageIndex].value] || ""} onChange={onNameInputChange(languages[languageIndex].value)} color="secondary" fullWidth />
                <TextField style={{ marginTop: "8px" }} label="Description" value={scenario.descriptions[languages[languageIndex].value] || ""} onChange={onDescInputChange(languages[languageIndex].value)} color="secondary" multiline fullWidth />
              </CardContent>
            </Card>
          ))}
          {availableLanguages.length > 0 && (
            <Button
              variant="outlined"
              onClick={() => {
                setShowModal(true);
              }}
            >
              Ajouter une langue
            </Button>
          )}

          <div style={{ width: "100%", textAlign: "center", marginTop: "1rem" }}>
            <Button color="secondary" variant="contained" onClick={onSubmit}>
              Créer le scénario !
            </Button>
          </div>
        </div>
      </AdminTile>
      <Button variant="outlined" style={{ marginTop: "1rem" }} onClick={goToPath("/admin/themes")}>
        Retour
      </Button>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* language modal */}
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        onConfirm={onAddLanguage}
        confirmLabel="Ajouter"
        cancelLabel="Annuler"
        title="Ajouter une langue"
        ariaLabelledBy="add-dialog"
        ariaDescribedBy="add-dialog-desc"
      >
        {availableLanguages.length > 0 && (
          <FormControl variant="outlined" style={{ minWidth: "15rem" }} className="mobile-full-width">
            <InputLabel htmlFor="langage">Languages</InputLabel>
            <Select
              native
              value={languageToAdd}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                setLanguageToAdd(parseInt(event.target.value, 10));
              }}
              label={"Langages"}
              inputProps={{
                name: "langage",
                id: "langage",
              }}
            >
              {availableLanguages.map((l, index) => (
                <option value={index} key={l.value}>
                  {l.label}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
      </Modal>
    </div>
  );
};

export default AdminNewScenario;
