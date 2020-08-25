import { Typography, TextField, InputAdornment, IconButton, Button, FormControlLabel, Checkbox, Link } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useRouter } from "next/router";
import qs from "query-string";
import React from "react";

import { useTranslation } from "src/i18n/useTranslation";
import { UserServiceContext } from "src/services/UserService";

const errorMessages = {
  0: "login_unknown_error",
  1: "login_username_error",
  2: "login_password_error",
  3: "login_account_error",
};

const Login: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const { login } = React.useContext(UserServiceContext);
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);
  const [user, setUser] = React.useState({
    username: "",
    password: "",
    remember: false,
  });
  const [errorCode, setErrorCode] = React.useState(-1);
  const [redirect, setRedirect] = React.useState("/create");

  React.useEffect(() => {
    try {
      setRedirect(decodeURI((qs.parse(window.location.search).redirect as string) || "/create"));
    } catch (e) {
      setRedirect("/create");
    }
  }, []);

  const handleUserNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, username: event.target.value });
    if (errorCode === 1) {
      setErrorCode(-1);
    }
  };

  const handlePasswordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, password: event.target.value });
    if (errorCode === 2) {
      setErrorCode(-1);
    }
  };

  const handleToggleLocalSave = () => {
    setUser({ ...user, remember: !user.remember });
  };

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const submit = async (event: React.MouseEvent) => {
    event.preventDefault();
    setErrorCode(-1);
    const response = await login(user.username, user.password, user.localSave);
    if (response.success) {
      router.push(redirect);
    } else {
      setErrorCode(response.errorCode || 0);
    }
  };

  const handleLinkClick = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(path);
  };

  return (
    <div className="text-center">
      <Typography color="primary" variant="h1" style={{ marginTop: "2rem" }}>
        {redirect.slice(0, 6) === "/admin" ? t("login_title_admin") : t("login_title")}
      </Typography>
      <form className="login-form" noValidate>
        {(errorCode === 0 || errorCode === 3) && (
          <Typography variant="caption" color="error">
            {t(errorMessages[errorCode])}
          </Typography>
        )}
        <TextField
          id="username"
          name="username"
          type="text"
          color="secondary"
          label={t("login_username")}
          value={user.username}
          onChange={handleUserNameInputChange}
          variant="outlined"
          fullWidth
          error={errorCode === 1}
          helperText={errorCode === 1 ? t(errorMessages[1]) : null}
        />
        <TextField
          type={showPassword ? "text" : "password"}
          color="secondary"
          id="password"
          name="password"
          label={t("login_password")}
          value={user.password}
          onChange={handlePasswordInputChange}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={handleToggleShowPassword} edge="end">
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
          error={errorCode === 2}
          helperText={errorCode === 2 ? t(errorMessages[2]) : null}
        />
        <div>
          <FormControlLabel control={<Checkbox checked={user.remember} onChange={handleToggleLocalSave} value={user.remember} />} label={t("login_remember_me")} />
        </div>
        <Button variant="contained" color="secondary" type="submit" value="Submit" onClick={submit}>
          {t("login_connect")}
        </Button>
        <div className="text-center">
          <Link href="/reset-password" onClick={handleLinkClick("/reset-password")}>
            {t("login_forgot_password")}
          </Link>
        </div>
        <div className="text-center">
          {t("login_new")}{" "}
          <Link href="/signup" onClick={handleLinkClick("/sign-up")}>
            {t("login_signup")}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
