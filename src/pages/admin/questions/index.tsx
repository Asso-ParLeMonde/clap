import React from "react";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import NoSsr from "@material-ui/core/NoSsr";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";

import { AdminTile } from "src/components/admin/AdminTile";
import { useScenarios } from "src/services/useScenarios";
import { groupScenarios } from "src/util/groupScenarios";

const AdminQuestions: React.FunctionComponent = () => {
  const { scenarios } = useScenarios({ isDefault: true });
  const groupedScenarios = groupScenarios(scenarios);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const onSelectScenario = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(parseInt(event.target.value, 10));
  };

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <Typography variant="h1" color="primary">
        Questions
      </Typography>
      <NoSsr>
        <AdminTile title="Choisir un scénario">
          <div style={{ padding: "8px 16px 16px 16px" }}>
            <FormControl fullWidth color="secondary">
              <InputLabel id="demo-simple-select-label">Choisir le scénario</InputLabel>
              <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedId} onChange={onSelectScenario}>
                {groupedScenarios.map((s) => (
                  <MenuItem value={s.id} key={s.id}>
                    {s.names.default}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </AdminTile>
        {selectedId !== null && <AdminTile title="Liste des questions" style={{ marginTop: "2rem" }}></AdminTile>}
      </NoSsr>
    </div>
  );
};

export default AdminQuestions;
