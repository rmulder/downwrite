import * as Hapi from "hapi";
import * as Boom from "boom";
import * as uuid from "uuid/v4";
import * as bcrypt from "bcrypt";
import * as sanitized from "@charliewilco/sanitize-object";
import { UserModel as User, IUser } from "../models/User";
import { createToken } from "../util/token";

import { IRequest, IRegisterRequest, ILoginRequest } from "./types";

export const createUser = async (
  request: IRegisterRequest,
  h: Hapi.ResponseToolkit
) => {
  const { email, username, password } = request.payload;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const id = uuid();

  const doc = Object.assign(
    {},
    { email, username, id, password: hash, admin: false }
  );

  try {
    let user: IUser = await User.create(doc);
    let token = createToken(user);

    return h
      .response({
        userID: user.id,
        id_token: token,
        username: user.username
      })
      .code(201);
  } catch (error) {
    return Boom.badImplementation(error);
  }
};

export const authenticateUser = (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  return h.response({ token: createToken(request.pre.user) }).code(201);
};

export const getDetails = async (
  request: IRequest,
  h: Hapi.ResponseToolkit
): Promise<IUser> => {
  const { user } = request.auth.credentials;

  const foundUser = await User.findById(user, ["username", "email"]).lean();

  return foundUser;
};

export const verifyUniqueUser = async (request: IRegisterRequest) => {
  const user: IUser = await User.findOne({
    $or: [{ email: request.payload.email }, { username: request.payload.username }]
  });

  if (user) {
    if (user.username === request.payload.username) {
      return Boom.badRequest("Username taken");
    }
    if (user.email === request.payload.email) {
      return Boom.badRequest("Email taken");
    }
  }

  return request.payload;
};

export const verifyCredentials = async (request: ILoginRequest) => {
  const password = request.payload.password;

  const user = await User.findOne({
    $or: [{ email: request.payload.user }, { username: request.payload.user }]
  });

  if (user) {
    const isValid = await bcrypt.compare(password, user.password);

    return isValid ? user : Boom.badRequest("Incorrect password!");
  } else {
    return Boom.badRequest("Incorrect username or email!");
  }
};
