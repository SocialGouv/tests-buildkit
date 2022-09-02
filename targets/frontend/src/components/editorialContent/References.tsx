/** @jsxImportSource theme-ui */

import PropTypes from "prop-types";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { Box, Field, Flex } from "theme-ui";

import { ContentLink } from "../../types";
import { Button } from "../button";
import { FormErrorMessage } from "../forms/ErrorMessage";

export const References = ({ nestName }: { nestName: string }) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    keyName: "key",
    name: nestName,
  });

  const references = fields as ContentLink[];

  useEffect(() => {
    if (references.length === 0) {
      append({});
    }
  }, [references, append]);
  return (
    <>
      {references.map((reference, index) => (
        <Flex
          sx={{ alignItems: "flex-start", flexWrap: "wrap" }}
          key={reference.key}
        >
          <Box mr="small" sx={{ flex: "1 0 auto" }}>
            <Field
              type="text"
              label="Label"
              defaultValue={reference.title}
              {...register(`${nestName}.${index}.title`, {
                required: {
                  message: "La référence doit avoir un label",
                  value: true,
                },
              })}
            />
            <FormErrorMessage
              errors={errors}
              fieldName={`${nestName}.${index}.title`}
            />
          </Box>
          <Box mr="small" sx={{ flex: "1 0 auto" }}>
            <Field
              type="text"
              label="URL"
              defaultValue={reference.url}
              {...register(`${nestName}.${index}.url`, {
                required: {
                  message: "La référence doit avoir une url",
                  value: true,
                },
              })}
            />
            <FormErrorMessage
              errors={errors}
              fieldName={`${nestName}.${index}.url`}
            />
          </Box>
          {references.length > 1 && (
            <Button
              type="button"
              variant="primary"
              outline
              onClick={() => remove(index)}
              sx={{ flex: "0 0 auto", mt: "medium" }}
            >
              <IoMdClose sx={{ height: "1.5rem", width: "1.5rem" }} />
            </Button>
          )}
        </Flex>
      ))}
      <Flex sx={{ justifyContent: "left" }}>
        <Button
          type="button"
          size="small"
          onClick={() => append({})}
          variant="secondary"
          outline
        >
          Ajouter une référence au bloc
        </Button>
      </Flex>
    </>
  );
};

References.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
  nestName: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
};