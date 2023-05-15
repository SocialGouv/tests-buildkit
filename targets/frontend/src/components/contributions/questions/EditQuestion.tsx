import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { Breadcrumbs, Skeleton, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

import { EditQuestionForm } from "./EditQuestionForm";
import { useQuestionQuery } from "./Question.query";

export type EditQuestionProps = {
  questionId: string;
};

export const EditQuestion = ({
  questionId,
}: EditQuestionProps): JSX.Element => {
  const data = useQuestionQuery({ questionId });

  const Header = () => (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href={"/contributions"}>Contributions</Link>
        <div>{"Edition d'une question"}</div>
      </Breadcrumbs>
    </>
  );

  if (data === undefined) {
    return (
      <>
        <Header />
        <Skeleton />
      </>
    );
  }

  if (data === "not_found") {
    return (
      <>
        <Header />

        <Stack alignItems="center" spacing={2}>
          <SentimentVeryDissatisfiedIcon color="error" sx={{ fontSize: 70 }} />
          <Typography variant="h5" component="h3" color="error">
            Question non trouvée
          </Typography>
          <Link href={"/contributions"}>
            Retour à la liste des contributions
          </Link>
        </Stack>
      </>
    );
  }

  if (data === "error") {
    return (
      <>
        <Header />

        <Stack alignItems="center" spacing={2}>
          <SentimentVeryDissatisfiedIcon color="error" sx={{ fontSize: 70 }} />
          <Typography variant="h5" component="h3" color="error">
            Une erreur est survenue
          </Typography>
          <Link href={"/contributions"}>
            Retour à la liste des contributions
          </Link>
        </Stack>
      </>
    );
  }

  return (
    <>
      <Header />
      <EditQuestionForm question={data.question} messages={data.messages} />
    </>
  );
};