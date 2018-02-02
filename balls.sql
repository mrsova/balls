-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Фев 02 2018 г., 00:07
-- Версия сервера: 5.7.20
-- Версия PHP: 7.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `balls`
--

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(40) NOT NULL,
  `PlayerName` varchar(150) DEFAULT NULL,
  `DeviceID` text,
  `RegDate` datetime DEFAULT NULL,
  `LastLoginDate` datetime DEFAULT NULL,
  `AccScore` int(40) DEFAULT NULL,
  `BonusData` json DEFAULT NULL,
  `AccMoney` int(40) DEFAULT NULL,
  `GameProgress` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `PlayerName`, `DeviceID`, `RegDate`, `LastLoginDate`, `AccScore`, `BonusData`, `AccMoney`, `GameProgress`) VALUES
(3, '132', '134652', '2018-02-01 00:00:00', '2018-02-01 19:29:30', 40, '{\"Turn\": 30, \"KillOneBall\": 89, \"OneRowSpawn\": 40, \"KillBallsType\": 50}', 40, '{\"0\": 0, \"1\": 0, \"2\": 0, \"3\": 0, \"4\": 0}');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(40) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
