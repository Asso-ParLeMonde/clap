import { IconButton, makeStyles, withStyles } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import EditIcon from "@material-ui/icons/Edit";
import classnames from "classnames";
import React from "react";

const StyledDeleteButton = withStyles((theme) => ({
  root: {
    border: "1px solid",
    borderColor: theme.palette.secondary.main,
  },
}))(IconButton);

const useStyles = makeStyles((theme) => ({
  greenBorder: {
    borderColor: (theme.palette.secondary || {}).main,
    border: "1px solid",
  },
  greenBackground: {
    backgroundColor: (theme.palette.secondary || {}).main,
  },
}));

interface QuestionCardProps {
  question: string;
  index?: number;
  handleDelete?(event: React.MouseEvent): void;
  handleEdit?(event: React.MouseEvent): void;
}

export const QuestionCard: React.FunctionComponent<QuestionCardProps> = ({ question, index = 0, handleDelete = () => {}, handleEdit = () => {} }: QuestionCardProps) => {
  const classes = useStyles();

  return (
    <div className={classnames("question-container", classes.greenBorder)}>
      <div className={classnames("question-index", classes.greenBackground)}>
        <DragIndicatorIcon style={{ height: "1rem" }} />
        {index + 1}
      </div>
      <div className="question-content">
        <p>{question}</p>
      </div>
      <div className="question-actions">
        <StyledDeleteButton aria-label="edit" size="small" color="secondary" style={{ marginRight: "0.6rem" }} onClick={handleEdit}>
          <EditIcon />
        </StyledDeleteButton>
        <StyledDeleteButton aria-label="delete" size="small" color="secondary" onClick={handleDelete}>
          <DeleteIcon />
        </StyledDeleteButton>
      </div>
    </div>
  );
};
