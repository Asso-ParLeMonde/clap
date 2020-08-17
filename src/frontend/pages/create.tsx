import React from "react";

import { useTranslation } from "src/frontend/i18n/useTranslation";

const Create: React.FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <>
      <div>
        {t("test")} - {t("yolo")} - {t("welcome_message", { pseudo: "David", timestamp: 2323 })}
      </div>
      <div>
        {t("steps", { count: 0 })} - {t("steps", { count: 1 })} - {t("steps", { count: 10 })}
      </div>
    </>
  );
};

export default Create;
