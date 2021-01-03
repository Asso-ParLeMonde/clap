import { useSnackbar } from "notistack";
import React from "react";

import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "@material-ui/core/Link";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles, withStyles, Theme as MaterialTheme } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";

import { Modal } from "src/components/Modal";
import { Trans } from "src/components/Trans";
import { useTranslation } from "src/i18n/useTranslation";
import { UserServiceContext } from "src/services/UserService";
import { useLanguages } from "src/services/useLanguages";
import { axiosRequest } from "src/util/axiosRequest";
import { setCookie } from "src/util/cookies";
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
  const { t, currentLocale } = useTranslation();
  const { languages } = useLanguages();
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
  const [currentLanguage, setCurrentLanguage] = React.useState<string | null>(null);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentLanguage(event.target.value);
    setCookie("app-language", event.target.value, {
      "max-age": 24 * 60 * 60,
    });
    window.location.reload();
  };

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
      enqueueSnackbar(t("unknown_error"), {
        variant: "error",
      });
    } else {
      enqueueSnackbar(t("account_updated"), {
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
      enqueueSnackbar(t("unknown_error"), {
        variant: "error",
      });
      setShowModal(-1);
    } else {
      enqueueSnackbar(t("account_deleted"), {
        variant: "success",
      });
    }
  };

  return (
    <div>
      <div className="text-center">
        <Typography color="primary" variant="h1">
          {t("my_account")}
        </Typography>
      </div>
      <div style={{ maxWidth: "800px", margin: "auto", paddingBottom: "2rem" }}>
        <Typography variant="h2">{t("account_connexion_title")}</Typography>
        <div style={{ marginTop: "0.5rem" }}>
          <label>
            <strong>{t("signup_pseudo")} : </strong>
          </label>
          {user.pseudo} -{" "}
          <Link style={{ cursor: "pointer" }} onClick={openModal(1)}>
            {t("account_change_button")}
          </Link>
        </div>
        <div>
          <label>
            <strong>{t("signup_email")} : </strong>
          </label>
          {user.email} -{" "}
          <Link style={{ cursor: "pointer" }} onClick={openModal(2)}>
            {t("account_change_button")}
          </Link>
        </div>
        <Button style={{ marginTop: "0.8rem" }} className="mobile-full-width" onClick={openModal(3)} variant="contained" color="secondary" size="small">
          {t("account_password_change")}
        </Button>
        <Divider style={{ margin: "1rem 0 1.5rem" }} />
        <Typography variant="h2">{t("change_language")}</Typography>
        <FormControl variant="outlined" style={{ minWidth: "15rem", marginTop: "1rem" }} className="mobile-full-width">
          <InputLabel htmlFor="language">{t("language")}</InputLabel>
          <Select
            native
            value={currentLanguage || currentLocale}
            onChange={handleLanguageChange}
            label={t("language")}
            inputProps={{
              name: "language",
              id: "language",
            }}
          >
            {languages.map((l) => (
              <option value={l.value} key={l.value}>
                {l.label}
              </option>
            ))}
          </Select>
        </FormControl>
        <Divider style={{ margin: "1rem 0 1.5rem" }} />
        <Typography variant="h2">{t("account_school_title")}</Typography>
        <div style={{ marginTop: "0.5rem" }}>
          <label>
            <strong>{t("signup_school")} : </strong>
          </label>
          {user.school || t("account_unknown_school")}
        </div>
        <div>
          <label>
            <strong>{t("signup_level")} : </strong>
          </label>
          {user.level || t("account_unknown_level")}
        </div>
        <Button style={{ marginTop: "0.8rem" }} className="mobile-full-width" onClick={openModal(4)} variant="contained" color="secondary" size="small">
          {t("edit")}
        </Button>
        <Divider style={{ margin: "1rem 0 1.5rem" }} />
        <Typography variant="h2">{t("logout_button")}</Typography>
        <RedButtonBis variant="outlined" className="mobile-full-width" onClick={logout} size="small">
          {t("logout_button")}
        </RedButtonBis>
        <Divider style={{ margin: "1rem 0 1.5rem" }} />
        <Typography variant="h2">{t("my_account")}</Typography>
        {/* <Button style={{ marginTop: "0.8rem" }} className="mobile-full-width" onClick={() => {}} variant="contained" color="secondary" size="small">
          Télécharger toutes mes données
        </Button> */}
        {/* <br /> */}
        <RedButton style={{ marginTop: "0.8rem" }} className="mobile-full-width" onClick={openModal(5)} variant="contained" color="secondary" size="small">
          {t("account_delete_button")}
        </RedButton>

        <Modal
          open={showModal === 1 && updatedUser !== null}
          onClose={() => setShowModal(-1)}
          onConfirm={onSubmit("pseudo")}
          confirmLabel={t("edit")}
          cancelLabel={t("cancel")}
          title={t("Changer de pseudo")}
          ariaLabelledBy="pseudo-dialog-title"
          ariaDescribedBy="pseudo-dialog-description"
          fullWidth
        >
          <div id="pseudo-dialog-description">
            <Alert severity="info" style={{ marginBottom: "1rem" }}>
              {t("account_change_pseudo_info")}
            </Alert>
            <TextField
              fullWidth
              variant="outlined"
              value={updatedUser?.pseudo || ""}
              label={t("signup_pseudo")}
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
          confirmLabel={t("edit")}
          cancelLabel={t("cancel")}
          title={t("account_change_email")}
          ariaLabelledBy="email-dialog-title"
          ariaDescribedBy="email-dialog-description"
          fullWidth
        >
          <div id="email-dialog-description">
            <Alert severity="info" style={{ marginBottom: "1rem" }}>
              {t("account_change_email_info")}
            </Alert>
            <TextField
              fullWidth
              variant="outlined"
              value={updatedUser?.email || ""}
              label={t("signup_email")}
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
          confirmLabel={t("edit")}
          cancelLabel={t("cancel")}
          title={t("account_change_password")}
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
              label={t("account_current_password")}
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
              label={t("account_new_password")}
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
          confirmLabel={t("edit")}
          cancelLabel={t("cancel")}
          title={t("account_change_school")}
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
              placeholder={t("account_unknown_school")}
              label={t("signup_school")}
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
              placeholder={t("account_unknown_level")}
              label={t("signup_level")}
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
          confirmLabel={t("delete")}
          cancelLabel={t("cancel")}
          title={t("account_delete_button")}
          ariaLabelledBy="delete-dialog-title"
          ariaDescribedBy="delete-dialog-description"
          disabled={deleteText.toLowerCase() !== t("account_delete_confirm").toLowerCase()}
          fullWidth
          error
        >
          <div id="delete-dialog-description">
            <Alert severity="error" style={{ marginBottom: "1rem" }}>
              <Trans i18nKey="account_delete_warning1">
                Attention! Êtes-vous sur de vouloir supprimer votre compte ? Cette action est <strong>irréversible</strong>.
              </Trans>
              <br />
              <Trans i18nKey="account_delete_warning2" i18nParams={{ deleteConfirm: t("account_delete_confirm") }}>
                Pour supprimer votre compte, veuillez taper <strong>supprimer</strong> ci-dessous et cliquez sur supprimer.
              </Trans>
            </Alert>
            <TextField
              fullWidth
              variant="outlined"
              value={deleteText}
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={t("account_delete_placeholder", { deleteConfirm: t("account_delete_confirm") })}
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
