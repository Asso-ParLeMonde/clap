import { useRouter } from "next/router";
import React from "react";

import Backdrop from "@material-ui/core/Backdrop";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "@material-ui/core/Link";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles, Theme as MaterialTheme } from "@material-ui/core/styles";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { Modal } from "src/components/Modal";
import { AdminTile } from "src/components/admin/AdminTile";
import { useLanguages } from "src/services/UseLanguages";
import { UserServiceContext } from "src/services/UserService";
import { getQueryString } from "src/util";
import type { Language } from "types/models/language.type";

const useStyles = makeStyles((theme: MaterialTheme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  }),
);

const AdminEditScenario: React.FunctionComponent = () => {
  const classes = useStyles();
  const router = useRouter();
  const scenarioId = React.useMemo(() => parseInt(getQueryString(router.query.id), 10) || 0, [router]);
  const { languages } = useLanguages();
  const languagesMap = React.useMemo(() => languages.reduce((acc: { [key: string]: number }, language: Language, index: number) => ({ ...acc, [language.value]: index }), {}), [languages]);
  const { axiosLoggedRequest } = React.useContext(UserServiceContext);

  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [languageToAdd, setLanguageToAdd] = React.useState<number>(0);
  const [selectedLanguages, setSelectedLanguages] = React.useState<number[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const availableLanguages = languages.filter((l, index) => l.value !== "fr" && !selectedLanguages.includes(index));

  const goToPath = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(path);
  };

  // const getScenario = React.useCallback(async () => {
  //   const response = await axiosLoggedRequest({
  //     method: "GET",
  //     url: `/themes/${themeId}`,
  //   });
  //   if (response.error) {
  //     router.push("/admin/themes");
  //   } else {
  //     setTheme(response.data);
  //     if (languages.length > 0) {
  //       setSelectedLanguages(
  //         Object.keys(response.data.names)
  //           .filter((key) => key !== "fr")
  //           .map((languageValue) => languagesMap[languageValue] || 0),
  //       );
  //     }
  //   }
  // }, [axiosLoggedRequest, router, themeId, languages, languagesMap]);

  // React.useEffect(() => {
  //   getScenario().catch((e) => console.error(e));
  // }, [getScenario]);

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
    // const newTheme = { ...theme };
    // delete newTheme.names[language.value];
    // setTheme(newTheme);
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
          TODO
        </Typography>
      </Breadcrumbs>
      <AdminTile title="Modifier le scénario">
        <div style={{ padding: "1rem" }}>
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
              Modifier le scénario !
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

export default AdminEditScenario;
