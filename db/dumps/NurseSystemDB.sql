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
  `userId` int(11) NOT NULL AUTO_INCREMENT,
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
-- Table structure for table `Bed`
-- This table has information of the instrument and the place where the bed is.

CREATE TABLE `Bed` (
  `bedId` int(11) NOT NULL AUTO_INCREMENT,
  `roomId` int(11) NOT NULL,
  `callerId` int(11) NOT NULL,
  `floorId` int(11) NOT NULL,  
   PRIMARY KEY (`bedId`),
   UNIQUE INDEX (`bedId` ASC)  
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `QRbed`
-- This table has information of the QR of a bed

CREATE TABLE `QRbed` (
  `QRId` int(11) NOT NULL AUTO_INCREMENT,
  `bedId` int(11),
  `QR` varchar (250) NOT NULL,  
   PRIMARY KEY (`QRId`),
   UNIQUE INDEX (`QRId` ASC)  
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `EventsTable`
-- This table has information scheduled events for pacients
--  type parameter can be "oneshot", "daily", "weekly" or "monthly
--

CREATE TABLE `EventsTable` (
  `eventId` int(11) NOT NULL AUTO_INCREMENT,
  `patientId` int(11) NOT NULL,
  `datetime` timestamp NOT NULL,  
  `type` varchar(10) NOT NULL,
  `note` varchar(255),
   PRIMARY KEY (`eventId`),
   UNIQUE INDEX (`eventId` ASC)  
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



--
-- Table structure for table `Notes Table`
-- This table contains the link to the notes for each pacient
--


CREATE TABLE `NotesTable` (
  `notesTableId` int(11) NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`notesTableId`),
  UNIQUE INDEX (`notesTableId` ASC)  
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



--
-- Table Notes
-- This is a simple note for the pacient. Each Note can be in one of two states= "activada", "desactivada"
--

CREATE TABLE `Notes` (
  `notesId` int(11) NOT NULL AUTO_INCREMENT,
  `note` varchar(250),
  `state` varchar(250),
  `notesTableId` int(11) NOT NULL,
  PRIMARY KEY (`notesId`),
  UNIQUE KEY (`notesId` ASC),  
  FOREIGN KEY (`notesTableId`)  REFERENCES NotesTable(notesTableId)       
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for table `Users Table`
-- This table contains the link to the users asociated with each pacient. Usually the users are Medical personnel.
--

CREATE TABLE `UsersTable` (
  `userTableId` int(11) NOT NULL,    
  PRIMARY KEY (`userTableId`),  
  UNIQUE KEY  (`userTableId` ASC)  
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



--
-- Table structure for table `Doctors Table`
-- This table contains the link to the users asociated with each pacient. Usually the users are Medical personnel.
--

CREATE TABLE `MedicalTable` (
  `MedicalTableId` int(11) NOT NULL AUTO_INCREMENT,  
  `userTableId` int(11) NOT NULL,  
  `userId` int(11),
  PRIMARY KEY (`MedicalTableId`),
  UNIQUE KEY (`MedicalTableId` ASC), 
  FOREIGN KEY (`userTableId`) REFERENCES UsersTable(userTableId),  
  FOREIGN KEY (`userId`) REFERENCES User(userId)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `LogEvents`
-- This table contains the all the information of the events
--


CREATE TABLE `NurseSystemDB`.`LogEvents` (
  `logEventId` INT NOT NULL AUTO_INCREMENT ,
   `type` INT NOT NULL ,
   `init` DATETIME NOT NULL ,
   `finish` DATETIME NOT NULL ,
   `patientId` INT NOT NULL ,
   `userId` INT NOT NULL ,
   `Note` VARCHAR(255) NOT NULL ,
   `Note2` VARCHAR(255) NOT NULL ,
    PRIMARY KEY (`logEventId`)) ENGINE = InnoDB;

--
-- Table structure for table `Pacient`
-- This table contains the all the information of the pacient, including id, names, bed, links to medical personnel 's table,
-- and link of notes's table.
--


CREATE TABLE `Patient` (
  `patientId` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `bedId` int(11) ,  
  `notesTableId` int(11),  
  `userTableId` int(11),
  PRIMARY KEY (`patientId`),  
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
  `patientId` varchar(255) NOT NULL,
  `content`varchar(255) NOT NULL,
  `dateTime` timestamp DEFAULT CURRENT_TIMESTAMP ,  
  `audiolink` char(255),  
  `userTableId` int(11),
  PRIMARY KEY (`messageId`)    
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for bed priority
-- 
--

CREATE TABLE `PriorityTable` (
  `lineId` int(11) NOT NULL AUTO_INCREMENT,
  `bedId` int NOT NULL ,
  `priority` INT NULL DEFAULT NULL,
  PRIMARY KEY (`lineId`)   
  ) ENGINE = InnoDB DEFAULT CHARSET=latin1;


--
-- Table structure for showing treatment or specializations
-- 
--

CREATE TABLE `SpecTable` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



--
-- Table structure for showing relations between nurses and treatment
-- 
--

CREATE TABLE `NurseSpecTable` (
  `nurseSpecId` INT NOT NULL AUTO_INCREMENT ,
  `userId` INT NOT NULL ,
  `specId` INT NOT NULL ,
   PRIMARY KEY (`nurseSpecId`)) ENGINE = InnoDB;

--
-- Table structure for showing relations between pacient and treatment
--

CREATE TABLE `PatientSpecTable` (
  `pacientSpecId` INT NOT NULL AUTO_INCREMENT ,
  `patientId` INT NOT NULL ,
   `specId` INT NOT NULL ,
    PRIMARY KEY (`pacientSpecId`)) ENGINE = InnoDB;

--
-- Dumping example data
--
--
-- Dumping data for table `bed`
--

INSERT INTO `Bed` (`roomId`,`callerId`,`floorId`) VALUES
(1, 1,0),
(1, 2,0);



--
-- Dumping data for table `user`
--
INSERT INTO `User` (`username`,`firstname`,`lastname`, `occupation`, `state`, `password`) VALUES
('Josesito','Jose', 'laurm', 'administrador', 1, 1234),
('Arnaldito','Arnaldo',' Alba', 'doctor', 0, 5463),
( 'Carlitos','Carlos',' Car', 'nurse', 1, 1111);

--
-- Dumping data for table `userTable`
--

INSERT INTO `UsersTable` (`userTableId`) VALUES
(1),
(2);



--
-- Dumping data for table `MedicalTable`
--

INSERT INTO `MedicalTable` (`MedicalTableId`,`userTableId`, `userId`) VALUES
(1,1,1),
(2,2,1),
(3,2,2)
;



--
-- Table structure for pacient notes
--
INSERT INTO `Notes` (`note`,`state`,`notesTableId`) VALUES
("dormir a las 22","activa",1),
("tomar remedio a las 12","activa",2);


INSERT INTO `NotesTable` (`notesTableId`) VALUES
(1),
(2);

--
-- Dumping data for table `pacient`
--

INSERT INTO `Patient` (`patientId`, `firstName`,`lastName`,`BedId`,`notesTableId`,`userTableId`) VALUES
(1, "Pedro","Pasculli",1,1,1 ),
(2, "Oscar", "Rugger",2,1,2);



INSERT INTO `Messages` (`messageId`, `userIdLastName`, `userIdSender`, `patientId`, `content`, `dateTime`, `audiolink`, `userTableId`) VALUES ('1', '1', '1', '1', 'Se levanto bien', CURRENT_TIMESTAMP, NULL, '1');



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
