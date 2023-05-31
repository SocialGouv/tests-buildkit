import SendIcon from "@mui/icons-material/Send";
import {
  Alert,
  AlertColor,
  Box,
  Button,
  FormControl,
  Snackbar,
} from "@mui/material";
import * as React from "react";
import { useForm } from "react-hook-form";
import { FormTextField } from "src/components/forms";
import { useUser } from "src/hooks/useUser";

import { Comments as AnswerComments } from "../type";
import { Comment } from "./Comment";
import { MutationProps, useCommentsInsert } from "./Comments.mutation";

type Props = {
  answerId: string;
  comments: AnswerComments[];
};

export const Comments = (props: Props) => {
  const { user }: any = useUser();
  const [localComments, setLocalComments] = React.useState<AnswerComments[]>(
    props.comments ?? []
  );

  React.useEffect(() => {
    setLocalComments(props.comments);
  }, [props.comments]);

  const listRef = React.useRef<HTMLDivElement>(null);

  const insertComment = useCommentsInsert();

  const [snack, setSnack] = React.useState<{
    open: boolean;
    severity?: AlertColor;
    text?: string;
  }>({
    open: false,
  });

  const { control, handleSubmit, resetField } = useForm<MutationProps>({
    defaultValues: {
      content: "",
    },
  });

  React.useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [localComments]);

  const onSubmit = async (data: MutationProps) => {
    try {
      await insertComment({
        answerId: props.answerId,
        content: data.content,
        userId: user.id,
      });
      if (localComments.length === 0) {
        setLocalComments([
          {
            answerId: props.answerId,
            content: data.content,
            createdAt: new Date().toISOString(),
            id: "new",
            user,
            userId: user.id,
          } as any,
        ]);
      }
      setSnack({
        open: true,
        severity: "success",
        text: "Le commentaire a été ajoutée",
      });
      resetField("content");
    } catch (e: any) {
      setSnack({ open: true, severity: "error", text: e.message });
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: 4,
          }}
        >
          <Box
            ref={listRef}
            sx={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "50vh",
              overflow: "auto",
            }}
          >
            {localComments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </Box>
          <FormControl>
            <FormTextField
              name="content"
              control={control}
              label="Commentez ici..."
              rules={{ required: true }}
              multiline
              fullWidth
            />
          </FormControl>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            type="submit"
            sx={{ marginTop: 1 }}
          >
            Envoyer
          </Button>
        </Box>
      </form>
      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={() => setSnack({ open: false })}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Alert
          onClose={() => setSnack({ open: false })}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack?.severity}
        </Alert>
      </Snackbar>
    </Box>
  );
};