-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 24, 2022 at 12:16 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `haitoko`
--

-- --------------------------------------------------------

--
-- Table structure for table `detail_invoice`
--

CREATE TABLE `detail_invoice` (
  `id` varchar(50) NOT NULL,
  `invoice_id` varchar(50) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `amount` double NOT NULL,
  `total` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `detail_invoice`
--

INSERT INTO `detail_invoice` (`id`, `invoice_id`, `product_id`, `created_at`, `amount`, `total`) VALUES
('0aa866f4-dbb2-4dde-a432-de0e14959f91', '8833ea37-7fe6-40c3-8fe3-f22bb0435c74', 'e785605e-0131-4b63-b765-470a6d597df0', '2022-04-24 10:15:21', 5, 20000),
('0ac268e0-70ed-44cb-b97e-c9dd3460b77e', 'e8fe3fe6-36ae-4412-8dc4-926d5e79456f', '7cc7cf28-2303-4dce-92f5-045a62118245', '2022-04-24 08:10:20', 5, 20000),
('1c79938c-dca7-4127-8435-956954e72f8a', 'f678b61c-d270-4a5b-880a-18c5087b286f', 'e785605e-0131-4b63-b765-470a6d597df0', '2022-04-24 08:41:23', 5, 20000),
('2f9e7fd7-5aeb-4e6a-a249-4d49cbd2a3d4', 'f678b61c-d270-4a5b-880a-18c5087b286f', '7cc7cf28-2303-4dce-92f5-045a62118245', '2022-04-24 08:41:23', 5, 20000),
('3fe77cd2-c957-4b0d-b69c-e169964bc1b5', '8833ea37-7fe6-40c3-8fe3-f22bb0435c74', '7cc7cf28-2303-4dce-92f5-045a62118245', '2022-04-24 10:15:21', 5, 20000),
('596932aa-a55e-46db-91aa-d64eab1f7755', '40cc3d9e-aa41-47db-8b68-ae9d7f81d089', 'e785605e-0131-4b63-b765-470a6d597df0', '2022-04-24 08:42:53', 5, 20000),
('5d2ecc70-cb8d-4c6d-a2f3-5e667e05b49d', '0431842e-7fb6-4192-a4db-5f38e5de9e54', 'e785605e-0131-4b63-b765-470a6d597df0', '2022-04-24 10:13:48', 5, 20000),
('941235de-08b6-496f-833a-b67725e16024', '5387f9fb-80dd-45ee-aadc-a2944d042398', 'e785605e-0131-4b63-b765-470a6d597df0', '2022-04-24 08:34:36', 5, 20000),
('9c281767-2c96-4173-8ff0-5cd11bcad80d', '5387f9fb-80dd-45ee-aadc-a2944d042398', '7cc7cf28-2303-4dce-92f5-045a62118245', '2022-04-24 08:34:36', 5, 20000),
('a03e891a-848e-4ae0-9b7d-8629b01459c8', '1ac4b742-0ec6-43bb-993a-89981f50eec2', '7cc7cf28-2303-4dce-92f5-045a62118245', '2022-04-24 08:22:39', 5, 20000),
('b71bc551-91a6-43f9-8962-9959c3d3a730', '1ac4b742-0ec6-43bb-993a-89981f50eec2', 'e785605e-0131-4b63-b765-470a6d597df0', '2022-04-24 08:22:39', 5, 20000),
('c2721e21-cadd-41b3-ad9d-c6aa8dc74b33', 'e8fe3fe6-36ae-4412-8dc4-926d5e79456f', 'e785605e-0131-4b63-b765-470a6d597df0', '2022-04-24 08:10:20', 5, 20000),
('ddd3829b-4ef8-47a3-b374-ba0a3b84f685', '0431842e-7fb6-4192-a4db-5f38e5de9e54', '7cc7cf28-2303-4dce-92f5-045a62118245', '2022-04-24 10:13:48', 5, 20000),
('fb6096e3-944c-4769-9fae-c313e69404ef', '40cc3d9e-aa41-47db-8b68-ae9d7f81d089', '7cc7cf28-2303-4dce-92f5-045a62118245', '2022-04-24 08:42:53', 5, 20000);

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `id` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `invoice_no` varchar(100) NOT NULL,
  `invoice_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `invoice_total` double NOT NULL,
  `invoice_status` varchar(100) NOT NULL,
  `created_by` varchar(50) NOT NULL,
  `fee_nominal` double DEFAULT NULL,
  `invoice_bank_info` varchar(50) DEFAULT NULL,
  `invoice_paid_at` timestamp NULL DEFAULT NULL,
  `fee_change` double DEFAULT NULL,
  `invoice_no_ext` text DEFAULT NULL,
  `invoice_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`id`, `created_at`, `invoice_no`, `invoice_date`, `invoice_total`, `invoice_status`, `created_by`, `fee_nominal`, `invoice_bank_info`, `invoice_paid_at`, `fee_change`, `invoice_no_ext`, `invoice_url`) VALUES
('0431842e-7fb6-4192-a4db-5f38e5de9e54', '2022-04-24 10:13:48', 'INV-1650795228334', '2022-04-24 10:13:48', 20000, 'PAID', 'b9f0421f-0fcd-4e51-852e-20716e209bca', 100000, 'CASH', '2022-04-24 10:13:48', 80000, NULL, NULL),
('1ac4b742-0ec6-43bb-993a-89981f50eec2', '2022-04-24 08:22:39', 'INV-1650788559422', '2022-04-24 08:22:39', 20000, 'PAID', 'b9f0421f-0fcd-4e51-852e-20716e209bca', 100000, 'CASH', '2022-04-24 08:22:39', 60000, NULL, NULL),
('40cc3d9e-aa41-47db-8b68-ae9d7f81d089', '2022-04-24 08:42:53', 'INV-1650789773424', '2022-04-24 08:42:53', 20000, 'PAID', 'b9f0421f-0fcd-4e51-852e-20716e209bca', 100000, 'CASH', '2022-04-24 08:42:53', NULL, NULL, NULL),
('5387f9fb-80dd-45ee-aadc-a2944d042398', '2022-04-24 08:34:36', 'INV-1650789276416', '2022-04-24 08:34:36', 20000, 'PAID', 'b9f0421f-0fcd-4e51-852e-20716e209bca', 100000, 'CASH', '2022-04-24 08:34:36', 20000, NULL, NULL),
('8833ea37-7fe6-40c3-8fe3-f22bb0435c74', '2022-04-24 10:15:44', 'INV-1650795318739', '2022-04-24 10:15:21', 20000, 'PAID', 'b9f0421f-0fcd-4e51-852e-20716e209bca', NULL, 'BNI', '2022-04-24 10:15:44', NULL, 'INV-16507953187390', 'https://checkout-staging.xendit.co/web/62652338f934347e0b30889a'),
('e8fe3fe6-36ae-4412-8dc4-926d5e79456f', '2022-04-24 08:11:58', 'INV-1650787818099', '2022-04-24 08:10:20', 40000, 'PAID', 'b9f0421f-0fcd-4e51-852e-20716e209bca', NULL, 'BCA', '2022-04-24 08:11:58', NULL, 'INV-16507878180990', 'https://checkout-staging.xendit.co/web/626505eb1ff64d92aad32cd3'),
('f678b61c-d270-4a5b-880a-18c5087b286f', '2022-04-24 08:41:23', 'INV-1650789683120', '2022-04-24 08:41:23', 20000, 'PAID', 'b9f0421f-0fcd-4e51-852e-20716e209bca', 100000, 'CASH', '2022-04-24 08:41:23', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` varchar(50) NOT NULL,
  `category_id` varchar(50) NOT NULL,
  `created_by` varchar(50) NOT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `product_name` text NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `price` double NOT NULL DEFAULT 0,
  `discount` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `category_id`, `created_by`, `updated_by`, `created_at`, `deleted_at`, `product_name`, `stock`, `price`, `discount`) VALUES
('7cc7cf28-2303-4dce-92f5-045a62118245', '61560e88-df0f-4b16-8c92-51815580431b', 'b9f0421f-0fcd-4e51-852e-20716e209bca', NULL, '2022-04-24 08:06:21', NULL, 'TARO', 40, 4000, 30),
('e785605e-0131-4b63-b765-470a6d597df0', '61560e88-df0f-4b16-8c92-51815580431b', 'b9f0421f-0fcd-4e51-852e-20716e209bca', NULL, '2022-04-24 08:05:23', NULL, 'INDOMIE GORENG', 40, 4000, 20),
('f6d0654f-20cc-440f-bb03-17e24ee69625', '61560e88-df0f-4b16-8c92-51815580431b', 'b9f0421f-0fcd-4e51-852e-20716e209bca', NULL, '2022-04-24 08:05:36', NULL, 'INDOMIE KUAH', 40, 4000, 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_category`
--

CREATE TABLE `product_category` (
  `id` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(50) NOT NULL,
  `updated_by` varchar(50) DEFAULT NULL,
  `category_name` varchar(150) NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_category`
--

INSERT INTO `product_category` (`id`, `created_at`, `created_by`, `updated_by`, `category_name`, `deleted_at`) VALUES
('43907bec-fb82-44d3-8faf-293b51e2eb02', '2022-04-24 08:03:19', 'b9f0421f-0fcd-4e51-852e-20716e209bca', NULL, 'Minuman', NULL),
('61560e88-df0f-4b16-8c92-51815580431b', '2022-04-24 08:03:09', 'b9f0421f-0fcd-4e51-852e-20716e209bca', NULL, 'Makanan', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `troli`
--

CREATE TABLE `troli` (
  `id` varchar(50) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `created_by` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(50) DEFAULT NULL,
  `amount` double NOT NULL,
  `total` double NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'DRAFT',
  `invoice_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `troli`
--

INSERT INTO `troli` (`id`, `product_id`, `created_by`, `created_at`, `updated_by`, `amount`, `total`, `status`, `invoice_id`) VALUES
('2d10855e-d11a-4e9d-a520-be4723c31471', '7cc7cf28-2303-4dce-92f5-045a62118245', 'b9f0421f-0fcd-4e51-852e-20716e209bca', '2022-04-24 08:07:44', NULL, 5, 20000, 'PAID', '8833ea37-7fe6-40c3-8fe3-f22bb0435c74'),
('eb50f785-9c84-4545-b20c-c0c524cf0e75', 'e785605e-0131-4b63-b765-470a6d597df0', 'b9f0421f-0fcd-4e51-852e-20716e209bca', '2022-04-24 08:08:09', NULL, 5, 20000, 'PAID', '8833ea37-7fe6-40c3-8fe3-f22bb0435c74');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(50) NOT NULL,
  `name` varchar(200) NOT NULL,
  `password` text NOT NULL,
  `gender` varchar(2) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `role` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `refresh_token` text DEFAULT NULL,
  `email` text NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `password`, `gender`, `phone_number`, `role`, `created_at`, `refresh_token`, `email`, `deleted_at`) VALUES
('b9f0421f-0fcd-4e51-852e-20716e209bca', 'admin', '827ccb0eea8a706c4c34a16891f84e7b', 'L', '90809090', 'Administrator', '2022-04-24 07:56:01', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJxdWVyeUxvZ2luIjp7ImlkIjoiYjlmMDQyMWYtMGZjZC00ZTUxLTg1MmUtMjA3MTZlMjA5YmNhIiwibmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiI4MjdjY2IwZWVhOGE3MDZjNGMzNGExNjg5MWY4NGU3YiIsImdlbmRlciI6IkwiLCJwaG9uZV9udW1iZXIiOiI5MDgwOTA5MCIsInJvbGUiOiJBZG1pbmlzdHJhdG9yIiwiY3JlYXRlZF9hdCI6IjIwMjItMDQtMjRUMDc6NTY6MDEuMDAwWiIsInJlZnJlc2hfdG9rZW4iOm51bGwsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJkZWxldGVkX2F0IjpudWxsfSwiaWF0IjoxNjUwNzg3MzY0LCJleHAiOjE2NTA4NzM3NjR9.rhhB-9zYEe-ngwgUzZOmJL3O2SfnDCLYXWeynqqhSPE', 'admin@example.com', NULL),
('df58622b-7910-420d-9703-1738ddcf8e25', 'stringbuyer', '7ef6156c32f427d713144f67e2ef14d2', 'L', '332323', 'Buyer', '2022-04-24 07:56:36', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJxdWVyeUxvZ2luIjp7ImlkIjoiZGY1ODYyMmItNzkxMC00MjBkLTk3MDMtMTczOGRkY2Y4ZTI1IiwibmFtZSI6ImJ1eWVyIiwicGFzc3dvcmQiOiI4MjdjY2IwZWVhOGE3MDZjNGMzNGExNjg5MWY4NGU3YiIsImdlbmRlciI6IkwiLCJwaG9uZV9udW1iZXIiOiI5MDgwOTA5MCIsInJvbGUiOiJCdXllciIsImNyZWF0ZWRfYXQiOiIyMDIyLTA0LTI0VDA3OjU2OjM2LjAwMFoiLCJyZWZyZXNoX3Rva2VuIjpudWxsLCJlbWFpbCI6ImJ1eWVyQGV4YW1wbGUuY29tIiwiZGVsZXRlZF9hdCI6bnVsbH0sImlhdCI6MTY1MDc4NzA1NywiZXhwIjoxNjUwODczNDU3fQ.ZDSRCY-DFiTGOVBM-4tEne6XCg9isZjTBOPEIedPhew', 'buyer@example.com', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_invoice`
--
ALTER TABLE `detail_invoice`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_category`
--
ALTER TABLE `product_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `troli`
--
ALTER TABLE `troli`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_invoice`
--
ALTER TABLE `detail_invoice`
  ADD CONSTRAINT `detail_invoice_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `detail_invoice_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `invoice_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `product_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `product_category` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `product_category`
--
ALTER TABLE `product_category`
  ADD CONSTRAINT `product_category_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `product_category_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `troli`
--
ALTER TABLE `troli`
  ADD CONSTRAINT `troli_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `troli_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `troli_ibfk_3` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
