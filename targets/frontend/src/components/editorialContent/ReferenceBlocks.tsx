/** @jsxImportSource theme-ui */

import PropTypes from "prop-types";
import { useFieldArray, useFormContext } from "react-hook-form";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import { Container, Flex, Label, Radio } from "theme-ui";

import { ContentSectionReference } from "../../types";
import { Button } from "../button";
import { FormErrorMessage } from "../forms/ErrorMessage";
import { Stack } from "../layout/Stack";
import { References } from "./References";

const JURIDIQUES_LABEL = "Références juridiques";
const USEFUL_LINKS_LABEL = "Liens utiles";

export function ReferenceBlocks({ name }: any) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    keyName: "key",
    name,
  });

  const blocks = fields as ContentSectionReference[];

  return (
    <>
      {blocks.length > 0 ? (
        blocks.map((block, index) => (
          <Container
            key={block.key}
            bg="nested"
            sx={{ borderRadius: "large", flex: "1 0 auto", p: "small" }}
          >
            <Stack>
              <Flex sx={{ justifyContent: "flex-end" }}>
                <Button
                  type="button"
                  size="small"
                  outline
                  onClick={() => remove(index)}
                >
                  <IoMdTrash
                    sx={{
                      height: "iconSmall",
                      mr: "xsmall",
                      width: "iconSmall",
                    }}
                  />
                  Supprimer ce bloc de références
                </Button>
              </Flex>
              <div>
                <Flex sx={{ justifyContent: "flex-start" }}>
                  <Label
                    sx={{
                      alignItems: "center",
                      cursor: "pointer",
                      flex: "0 1 auto",
                      justifyContent: "flex-start",
                      mr: "large",
                      width: "auto",
                    }}
                  >
                    {JURIDIQUES_LABEL}
                    <Radio
                      sx={{ ml: "xxsmall" }}
                      value={JURIDIQUES_LABEL}
                      {...register(`${name}.${index}.label`, {
                        required: {
                          message: "Il faut choisir un type de références",
                          value: true,
                        },
                      })}
                      defaultChecked={block.label === JURIDIQUES_LABEL}
                    />
                  </Label>
                  <Label
                    sx={{
                      alignItems: "center",
                      cursor: "pointer",
                      flex: "0 1 auto",
                      justifyContent: "flex-center",
                      width: "auto",
                    }}
                  >
                    {USEFUL_LINKS_LABEL}
                    <Radio
                      sx={{ ml: "xxsmall" }}
                      value={USEFUL_LINKS_LABEL}
                      {...register(`${name}.${index}.label`, {
                        required: {
                          message: "Il faut choisir un type de références",
                          value: true,
                        },
                      })}
                      defaultChecked={block.label === USEFUL_LINKS_LABEL}
                    />
                  </Label>
                </Flex>
                <FormErrorMessage
                  errors={errors}
                  fieldName={`${name}.${index}.label`}
                />
              </div>
              <References
                nestName={`${name}.${index}.links`}
                control={control}
                register={register}
                errors={errors}
              />
            </Stack>
          </Container>
        ))
      ) : (
        <Button
          type="button"
          size="small"
          variant="secondary"
          outline
          onClick={() => {
            append({ label: JURIDIQUES_LABEL });
          }}
        >
          <IoMdAdd
            sx={{
              height: "iconSmall",

              mr: "xsmall",
              width: "iconSmall",
            }}
          />
          Ajouter ici un bloc de références
        </Button>
      )}
    </>
  );
}