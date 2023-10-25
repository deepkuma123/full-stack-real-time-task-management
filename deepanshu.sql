-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 24, 2023 at 09:26 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kumar`
--

-- --------------------------------------------------------

--
-- Table structure for table `statuses`
--

CREATE TABLE `statuses` (
  `status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `statuses`
--

INSERT INTO `statuses` (`status_id`, `status_name`) VALUES
(1, 'Not Started'),
(2, 'In Progress'),
(3, 'Completed');

-- --------------------------------------------------------

--
-- Table structure for table `task_list`
--

CREATE TABLE `task_list` (
  `id` int(30) NOT NULL,
  `project_id` int(30) NOT NULL,
  `task` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(400) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `task_list`
--

INSERT INTO `task_list` (`id`, `project_id`, `task`, `description`, `status`, `date_created`, `user_id`) VALUES
(13, 0, 'admin', 'this is me ', 'In Progress', '2023-10-23 11:11:04', 16),
(14, 0, 'task 5', 'deepak', 'Completed', '2023-10-23 11:14:46', 9),
(15, 0, 'akdsfp', 'fashdfuwdsfawhd', 'Not Started', '2023-10-23 11:44:03', 9),
(16, 0, 'task 1', 'fa,ds fn', 'Completed', '2023-10-23 13:22:53', 9),
(17, 0, 'task 4', 'deepak', 'In Progress', '2023-10-23 13:23:19', 9),
(18, 0, 'task 1', 'afdsnfaj', 'Not Started', '2023-10-23 13:28:44', 9),
(19, 0, 'task 9', 'fa,msd fn', 'Not Started', '2023-10-23 13:30:02', 17),
(20, 0, 'deepa', 'fa,mdsnfnkndv', 'Not Started', '2023-10-23 13:55:09', 13),
(21, 0, 'task 3', 'fadsk,jn', 'Not Started', '2023-10-23 13:57:29', 9),
(22, 0, 'afds', 'fmasdn', 'Not Started', '2023-10-23 14:00:51', 9),
(23, 0, 'task 90', 'a,kfndsj;fmaklsdnf', 'Not Started', '2023-10-23 14:03:47', 9),
(24, 0, 'task 8', 'this is you', 'Not Started', '2023-10-23 20:31:54', 9),
(25, 0, 'task 8', 'this is not you', 'In Progress', '2023-10-23 20:32:29', NULL),
(26, 0, 'task 9', 'test', 'In Progress', '2023-10-24 02:34:19', 11);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(30) NOT NULL,
  `firstname` varchar(200) NOT NULL,
  `lastname` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` text NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT 2 COMMENT '1 = admin, 2 = staff',
  `avatar` text NOT NULL DEFAULT 'no-image-available.png',
  `date_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `email`, `password`, `type`, `avatar`, `date_created`) VALUES
(9, 'deepak', 'kumar', 'deepkuma3214@gamil.com', '$2b$10$0JQE5FjdZGRgN6fvP5daVuFhKsryCwF0Xa0h6ftR.yw7x0sb5/U0W', 1, 'no-image-available.png', '2023-10-21 23:55:15'),
(10, 'deepak', 'kumar', 'deepanshu.kumar.cse.2020@miet.ac.in', '$2b$10$7upTPghA9OkhOKHvujb2Q.W8c1wfti4/x.SNWBn1vabPTWnZKnYEe', 2, 'no-image-available.png', '2023-10-22 01:59:33'),
(11, 'deepa', 'kum', 'kumadeep3214@gmail.com', '$2b$10$uaBF/fHFdQLehl.0Fr7xUOv5TeNxYJReHafBwFqWBZIfbFOKHPnJi', 2, 'no-image-available.png', '2023-10-22 01:59:55'),
(12, 'deepak', 'hum', 'admin@gmail.com', '$2b$10$YPzCbui7SCsaNJCIEfwHFemUk.3L34fvM1Ute/1ZDvgi5hkYPQBaq', 1, 'no-image-available.png', '2023-10-22 02:38:41'),
(13, 'asadca', 'la,d', 'deepl@gmail.com', '$2b$10$3GBpp4rrUz9/OOJSMXY5/O3C7wGfPFxGWcXpbiOicuArz4sqegxTW', 2, 'no-image-available.png', '2023-10-22 14:53:44'),
(14, 'vijay', 'kumar', 'deepak@kum.com', '$2b$10$Lg835GWDsIHj/PtcvVoo3.zGECrK.s0E4F1DMyPLo2fRtAOa8H/Ii', 2, 'no-image-available.png', '2023-10-24 16:52:29'),
(15, 'manku', 'yadav', 'admin@admin.com', '$2b$10$sam14ZmLwSuMrOTIraYW1OCCBddVr4UV6fVcA9M71xq1aDM22WlZ.', 2, 'no-image-available.png', '2023-10-24 17:22:21'),
(16, 'ankit', 'kumar', 'deepak@kumar.com', '$2b$10$0MQqpUvz/z0RV5d0Zd56ieV4PC3C0E1GH6ofp9W4Yh.Gh6G.ERGsy', 2, 'no-image-available.png', '2023-10-24 18:18:26'),
(17, 'kumar', 'sanu', 'deepak.verma.cse.2020@miet.ac.in', '$2b$10$D94hqGzPY2eVt5ELZdqse.GCk3N9wWnz23M/We77wdkxoaX1u1iqW', 2, 'no-image-available.png', '2023-10-24 18:20:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `statuses`
--
ALTER TABLE `statuses`
  ADD PRIMARY KEY (`status_id`);

--
-- Indexes for table `task_list`
--
ALTER TABLE `task_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `statuses`
--
ALTER TABLE `statuses`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `task_list`
--
ALTER TABLE `task_list`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `task_list`
--
ALTER TABLE `task_list`
  ADD CONSTRAINT `task_list_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
