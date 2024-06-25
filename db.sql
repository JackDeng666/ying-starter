/*
 Navicat Premium Data Transfer

 Source Server         : mysql-test
 Source Server Type    : MySQL
 Source Server Version : 80300 (8.3.0)
 Source Host           : localhost:3306
 Source Schema         : ying_starter

 Target Server Type    : MySQL
 Target Server Version : 80300 (8.3.0)
 File Encoding         : 65001

 Date: 25/06/2024 20:30:27
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for account
-- ----------------------------
DROP TABLE IF EXISTS `account`;
CREATE TABLE `account`  (
  `createAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) NULL DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `provider` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `providerAccountId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `REL_60328bf27019ff5498c4b97742`(`userId` ASC) USING BTREE,
  CONSTRAINT `FK_60328bf27019ff5498c4b977421` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for file
-- ----------------------------
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file`  (
  `createAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) NULL DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('image','video','url') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `from` enum('admin','client') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userId` int NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `url` varchar(2083) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_068984316f2b10a398fcdef59c`(`path` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sys_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission`  (
  `createAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) NULL DEFAULT NULL,
  `sortId` int NULL DEFAULT NULL,
  `label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `parentCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`code`) USING BTREE,
  INDEX `FK_a6440f638c306f2f5f48c4f9343`(`parentCode` ASC) USING BTREE,
  CONSTRAINT `FK_a6440f638c306f2f5f48c4f9343` FOREIGN KEY (`parentCode`) REFERENCES `sys_permission` (`code`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sys_permissions_roles
-- ----------------------------
DROP TABLE IF EXISTS `sys_permissions_roles`;
CREATE TABLE `sys_permissions_roles`  (
  `sysPermissionCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sysRoleId` int NOT NULL,
  PRIMARY KEY (`sysPermissionCode`, `sysRoleId`) USING BTREE,
  INDEX `IDX_32565c4935de2cea2c5d400eec`(`sysPermissionCode` ASC) USING BTREE,
  INDEX `IDX_14a857139aaeadff28baacdfa5`(`sysRoleId` ASC) USING BTREE,
  CONSTRAINT `FK_14a857139aaeadff28baacdfa5b` FOREIGN KEY (`sysRoleId`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_32565c4935de2cea2c5d400eecb` FOREIGN KEY (`sysPermissionCode`) REFERENCES `sys_permission` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `createAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) NULL DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT 1,
  `systemic` tinyint NOT NULL DEFAULT 0,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sort` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sys_roles_users
-- ----------------------------
DROP TABLE IF EXISTS `sys_roles_users`;
CREATE TABLE `sys_roles_users`  (
  `sysRoleId` int NOT NULL,
  `sysUserId` int NOT NULL,
  PRIMARY KEY (`sysRoleId`, `sysUserId`) USING BTREE,
  INDEX `IDX_4a8ea039510f04bb444571a747`(`sysRoleId` ASC) USING BTREE,
  INDEX `IDX_0311a7f85aa7666b7da4588c28`(`sysUserId` ASC) USING BTREE,
  CONSTRAINT `FK_0311a7f85aa7666b7da4588c282` FOREIGN KEY (`sysUserId`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `FK_4a8ea039510f04bb444571a7477` FOREIGN KEY (`sysRoleId`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `createAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) NULL DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `avatarId` int NULL DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT 1,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_38bc8e47cfcaa86adc8669ff72`(`account` ASC) USING BTREE,
  UNIQUE INDEX `REL_a232e3c484cdcf67a0640d3e69`(`avatarId` ASC) USING BTREE,
  CONSTRAINT `FK_a232e3c484cdcf67a0640d3e692` FOREIGN KEY (`avatarId`) REFERENCES `file` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `createAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) NULL DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `emailVerified` tinyint NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `avatarId` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2`(`email` ASC) USING BTREE,
  UNIQUE INDEX `REL_58f5c71eaab331645112cf8cfa`(`avatarId` ASC) USING BTREE,
  CONSTRAINT `FK_58f5c71eaab331645112cf8cfa5` FOREIGN KEY (`avatarId`) REFERENCES `file` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
