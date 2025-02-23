import express from 'express';
import { GroupDAO } from "../daos/group.dao";
import { GroupService } from "../services/group.service";
import { GroupController } from "../controllers/group.controller";
import {UserService} from "../services/user.service";
import {UserDAO} from "../daos/user.dao";
import authRoutes from "./auth.routes";
import {authMiddleware} from "../middlewares/auth.middleware";
const router = express.Router();

const userDAO = new UserDAO();
const userService = new UserService(userDAO);

const groupDAO = new GroupDAO();
const groupService = new GroupService(groupDAO, userService);
const groupController = new GroupController(groupService);

router.get("/", groupController.getGroupsData);
router.post("/", authMiddleware, groupController.createGroup);

router.get("/:groupId", groupController.getGroupData);
// router.put("/groups/:groupId", ...);
// router.delete("/groups/:groupId", ...);

// router.post("/groups/:groupId/members", );
// router.delete("/groups/:groupId/members", ...);

// router.get("/groups/:groupId/synchronize", ...);

export default router;