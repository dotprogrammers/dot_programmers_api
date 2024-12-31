import express from "express";
import multer from "multer";
import {
  getOurTeamMember,
  updateOurTeamMember,
} from "../controllers/ourTeamMember.controller.js";

const upload = multer();
const ourTeamMemberRouter = express.Router();

ourTeamMemberRouter.get("/our-team-member", getOurTeamMember);
ourTeamMemberRouter.patch(
  "/update-our-team-member",
  upload.none(),
  updateOurTeamMember
);

export default ourTeamMemberRouter;
