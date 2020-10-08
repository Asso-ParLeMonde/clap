import React from "react";

// import Backdrop from "@material-ui/core/Backdrop";
// import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
// import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import FormControl from "@material-ui/core/FormControl";
import Link from "@material-ui/core/Link";
// import NoSsr from "@material-ui/core/NoSsr";
// import RadioGroup from "@material-ui/core/RadioGroup";
// import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { /* makeStyles, createStyles, */ withStyles, Theme as MaterialTheme } from "@material-ui/core/styles";
// import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Alert from "@material-ui/lab/Alert";

import { Modal } from "src/components/Modal";
import { useTranslation } from "src/i18n/useTranslation";
import { UserServiceContext } from "src/services/UserService";
import type { User } from "types/models/user.type";

// const useStyles = makeStyles((theme: MaterialTheme) =>
//   createStyles({
//     backdrop: {
//       zIndex: theme.zIndex.drawer + 1,
//       color: "#fff",
//     },
//   }),
// );

const RedButton = withStyles((theme: MaterialTheme) => ({
  root: {
    color: theme.palette.error.contrastText,
    background: theme.palette.error.light,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
}))(Button);
const RedButtonBis = withStyles((theme) => ({
  root: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
}))(Button);

const Account: React.FunctionComponent = () => {
  // const classes = useStyles();
  const { t } = useTranslation();
  const { user, logout /*, axiosLoggedRequest */ } = React.useContext(UserServiceContext);
  const [updatedUser, setUpdatedUser] = React.useState<User | null>(null);
  // const [loading, setLoading] = React.useState<boolean>(false);
  const [showModal, setShowModal] = React.useState<number>(-1);

  const openModal = (n: number) => () => {
    if (user === null) {
      return;
    }
    setUpdatedUser(user);
    setShowModal(n);
  };

  if (user === null) {
    return null;
  }

  const onUserChange = (userKey: "email" | "pseudo" | "school" | "level") => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser({ ...updatedUser, [userKey]: event?.target?.value || "" });
  };

  return (
    <div>
      <div className="text-center">
        <Typography color="primary" variant="h1">
          Mon compte
        </Typography>
      </div>
      <div style={{ maxWidth: "800px", margin: "auto", paddingBottom: "2rem" }}>
        <Typography variant="h2">Mes identifiants de connexion</Typography>
        <div style={{ marginTop: "0.5rem" }}>
          <label>
            <strong>Pseudo : </strong>
          </label>
          {user.pseudo} -{" "}
          <Link style={{ cursor: "pointer" }} onClick={openModal(1)}>
            Changer
          </Link>
        </div>
        <div>
          <label>
            <strong>Email : </strong>
          </label>
          {user.email} -{" "}
          <Link style={{ cursor: "pointer" }} onClick={openModal(2)}>
            Changer
          </Link>
        </div>
        <Button style={{ marginTop: "0.8rem" }} className="mobile-full-width" onClick={openModal(3)} variant="contained" color="secondary" size="small">
          Changer mon mot de passe
        </Button>
        <Divider style={{ margin: "1rem 0 1.5rem" }} />
        <Typography variant="h2">Mon école</Typography>
        <div style={{ marginTop: "0.5rem" }}>
          <label>
            <strong>École : </strong>
          </label>
          {user.school || "Non renseignée"}
        </div>
        <div>
          <label>
            <strong>Niveau de la classe : </strong>
          </label>
          {user.level || "Non renseigné"}
        </div>
        <Button style={{ marginTop: "0.8rem" }} className="mobile-full-width" onClick={openModal(4)} variant="contained" color="secondary" size="small">
          Modifier
        </Button>
        <Divider style={{ margin: "1rem 0 1.5rem" }} />
        <Typography variant="h2">Se déconnecter</Typography>
        <RedButtonBis variant="outlined" className="mobile-full-width" onClick={logout} size="small">
          {t("logout_button")}
        </RedButtonBis>
        <Divider style={{ margin: "1rem 0 1.5rem" }} />
        <Typography variant="h2">Mes données du compte</Typography>
        <Button style={{ marginTop: "0.8rem" }} className="mobile-full-width" onClick={() => {}} variant="contained" color="secondary" size="small">
          Télécharger toutes mes données
        </Button>
        <br />
        <RedButton style={{ marginTop: "0.8rem" }} className="mobile-full-width" onClick={openModal(5)} variant="contained" color="secondary" size="small">
          Supprimer mon compte
        </RedButton>

        <Modal
          open={showModal === 1 && updatedUser !== null}
          onClose={() => setShowModal(-1)}
          onConfirm={() => {}}
          confirmLabel="Modifier"
          cancelLabel="Annuler"
          title="Changer de pseudo"
          ariaLabelledBy="pseudo-dialog-title"
          ariaDescribedBy="pseudo-dialog-description"
          fullWidth
        >
          <div id="pseudo-dialog-description">
            <Alert severity="info" style={{ marginBottom: "1rem" }}>
              Votre Pseudo est votre identifiant de connection.
            </Alert>
            <TextField fullWidth value={updatedUser?.pseudo || ""} label="Pseudo" onChange={onUserChange("pseudo")} color="secondary" />
          </div>
        </Modal>
        <Modal
          open={showModal === 2 && updatedUser !== null}
          onClose={() => setShowModal(-1)}
          onConfirm={() => {}}
          confirmLabel="Modifier"
          cancelLabel="Annuler"
          title="Changer d'email"
          ariaLabelledBy="email-dialog-title"
          ariaDescribedBy="email-dialog-description"
          fullWidth
        >
          <div id="email-dialog-description">
            <Alert severity="info" style={{ marginBottom: "1rem" }}>
              Votre email est votre identifiant de connection.
            </Alert>
            <TextField fullWidth value={updatedUser?.email || ""} label="Email" onChange={onUserChange("email")} color="secondary" />
          </div>
        </Modal>
        <Modal
          open={showModal === 3 && updatedUser !== null}
          onClose={() => setShowModal(-1)}
          onConfirm={() => {}}
          confirmLabel="Modifier"
          cancelLabel="Annuler"
          title="Changer de mot de passe"
          ariaLabelledBy="mdp-dialog-title"
          ariaDescribedBy="mdp-dialog-description"
          fullWidth
        >
          <div id="mdp-dialog-description"></div>
        </Modal>
        <Modal
          open={showModal === 4 && updatedUser !== null}
          onClose={() => setShowModal(-1)}
          onConfirm={() => {}}
          confirmLabel="Modifier"
          cancelLabel="Annuler"
          title="Modifier mes informations"
          ariaLabelledBy="school-dialog-title"
          ariaDescribedBy="school-dialog-description"
          fullWidth
        >
          <div id="school-dialog-description">
            <TextField
              fullWidth
              value={updatedUser?.school || ""}
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Non renseignée"
              label="École"
              onChange={onUserChange("school")}
              color="secondary"
            />
            <TextField
              fullWidth
              value={updatedUser?.level || ""}
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Non renseigné"
              label="Niveau de la classe"
              onChange={onUserChange("level")}
              color="secondary"
              style={{ marginTop: "1rem" }}
            />
          </div>
        </Modal>
        <Modal
          open={showModal === 5 && updatedUser !== null}
          onClose={() => setShowModal(-1)}
          onConfirm={() => {}}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          title="Supprimer le compte"
          ariaLabelledBy="delete-dialog-title"
          ariaDescribedBy="delete-dialog-description"
          fullWidth
          error
        >
          <div id="delete-dialog-description"></div>
        </Modal>
      </div>
    </div>
  );
};

export default Account;
