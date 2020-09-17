import { useRouter } from "next/router";
import React from "react";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { AdminTile } from "src/components/admin/AdminTile";
import { UserServiceContext } from "src/services/UserService";
import type { Theme } from "types/models/theme.type";

const AdminNewTheme: React.FunctionComponent = () => {
  const router = useRouter();
  const { axiosLoggedRequest } = React.useContext(UserServiceContext);
  const [theme, setTheme] = React.useState<Theme>({
    id: 0,
    names: {
      fr: "",
    },
    isDefault: true,
    image: null,
    order: null,
  });

  const goToPath = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(path);
  };

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="large" color="primary" />} aria-label="breadcrumb">
        <Link href="/admin/themes" onClick={goToPath("/admin/themes")}>
          <Typography variant="h1" color="primary">
            Thèmes
          </Typography>
        </Link>
        <Typography variant="h1" color="textPrimary">
          Nouveau
        </Typography>
      </Breadcrumbs>
      <AdminTile title="Ajouter un thème">
        <Typography variant="h3" color="textPrimary">
          Nom du thème :
          <TextField value={theme.names.fr || ""} onChange={() => {}} required id="themeName_fr" style={{ marginTop: "0.5rem" }} variant="outlined" color="secondary" autoComplete="off" />
        </Typography>
      </AdminTile>
    </div>
  );
};

export default AdminNewTheme;
