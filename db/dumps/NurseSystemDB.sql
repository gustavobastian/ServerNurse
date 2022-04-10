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
-- This is the main table with user information, the password is char(60) for use with BCrypt hash.
--

CREATE TABLE `User` (
  `userId` int(11) NOT NULL,
  `username` varchar(64) NOT NULL,
  `firstname` varchar(64) NOT NULL,
  `lastname` varchar(64) NOT NULL,
  `occupation` varchar(128) NOT NULL,
  `state` int(11) NOT NULL,
  `password` char(60) NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE INDEX (`userId` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `bed`
-- This table has information of the instrument and the place where the bed is.

CREATE TABLE `Bed` (
  `bedId` int(11) NOT NULL ,
  `roomId` int(11) NOT NULL,
  `callerId` int(11) NOT NULL,
  `floorId` int(11) NOT NULL,  
   PRIMARY KEY (`bedId`),
   UNIQUE INDEX (`bedId` ASC)  
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



--
-- Table Notes
-- This is a simple note for the pacient. Each Note can be in one of three states= "inUse", "old", "sometimes"
--

CREATE TABLE `Notes` (
  `notesId` int(11) NOT NULL,
  `note` varchar(250),
  `state` varchar(250),
  PRIMARY KEY (`notesId`),
  UNIQUE KEY (`notesId` ASC)   
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `Notes Table`
-- This table contains the link to the notes for each pacient
--


CREATE TABLE `NotesTable` (
  `notesTableId` int(11) NOT NULL,
  `noteId` int(11),
  PRIMARY KEY (`notesTableId`),
  UNIQUE INDEX (`notesTableId` ASC),
  FOREIGN KEY (`noteId`)  REFERENCES Notes(notesId)       
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `Users Table`
-- This table contains the link to the users asociated with each pacient. Usually the users are Medical personnel.
--

CREATE TABLE `UsersTable` (
  `userTableId` int(11) NOT NULL,  
  `userId` int(11),
  PRIMARY KEY (`userTableId`),  
  UNIQUE KEY  (`userTableId` ASC),
  FOREIGN KEY (`userId`) REFERENCES User(userId)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `Pacient`
-- This table contains the all the information of the pacient, including id, names, bed, links to medical personnel 's table,
-- and link of notes's table.
--


CREATE TABLE `Pacient` (
  `pacientId` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `bedId` int(11) ,  
  `notesTableId` int(11) NOT NULL,  
  `userTableId` int(11) NOT NULL,
  PRIMARY KEY (`pacientId`),  
  FOREIGN KEY (`bedId`)  REFERENCES Bed(bedId), 
  FOREIGN KEY (`notesTableId`)  REFERENCES NotesTable(notesTableId),   
  FOREIGN KEY (`userTableId`)  REFERENCES UsersTable(userTableId)   
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



--
-- Table structure for messages
-- This table contains the all the information between personnel and devices to systems, including link's to stored audio files.
--


CREATE TABLE `Messages` (
  `messageId` int(11) NOT NULL,
  `userIdLastName` varchar(255) NOT NULL,
  `userIdSender` int(255) NOT NULL,
  `pacientId` varchar(255) NOT NULL,
  `content`varchar(255) NOT NULL,
  `dateTime` timestamp DEFAULT CURRENT_TIMESTAMP ,  
  `audiolink` char(255),  
  `userTableId` int(11),
  PRIMARY KEY (`messageId`)    
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Dumping example data
--


--
-- Dumping data for table `bed`
--

INSERT INTO `Bed` (`bedId`, `roomId`,`callerId`,`floorId`) VALUES
(1, 1, 1,0),
(2, 1, 2,0);



--
-- Dumping data for table `user`
--
INSERT INTO `User` (`userId`, `username`,`firstname`,`lastname`, `occupation`, `state`, `password`) VALUES
(1, 'Josesito','Jose', 'laurm', 'administrador', 1, 1234),
(2, 'Arnaldito','Arnaldo',' Alba', 'médico', 0, 5463),
(3, 'Carlitos','Carlos',' Car', 'enfermero', 1, 1111);



--
-- Table structure for pacient notes
--
INSERT INTO `Notes` (`notesId`, `note`,`state`) VALUES
(1,"dormir a las 22","activa"),
(2,"tomar remedio a las 12","activa");

--
-- Dumping data for table `userTable`
--

INSERT INTO `UsersTable` (`userTableId`, `userId`) VALUES
(1,1),
(2,1);


INSERT INTO `NotesTable` (`notesTableId`, `noteId`) VALUES
(1,1),
(2,2);
--
-- Dumping data for table `pacient`
--

INSERT INTO `Pacient` (`pacientId`, `firstName`,`lastName`,`BedId`,`notesTableId`,`userTableId`) VALUES
(1, "Pedro","Pasculli",1,1,1 ),
(2, "Oscar", "Rugger",2,1,2);








--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Devices`
--
/*
ALTER TABLE `NurseSystemDB`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;
*/
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
