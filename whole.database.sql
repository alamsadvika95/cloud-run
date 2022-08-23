-- MySQL dump 10.13  Distrib 8.0.27, for Linux (x86_64)
--
-- Host: localhost    Database: testing
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `master_wallet`
--

DROP TABLE IF EXISTS `master_wallet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_wallet` (
  `wallet_id` int NOT NULL AUTO_INCREMENT,
  `wallet_name` varchar(100) DEFAULT NULL,
  `wallet_prefix` varchar(50) DEFAULT NULL,
  `initial_balance` double DEFAULT NULL,
  `balance` double DEFAULT NULL,
  `total_balance` double DEFAULT NULL,
  `unit` int DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `expired_date` timestamp NULL DEFAULT NULL,
  `developer_app_id` varchar(50) DEFAULT NULL,
  `developer_app_name` varchar(100) DEFAULT NULL,
  `status` int DEFAULT '1',
  `sms_notification` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wallet_id`),
  UNIQUE KEY `wallet_id_UNIQUE` (`wallet_id`),
  KEY `developer_app_id_IDX` (`developer_app_id`),
  KEY `developer_app_name_IDX` (`developer_app_name`)
) ENGINE=InnoDB AUTO_INCREMENT=491 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_wallet`
--

LOCK TABLES `master_wallet` WRITE;
/*!40000 ALTER TABLE `master_wallet` DISABLE KEYS */;
/*!40000 ALTER TABLE `master_wallet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Alam','Alam','Alam','2022-05-23 06:20:40','2022-05-23 06:20:40'),(2,'Alam','Alam','Alam','2022-05-23 06:20:42','2022-05-23 06:20:42'),(3,'Alam','Alam','Alam','2022-05-23 06:20:43','2022-05-23 06:20:43'),(4,'Alam','Alam','Alam','2022-05-23 06:20:44','2022-05-23 06:20:44');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trans_umb`
--

DROP TABLE IF EXISTS `trans_umb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trans_umb` (
  `id` varchar(50) NOT NULL,
  `msisdn` varchar(100) DEFAULT NULL,
  `msisdn_plain` varchar(25) DEFAULT NULL,
  `content` text,
  `xml_menu` text,
  `trans_id` varchar(45) DEFAULT NULL,
  `client_trans_id` varchar(255) DEFAULT NULL,
  `msg_id` varchar(45) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `status_desc` varchar(255) DEFAULT NULL,
  `user_input` text,
  `seq_no` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `callback_dr_url` varchar(255) DEFAULT NULL,
  `callback_resp` text,
  `callback_resp_code` int DEFAULT NULL,
  `callback_menu_url` varchar(255) DEFAULT NULL,
  `callback_menu_resp` text,
  `callback_menu_resp_code` int DEFAULT NULL,
  `developer_app_name` varchar(50) DEFAULT NULL,
  `dial_code` varchar(100) DEFAULT NULL,
  `sc` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `trans_id_IDX` (`trans_id`),
  KEY `msg_id_IDX` (`msg_id`),
  KEY `trans_umb_client_trans_id_IDX` (`client_trans_id`) USING BTREE,
  KEY `trans_umb_created_IDX` (`created`,`developer_app_name`,`client_trans_id`) USING BTREE,
  KEY `trans_umb_sc_IDX` (`sc`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trans_umb`
--

LOCK TABLES `trans_umb` WRITE;
/*!40000 ALTER TABLE `trans_umb` DISABLE KEYS */;
/*!40000 ALTER TABLE `trans_umb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-08-23 13:58:27
