import { Typography, Select, FormControl, InputLabel, Button, withStyles } from "@material-ui/core";
import React, { useContext } from "react";

import { useTranslation } from "src/i18n/useTranslation";
import { UserServiceContext } from "src/services/UserService";
import { axiosRequest } from "src/util/axiosRequest";
import { setCookie } from "src/util/cookies";
import type { Language } from "types/models/language.type";

const RedButton = withStyles((theme) => ({
  root: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
}))(Button);

const Settings: React.FunctionComponent = () => {
  const { t, currentLocale } = useTranslation();
  const { isLoggedIn, logout } = useContext(UserServiceContext);

  const [currentLanguage, setCurrentLanguage] = React.useState<string | null>(null);
  const [languages, setLanguages] = React.useState<Language[]>([]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentLanguage(event.target.value);
    setCookie("app-language", event.target.value, {
      "max-age": 24 * 60 * 60,
    });
    window.location.reload();
  };

  const getLanguages = async () => {
    const response = await axiosRequest({
      method: "GET",
      url: "/languages",
    });
    if (!response.error) {
      setLanguages(response.data);
    }
  };

  React.useEffect(() => {
    getLanguages().catch();
  }, []);

  return (
    <>
      <Typography color="primary" variant="h1">
        {t("settings")}
      </Typography>
      <div>
        <form noValidate autoComplete="off" style={{ margin: "1rem 0" }}>
          {languages.length > 0 && (
            <>
              <Typography color="inherit" variant="h2" style={{ margin: "0.5rem 0 1rem 0" }}>
                {t("change_language")}
              </Typography>
              <FormControl variant="outlined" style={{ minWidth: "15rem" }} className="mobile-full-width">
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
            </>
          )}
        </form>
        {isLoggedIn && (
          <>
            <Typography color="inherit" variant="h2" style={{ margin: "2rem 0 1rem 0" }}>
              {t("logout_title")}
            </Typography>
            <RedButton variant="outlined" className="mobile-full-width" onClick={logout}>
              {t("logout_button")}
            </RedButton>
          </>
        )}
      </div>
    </>
  );
};

export default Settings;
