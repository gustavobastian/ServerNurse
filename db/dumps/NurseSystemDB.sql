-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 26, 2019 at 02:50 PM
-- Server version: 5.7.26-0ubuntu0.16.04.1
-- PHP Version: 7.0.33-0ubuntu0.16.04.4

CREATE DATABASE IF NOT EXISTS NurseSystemDB;

USE NurseSystemDB;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `NurseSystemDB`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `User` (
  `id` int(11) NOT NULL,
  `username` varchar(64) NOT NULL,
  `firstname` varchar(64) NOT NULL,
  `lastname` varchar(64) NOT NULL,
  `occupation` varchar(128) NOT NULL,
  `state` int(11) NOT NULL,
  `password` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Dumping data for table `user`
--

INSERT INTO `User` (`id`, `username`,`firstname`,`lastname`, `occupation`, `state`, `password`) VALUES
(1, 'Josesito','Jose', 'laurm', 'administrador', 1, 1234),
(2, 'Arnaldito','Arnaldo',' Alba', 'médico', 0, 5463),
(3, 'Brunito','Bruno',' Bele', 'médico', 1, 6789),
(4, 'Carlitos','Carlos',' Car', 'enfermero', 1, 1111),
(5, 'Damiancito','Damian',' Desantics', 'enfermero', 1, 2222),
(6, 'Ernestinita','Ernestina',' Esmeralda', 'enfermera', 0, 3333);
--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`);

--
-- Table structure for table `bed`
--

CREATE TABLE `bed` (
  `id` int(11) NOT NULL,
  `roomId` int(11) NOT NULL,
  `callerId` int(11) NOT NULL,
  `floorId` int(11) NOT NULL,  
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Dumping data for table `bed`
--

INSERT INTO `bed` (`id`, `roomId`,`callerId`,`floorId`) VALUES
(1, 1, 1,0),
(2, 1, 2,0),
(3, 2, 3,0),
(4, 2, 4,0),
(5, 3, 5,0),
(6, 3, 6,0);
ALTER TABLE `bed`
  ADD PRIMARY KEY (`id`);


--
-- Table structure for table `Pacient`
--

CREATE TABLE `Pacient` (
  `id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `bedId` int(11) NOT NULL,  
  `notes` varchar(255) NOT NULL,  
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Dumping data for table ``
--

INSERT INTO `Pacient` (`id`, `roomId`,`callerId`,`floorId`,`notes`) VALUES
(1, "Pedro","Pasculli",1,`` ),
(2, "Oscar", "Rugger",2,``),
(3, "Diego", "Armando",3,``),
(4, "Hector", "Almandoz",4,``),
(5, "Adalberto", "Minapolo",5,``),
(6, "Jupiano", "Saturnito",6,``);
ALTER TABLE `Pacient`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for dumped tables
--


--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Devices`
--
ALTER TABLE `NurseSystemDB`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
