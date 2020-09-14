import { withJWT, NextJWTHandler } from "@legacy/with-jwt";
import Config from "@legacy/util/config";
import { methodNotAllowedJWT } from "@legacy/common";
import { getPostHandler, updatePostHandler, removePostHandler } from "@legacy/posts";
import { dbConnect } from "@legacy/util/db";

const handler: NextJWTHandler = async (req, res) => {
  await dbConnect();
  switch (req.method) {
    case "GET": {
      await getPostHandler(req, res);
      break;
    }
    case "PUT": {
      await updatePostHandler(req, res);
      break;
    }
    case "DELETE": {
      await removePostHandler(req, res);
      break;
    }
    default:
      await methodNotAllowedJWT(req, res);
  }
};

export default withJWT(Config.key)(handler);