import express from 'express';
import { GroupDAO } from "../daos/group.dao";
import { GroupService } from "../services/group.service";
import { GroupController } from "../controllers/group.controller";
import {UserService} from "../services/user.service";
import {UserDAO} from "../daos/user.dao";
import authRoutes from "./auth.routes";
import {authenticateUser} from "../middlewares/auth.middleware";
const router = express.Router();

const userDAO = new UserDAO();
const userService = new UserService(userDAO);

const groupDAO = new GroupDAO();
const groupService = new GroupService(groupDAO, userService);
const groupController = new GroupController(groupService);

router.get("/", authenticateUser, groupController.getGroupsData);
router.post("/", authenticateUser, groupController.createGroup);

router.get("/:groupID", authenticateUser, groupController.getGroupData);
router.delete("/:groupID", authenticateUser, groupController.deleteGroup);

router.post("/:groupID/members", authenticateUser, groupController.addGroupMember);
router.delete("/:groupID/members/:userID", authenticateUser, groupController.deleteGroupMember);

// router.get("/groups/:groupId/synchronize", ...);

export default router;