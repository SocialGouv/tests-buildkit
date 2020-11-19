/** @jsx jsx  */

import Link from "next/link";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { Button } from "src/components/button";
import { ContentPicker } from "src/components/forms/ContentPicker/index";
import { FormErrorMessage } from "src/components/forms/ErrorMessage";
import { IconPicker } from "src/components/forms/IconPicker";
import { Field, Flex, jsx, Label, NavLink, Textarea } from "theme-ui";

const ThemeForm = ({ parentId, onSubmit, loading = false, theme = {} }) => {
  const { control, register, handleSubmit, errors } = useForm();
  const hasError = Object.keys(errors).length > 0;
  let buttonLabel = "Créer";
  let backLink = `/themes`;
  if (theme.cdtnId) {
    buttonLabel = "Enregistrer les changements";
    backLink += `/${theme.cdtnId}`;
  } else if (parentId) {
    backLink += `/${parentId}`;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <>
        <div sx={{ mb: "small" }}>
          <Field
            type="text"
            name="title"
            label="Titre"
            defaultValue={theme.title}
            ref={register({
              required: { message: "Ce champ est requis", value: true },
            })}
          />
          <FormErrorMessage errors={errors} fieldName="title" />
        </div>

        <div sx={{ mb: "small" }}>
          <Field
            type="text"
            name="shortTitle"
            label="Titre court"
            defaultValue={theme.document?.shortTitle}
            ref={register}
          />
        </div>

        <div sx={{ mb: "small" }}>
          <Field
            type="text"
            name="metaDescription"
            label="Meta description (référencement)"
            defaultValue={theme.metaDescription}
            ref={register}
          />
        </div>

        <div sx={{ mb: "small" }}>
          <Label htmlFor={"description"}>Description</Label>
          <Textarea
            name="description"
            id="description"
            rows={5}
            defaultValue={theme.document?.description}
            ref={register}
          />
        </div>

        <div sx={{ mb: "small" }}>
          <Label htmlFor={"icon"}>Icône</Label>
          <IconPicker
            control={control}
            name="icon"
            id="icon"
            defaultValue={theme.document?.icon}
          />
        </div>

        <div sx={{ my: "larger" }}>
          <h2>Contenus du thème</h2>
          <ContentPicker
            control={control}
            name="contents"
            id="contents"
            defaultValue={
              (theme.contentRelations &&
                theme.contentRelations
                  .sort(({ position: a }, { position: b }) => a - b)
                  .map(({ relationId, content }) => ({
                    relationId,
                    ...content,
                  }))) ||
              []
            }
          />
        </div>

        <Flex sx={{ alignItems: "center", mt: "medium" }}>
          <Button variant="secondary" disabled={hasError || loading}>
            {buttonLabel}
          </Button>
          <Link href="/themes/[[...id]]" as={backLink} passHref>
            <NavLink sx={{ ml: "medium" }}>Annuler</NavLink>
          </Link>
        </Flex>
      </>
    </form>
  );
};

ThemeForm.propTypes = {
  loading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  parentId: PropTypes.string,
  theme: PropTypes.object,
};

export { ThemeForm };

// TODO instead of disabling the field when not admin, simply display the value
const DisplayValue = ({ children, label }) => (
  <div sx={{ m: "small" }}>
    <div sx={{ fontWeight: "bold", mb: "xxsmall" }}>{label} :</div>
    <div
      sx={{
        bg: "highlight",
        borderRadius: "small",
        display: "inline-block",
        p: "small",
      }}
    >
      {children}
    </div>
  </div>
);

DisplayValue.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
};