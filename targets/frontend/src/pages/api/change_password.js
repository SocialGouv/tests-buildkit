import Boom from "@hapi/boom";
import Joi from "@hapi/joi";
import { client } from "@shared/graphql-client";
import { hash, verify } from "argon2";
import { createErrorFor } from "src/lib/apiError";

import { sendPasswordChangeConfirmEmail } from "../../lib/emails/passwordChangeConfirm";
import { changeMyPasswordMutation, getOldPassword } from "./password.gql";
import { passwordSchema } from "./validation";

export default async function changePassword(req, res) {
  const apiError = createErrorFor(res);

  if (req.method === "GET") {
    res.setHeader("Allow", ["POST"]);
    return apiError(Boom.methodNotAllowed("GET method not allowed"));
  }

  const schema = Joi.object({
    id: Joi.string().guid({ version: "uuidv4" }).required(),
    oldPassword: Joi.string().required(),
    password: passwordSchema,
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return apiError(Boom.badRequest(error.details[0].message));
  }

  let result = await client
    .query(getOldPassword, {
      id: value.id,
    })
    .toPromise();

  if (result.error) {
    console.error(result.error);
    return apiError(Boom.serverUnavailable("get old password failed"));
  }

  const { user } = result.data;
  if (!user) {
    return apiError(Boom.unauthorized("Invalid id or password"));
  }
  // see if password hashes matches
  const match = await verify(user.password, value.oldPassword);

  if (!match) {
    console.error("old password does not match");
    return apiError(Boom.unauthorized("Invalid id or password"));
  }

  result = await client
    .mutation(changeMyPasswordMutation, {
      id: value.id,
      password: await hash(value.password),
    })
    .toPromise();

  if (result.error) {
    console.error(result.error);
    return apiError(Boom.serverUnavailable("set new password failed"));
  }

  console.log("[change password]", value.id);
  const { email } = user;
  try {
    await sendPasswordChangeConfirmEmail(email);
    console.log("[actions] send password change confirmation email");
    res.json({ message: "email sent!", statusCode: 200 });
  } catch (error) {
    console.error(error);
    console.error(
      `[actions] send lost password change confirmation to ${email} failed`
    );
    apiError(
      Boom.badGateway(
        `[actions] send change confirmation email to ${email} failed`
      )
    );
  }

  res.json({ message: "password updated" });
}
