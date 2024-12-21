import express from "express";

import {
  addTeamMember,
  deleteTeamMember,
  getTeamMembers,
  updateTeamMember,
  viewTeamMember,
} from "../controllers/teamMember.controller.js";
import paginationMiddleware from "../middlewares/pagination.middleware.js";
import verifyToken from "../middlewares/verifyToken.js";
import { upload } from "../upload/upload.js";

const teamMemberRouter = express.Router();

teamMemberRouter.get("/team-members", paginationMiddleware, getTeamMembers);
teamMemberRouter.post(
  "/add-team-member",
  verifyToken,
  upload.single("image"),
  addTeamMember
);
teamMemberRouter.delete(
  "/delete-team-member/:id",
  verifyToken,
  deleteTeamMember
);
teamMemberRouter.patch(
  "/update-team-member",
  verifyToken,
  upload.single("image"),
  updateTeamMember
);

teamMemberRouter.get("/view-team-member/:id", verifyToken, viewTeamMember);
export default teamMemberRouter;
