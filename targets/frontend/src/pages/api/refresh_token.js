import Boom from "@hapi/boom";
import { z } from "zod";
import { gqlClient } from "@shared/utils";
import { createErrorFor } from "src/lib/apiError";
import { generateJwtToken } from "src/lib/auth/jwt";
import { getExpiryDate } from "src/lib/duration";
import { v4 as uuidv4 } from "uuid";
import { REFRESH_TOKEN_EXPIRES, JWT_TOKEN_EXPIRES } from "../../config";
import { setJwtCookie } from "src/lib/auth/cookie";
import {
  deletePreviousRefreshTokenMutation,
  getRefreshTokenQuery,
} from "./refresh_token.gql";

export default async function refreshToken(req, res) {
  const apiError = createErrorFor(res);
  try {
    console.log("[api/refresh_token.js] refreshToken");
    const schema = z.object({
      refresh_token: z.string().uuid(),
    });

    let value;

    let { error, data } = schema.safeParse(req.query);

    value = data;

    if (error) {
      const temp = schema.safeParse(req.body);
      error = temp.error;
      value = temp.data;
    }

    if (error) {
      const temp = schema.safeParse(req.cookies);
      error = temp.error;
      value = temp.data;
    }

    if (!value.refresh_token) {
      return apiError(Boom.unauthorized("Invalid 'refresh_token'"));
    }

    const { refresh_token } = value;

    let result = await gqlClient()
      .query(getRefreshTokenQuery, {
        current_timestampz: new Date(),
        refresh_token,
      })
      .toPromise();

    if (result.error) {
      console.error(result.error);
      return apiError(Boom.unauthorized("Invalid 'refresh_token'"));
    }

    if (result.data.refresh_tokens.length === 0) {
      console.error("Incorrect user id or refresh token", refresh_token);
      return apiError(Boom.unauthorized("Invalid 'refresh_token'"));
    }

    const { user } = result.data[`refresh_tokens`][0];

    const new_refresh_token = uuidv4();

    result = await gqlClient()
      .mutation(deletePreviousRefreshTokenMutation, {
        new_refresh_token_data: {
          expires_at: getExpiryDate(REFRESH_TOKEN_EXPIRES),
          refresh_token: new_refresh_token,
          user_id: user.id,
        },
        old_refresh_token: refresh_token,
      })
      .toPromise();

    if (result.error) {
      console.error(result.error);
      return apiError(Boom.unauthorized("Invalid 'refresh_token'"));
    }

    const jwt_token = generateJwtToken(user);

    setJwtCookie(res, new_refresh_token, jwt_token);

    res.json({
      jwt_token,
      jwt_token_expiry: getExpiryDate(JWT_TOKEN_EXPIRES),
      refresh_token: new_refresh_token,
    });
  } catch (e) {
    console.error(e);
    return apiError(Boom.badImplementation(e.message));
  }
}
