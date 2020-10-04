import { useRouter } from "next/router";
import React from "react";

import { Button, Link, TextField, Typography } from "@material-ui/core";

import { useTranslation } from "src/i18n/useTranslation";
import { axiosRequest } from "src/util/axiosRequest";

const errorMessages = {
  0: "login_unknown_error",
  1: "login_email_error",
};

const ResetPassword: React.FunctionComponent = () => {
  const router = useRouter();
  const { t, currentLocale } = useTranslation();
  const [email, setEmail] = React.useState<string>("");
  const [errorCode, setErrorCode] = React.useState<number>(-1);
  const [successMsg, setSuccessMsg] = React.useState<string>("");

  const handleUserNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setErrorCode(-1);
  };

  const submit = async () => {
    setErrorCode(-1);
    setSuccessMsg("");
    const response = await axiosRequest({
      method: "POST",
      url: "/login/reset-password",
      data: {
        email,
        languageCode: currentLocale,
      },
    });
    if (response.error) {
      setErrorCode(response.data.errorCode);
    } else {
      setSuccessMsg("forgot_password_success");
    }
  };

  const handleLinkClick = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(path);
  };

  return (
    <div className="text-center">
      <Typography color="primary" variant="h1" style={{ marginTop: "2rem" }}>
        {t("forgot_password_title")}
      </Typography>
      <form className="login-form" noValidate autoComplete="off">
        {errorCode === 0 && (
          <Typography variant="caption" color="error">
            {t(errorMessages[0])}
          </Typography>
        )}

        {successMsg.length > 0 && (
          <Typography variant="caption" color="primary">
            {t(successMsg)}
          </Typography>
        )}

        <TextField
          id="username"
          name="username"
          type="text"
          color="secondary"
          label={t("forgot_password_email")}
          value={email}
          onChange={handleUserNameInputChange}
          variant="outlined"
          fullWidth
          error={errorCode === 1}
          helperText={errorCode === 1 ? t(errorMessages[1]) : null}
        />

        <Button variant="contained" color="secondary" onClick={submit}>
          {t("forgot_password_button")}
        </Button>

        <div className="text-center">
          <Link href="/login" onClick={handleLinkClick("/login")}>
            {t("login_connect")}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
