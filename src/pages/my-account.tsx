import { useSnackbar } from "notistack";
import React from "react";

import Backdrop from "@material-ui/core/Backdrop";
// import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
// import NoSsr from "@material-ui/core/NoSsr";
import InputAdornment from "@material-ui/core/InputAdornment";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import FormControl from "@material-ui/core/FormControl";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles, withStyles, Theme as MaterialTheme } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
// import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Alert from "@material-ui/lab/Alert";

import { Modal } from "src/components/Modal";
import { useTranslation } from "src/i18n/useTranslation";
import { UserServiceContext } from "src/services/UserService";
import { axiosRequest } from "src/util/axiosRequest";
import type { User } from "types/models/user.type";

const useStyles = makeStyles((theme: MaterialTheme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  }),
);

type UpdatedUser = Partial<User> & { oldPassword: string };

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/i;
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
const checks = {
  // eslint-disable-next-line
  email: (value: string, _u: UpdatedUser) => emailRegex.test(value), // eslint-disable-next-line
  pseudo: (value: string, _u: UpdatedUser) => value.length > 0, // eslint-disable-next-line
  password: (value: string, _u: UpdatedUser) => strongPassword.test(value), // eslint-disable-next-line
  passwordConfirm: (value: string, user: UpdatedUser) => value === user.password, // eslint-disable-next-line
  school: (_v: string, _u: UpdatedUser) => true,
};
const isPseudoAvailable = async (userPseudo: string, pseudo: string): Promise<boolean> => {
  if (userPseudo === pseudo) {
    return true;
  }
  const response = await axiosRequest({
    method: "GET",
    url: `/users/test-pseudo/${pseudo}`,
  });
  if (response.error) {
    return false;
  }
  return response.data.available;
};

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
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { user, logout, axiosLoggedRequest, setUser, deleteAccount } = React.useContext(UserServiceContext);
  const [updatedUser, setUpdatedUser] = React.useState<UpdatedUser | null>(null);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showModal, setShowModal] = React.useState<number>(-1);
  const [errors, setErrors] = React.useState({
    email: false,
    pseudo: false,
    pseudoNotAvailable: false,
    password: false,
    passwordConfirm: false,
  });
  const [deleteText, setDeleteText] = React.useState<string>("");

  const openModal = (n: number) => () => {
    if (user === null) {
      return;
    }
    setUpdatedUser({ ...user, oldPassword: "", password: "", passwordConfirm: "" });
    setDeleteText("");
    setShowModal(n);
  };

  if (user === null) {
    return null;
  }

  const onUserChange = (userKey: "email" | "pseudo" | "school" | "level" | "password" | "passwordConfirm" | "oldPassword") => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser({ ...updatedUser, [userKey]: event?.target?.value || "" });
    setErrors((e) => ({ ...e, [userKey]: false, global: false }));
  };
  const handleInputValidations = (userKey: "email" | "pseudo" | "password" | "passwordConfirm") => (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value || "";
    setErrors((e) => ({
      ...e,
      [userKey]: value.length !== 0 && !checks[userKey](value, updatedUser),
    }));
    if (userKey === "pseudo" && value.length !== 0) {
      isPseudoAvailable(user?.pseudo || "", value).then((result: boolean) => {
        setErrors((e) => ({ ...e, pseudoNotAvailable: !result }));
      });
    }
  };

  const onSubmit = (userKey: "email" | "pseudo" | "school" | "password") => async () => {
    const data = {
      [userKey]: updatedUser[userKey],
    };
    if (userKey === "school") {
      data.level = updatedUser.level;
    }
    if (userKey === "password") {
      data.oldPassword = updatedUser.oldPassword;
    }
    if (!checks[userKey](updatedUser[userKey], updatedUser)) {
      setErrors((e) => ({ ...e, [userKey]: true }));
      return;
    }
    if (userKey === "pseudo" && !(await isPseudoAvailable(user?.pseudo || "", updatedUser.pseudo))) {
      setErrors((e) => ({ ...e, pseudoNotAvailable: true }));
      return;
    }
    setLoading(true);
    const response = await axiosLoggedRequest({
      method: "PUT",
      url: `/users/${user.id}`,
      data,
    });
    setLoading(false);
    if (response.error) {
      enqueueSnackbar("Une erreur est survenue...", {
        variant: "error",
      });
    } else {
      enqueueSnackbar("Compte mis à jour!", {
        variant: "success",
      });
      setUser({ ...user, ...data });
    }
    setShowModal(-1);
  };

  const onDeleteAccount = async () => {
    setLoading(true);
    const success = await deleteAccount();
    setLoading(false);
    if (!success) {
      enqueueSnackbar("Une erreur est survenue...", {
        variant: "error",
      });
      setShowModal(-1);
    } else {
      enqueueSnackbar("Compte supprimé!", {
        variant: "success",
      });
    }
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
        <Typography variant="h2">Mon compte</Typography>
        {/* <Button style={{ marginTop: "0.8rem" }} className="mobile-full-width" onClick={() => {}} variant="contained" color="secondary" size="small">
          Télécharger toutes mes données
        </Button> */}
        {/* <br /> */}
        <RedButton style={{ marginTop: "0.8rem" }} className="mobile-full-width" onClick={openModal(5)} variant="contained" color="secondary" size="small">
          Supprimer mon compte
        </RedButton>

        <Modal
          open={showModal === 1 && updatedUser !== null}
          onClose={() => setShowModal(-1)}
          onConfirm={onSubmit("pseudo")}
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
            <TextField
              fullWidth
              variant="outlined"
              value={updatedUser?.pseudo || ""}
              label="Pseudo"
              onChange={onUserChange("pseudo")}
              onBlur={handleInputValidations("pseudo")}
              color="secondary"
              error={errors.pseudo || errors.pseudoNotAvailable}
              helperText={(errors.pseudo ? `${t("signup_required")} | ` : errors.pseudoNotAvailable ? `${t("signup_pseudo_error")} |` : "") + t("signup_pseudo_help")}
            />
          </div>
        </Modal>
        <Modal
          open={showModal === 2 && updatedUser !== null}
          onClose={() => setShowModal(-1)}
          onConfirm={onSubmit("email")}
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
            <TextField
              fullWidth
              variant="outlined"
              value={updatedUser?.email || ""}
              label="Email"
              onChange={onUserChange("email")}
              onBlur={handleInputValidations("email")}
              color="secondary"
              error={errors.email}
              helperText={errors.email ? t("signup_email_error") : ""}
            />
          </div>
        </Modal>
        <Modal
          open={showModal === 3 && updatedUser !== null}
          onClose={() => setShowModal(-1)}
          onConfirm={onSubmit("password")}
          confirmLabel="Modifier"
          cancelLabel="Annuler"
          title="Changer de mot de passe"
          ariaLabelledBy="mdp-dialog-title"
          ariaDescribedBy="mdp-dialog-description"
          fullWidth
        >
          <div id="mdp-dialog-description">
            <TextField
              type={showPassword ? "text" : "password"}
              color="secondary"
              id="password"
              name="password"
              label={"Mot de passe actuel"}
              value={updatedUser?.oldPassword || ""}
              onChange={onUserChange("oldPassword")}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <Divider style={{ margin: "1.5rem 0" }} />
            <TextField
              type={showPassword ? "text" : "password"}
              color="secondary"
              id="password"
              name="password"
              label={"Nouveau mot de passe"}
              value={updatedUser?.password || ""}
              onChange={onUserChange("password")}
              onBlur={handleInputValidations("password")}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
              error={errors.password}
              helperText={errors.password ? t("signup_password_error") : ""}
            />
            <TextField
              style={{ marginTop: "1rem" }}
              type={showPassword ? "text" : "password"}
              color="secondary"
              id="passwordComfirm"
              name="passwordComfirm"
              label={t("signup_password_confirm")}
              value={updatedUser?.passwordConfirm || ""}
              onChange={onUserChange("passwordConfirm")}
              onBlur={handleInputValidations("passwordConfirm")}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
              error={errors.passwordConfirm}
              helperText={errors.passwordConfirm ? t("signup_password_confirm_error") : ""}
            />
          </div>
        </Modal>
        <Modal
          open={showModal === 4 && updatedUser !== null}
          onClose={() => setShowModal(-1)}
          onConfirm={onSubmit("school")}
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
              variant="outlined"
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
              variant="outlined"
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
          onConfirm={onDeleteAccount}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          title="Supprimer le compte"
          ariaLabelledBy="delete-dialog-title"
          ariaDescribedBy="delete-dialog-description"
          disabled={deleteText.toLowerCase() !== "supprimer"}
          fullWidth
          error
        >
          <div id="delete-dialog-description">
            <Alert severity="error" style={{ marginBottom: "1rem" }}>
              Attention! Êtes-vous sur de vouloir supprimer votre compte ? Cette action est <strong>irréversible</strong>.
              <br />
              {"Pour supprimer votre compte, veuillez taper '"}
              <strong>supprimer</strong>
              {"' ci-dessous et cliquez sur supprimer."}
            </Alert>
            <TextField
              fullWidth
              variant="outlined"
              value={deleteText}
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Tapez 'supprimer' ici"
              label=""
              color="secondary"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDeleteText(event.target.value);
              }}
              style={{ marginTop: "0.25rem" }}
            />
          </div>
        </Modal>
      </div>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Account;
