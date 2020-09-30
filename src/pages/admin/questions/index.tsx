import { ReactSortable } from "react-sortablejs";
import React from "react";

import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "@material-ui/core/Link";
import MenuItem from "@material-ui/core/MenuItem";
import NoSsr from "@material-ui/core/NoSsr";
import Select from "@material-ui/core/Select";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles, withStyles, Theme as MaterialTheme } from "@material-ui/core/styles";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import EditIcon from "@material-ui/icons/Edit";

import { AdminTile } from "src/components/admin/AdminTile";
import { CreateQuestionModal } from "src/components/admin/questions/CreateQuestionModal";
import { useLanguages } from "src/services/useLanguages";
import { useQuestions } from "src/services/useQuestions";
import { useScenarios } from "src/services/useScenarios";
import { groupScenarios } from "src/util/groupScenarios";
import type { Language } from "types/models/language.type";
import type { Question } from "types/models/question.type";

const useTableStyles = makeStyles((theme: MaterialTheme) =>
  createStyles({
    toolbar: {
      backgroundColor: theme.palette.secondary.main,
      color: "white",
      fontWeight: "bold",
      minHeight: "unset",
      padding: "8px 8px 8px 16px",
    },
    title: {
      flex: "1 1 100%",
    },
    button: {
      color: "white",
    },
  }),
);

const StyledTableRow = withStyles(() =>
  createStyles({
    root: {
      backgroundColor: "white",
      "&:nth-of-type(even)": {
        backgroundColor: "rgb(224 239 232)",
      },
      "&.sortable-ghost": {
        opacity: 0,
      },
    },
  }),
)(TableRow);

const AdminQuestions: React.FunctionComponent = () => {
  const classes = useTableStyles();
  const { languages } = useLanguages();
  const { scenarios } = useScenarios({ isDefault: true });
  const groupedScenarios = groupScenarios(scenarios);
  const [availableLanguages, setAvailableLanguages] = React.useState<Language[]>([]);
  const [selectedArgs, setSelectedArgs] = React.useState<{
    isDefault: boolean;
    scenarioId: number | string | null;
    languageCode: string;
  }>({
    isDefault: true,
    scenarioId: null,
    languageCode: "fr",
  });
  const { questions, setQuestions } = useQuestions(selectedArgs);
  const [createModalOpen, setCreateModalOpen] = React.useState<boolean>(false);

  const onSelectScenario = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const scenarioId = parseInt(event.target.value, 10);
    const scenarioLanguages = Object.keys(groupedScenarios.find((s) => s.id === scenarioId)?.names || {}).filter((key) => key !== "default");
    if (scenarioLanguages.length === 0) {
      // TODO show error
      return;
    }
    setAvailableLanguages(languages.filter((l) => scenarioLanguages.includes(l.value)));
    const selectedLanguage = scenarioLanguages.includes("fr") ? "fr" : scenarioLanguages[0];
    setSelectedArgs((s) => ({ ...s, scenarioId: parseInt(event.target.value, 10), languageCode: selectedLanguage }));
  };
  const onLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArgs((s) => ({ ...s, languageCode: event.target.value }));
  };

  const setQuestionsOrder = (newQuestions: Question[]) => {
    if (questions.map((q) => q.id).join(",") === newQuestions.map((q) => q.id).join(",")) {
      return;
    }
    setQuestions(newQuestions);
    // TODO save in backend
  };

  const setQuestionsFunction = (f: (questions: Question[]) => Question[]) => {
    setQuestions(f(questions));
  };

  const selectLanguage = (
    <span style={{ marginLeft: "2rem" }}>
      (
      <Select value={selectedArgs.languageCode} color="secondary" style={{ color: "white" }} onChange={onLanguageChange}>
        {availableLanguages.map((l) => (
          <MenuItem key={l.value} value={l.value}>
            {l.label.toLowerCase()}
          </MenuItem>
        ))}
      </Select>
      )
    </span>
  );

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
              <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedArgs.scenarioId} onChange={onSelectScenario}>
                {groupedScenarios.map((s) => (
                  <MenuItem value={s.id} key={s.id}>
                    {s.names.default}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </AdminTile>
        {selectedArgs.scenarioId !== null && (
          <AdminTile
            title="Liste des questions du scénario"
            selectLanguage={selectLanguage}
            toolbarButton={
              <Button
                onClick={() => {
                  setCreateModalOpen(true);
                }}
                style={{ flexShrink: 0 }}
                variant="contained"
                startIcon={<AddCircleIcon />}
              >
                Ajouter une question
              </Button>
            }
            style={{ marginTop: "2rem" }}
          >
            <Table aria-labelledby="themetabletitle" size="medium" aria-label="toutes les questions">
              {questions.length > 0 ? (
                <>
                  <TableHead style={{ borderBottom: "1px solid white" }} className={classes.toolbar}>
                    <TableRow>
                      <TableCell style={{ color: "white", fontWeight: "bold" }}>Ordre</TableCell>
                      <TableCell style={{ color: "white", fontWeight: "bold" }}>Question</TableCell>
                      <TableCell style={{ color: "white", fontWeight: "bold" }} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <ReactSortable tag={"tbody"} list={questions} setList={setQuestionsOrder} animation={100} handle=".questions-index">
                    {questions.map((q, index) => (
                      <StyledTableRow key={q.id}>
                        <TableCell padding="none" className="questions-index">
                          <div style={{ display: "flex", alignItems: "center", cursor: "grab", marginLeft: "8px" }}>
                            <DragIndicatorIcon />
                            {index}
                          </div>
                        </TableCell>
                        <TableCell>{q.question}</TableCell>
                        <TableCell align="right" padding="none" style={{ minWidth: "96px" }}>
                          <Tooltip title="Modifier">
                            <IconButton aria-label="edit" onClick={() => {}}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton aria-label="delete" onClick={() => {}}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </ReactSortable>
                </>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Cette liste est vide !{" "}
                      <Link
                        onClick={() => {
                          setCreateModalOpen(true);
                        }}
                        style={{ cursor: "pointer" }}
                        color="secondary"
                      >
                        Ajouter une question ?
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </AdminTile>
        )}
        <CreateQuestionModal
          onClose={() => {
            setCreateModalOpen(false);
          }}
          scenarioId={selectedArgs.scenarioId}
          languageCode={selectedArgs.languageCode}
          open={createModalOpen}
          setQuestions={setQuestionsFunction}
          order={Math.max(...questions.map((q) => q.index)) + 1}
        />
      </NoSsr>
    </div>
  );
};

export default AdminQuestions;
