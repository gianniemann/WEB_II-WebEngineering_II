CREATE DATABASE IF NOT EXISTS gtc;
USE gtc;

DROP TABLE IF EXISTS `transaction`;
DROP TABLE IF EXISTS `rate`;
DROP TABLE IF EXISTS `currency`;
DROP TABLE IF EXISTS `user`;

CREATE TABLE `currency` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `iso_code` VARCHAR(10) NOT NULL UNIQUE,
    `name` VARCHAR(120) NOT NULL,
    `countries` TEXT NOT NULL
);

CREATE TABLE `rate` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `base_currency` VARCHAR(10) NOT NULL,
    `target_currency` VARCHAR(10) NOT NULL,
    `rate_value` DECIMAL(18,8) NOT NULL,
    `rate_date` DATETIME NOT NULL,
    CONSTRAINT `fk_rate_base_currency` FOREIGN KEY (`base_currency`) REFERENCES `currency`(`iso_code`),
    CONSTRAINT `fk_rate_target_currency` FOREIGN KEY (`target_currency`) REFERENCES `currency`(`iso_code`)
);

CREATE TABLE `user` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(120) NOT NULL,
    `last_name` VARCHAR(120) NOT NULL,
    `login` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL
);

CREATE TABLE `transaction` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `transaction_date` DATETIME NOT NULL,
    `user_login` VARCHAR(100) NOT NULL,
    `source_amount` DECIMAL(18,2) NOT NULL,
    `source_currency` VARCHAR(10) NOT NULL,
    `target_currency` VARCHAR(10) NOT NULL,
    `exchange_rate` DECIMAL(18,8) NOT NULL,
    `status` ENUM('pending', 'approved', 'cancelled') NOT NULL DEFAULT 'pending',
    CONSTRAINT `fk_transaction_user_login` FOREIGN KEY (`user_login`) REFERENCES `user`(`login`),
    CONSTRAINT `fk_transaction_source_currency` FOREIGN KEY (`source_currency`) REFERENCES `currency`(`iso_code`),
    CONSTRAINT `fk_transaction_target_currency` FOREIGN KEY (`target_currency`) REFERENCES `currency`(`iso_code`)
);

INSERT INTO `currency` (`iso_code`, `name`, `countries`) VALUES
('CHF', 'Swiss Franc', 'Switzerland, Liechtenstein'),
('EUR', 'Euro', 'Austria, Belgium, France, Germany, Italy, Spain, Vatican City'),
('USD', 'United States Dollar', 'United States'),
('GBP', 'Pound Sterling', 'United Kingdom');

INSERT INTO `rate` (`base_currency`, `target_currency`, `rate_value`, `rate_date`) VALUES
('CHF', 'EUR', 1.03000000, NOW()),
('CHF', 'USD', 1.12000000, NOW()),
('EUR', 'CHF', 0.97000000, NOW()),
('USD', 'CHF', 0.89000000, NOW());

INSERT INTO `user` (`first_name`, `last_name`, `login`, `password`) VALUES
('Max', 'Muster', 'max', 'max123'),
('Anna', 'Beispiel', 'anna', 'anna123');

INSERT INTO `transaction` (`transaction_date`, `user_login`, `source_amount`, `source_currency`, `target_currency`, `exchange_rate`, `status`) VALUES
(NOW(), 'max', 120.00, 'CHF', 'EUR', 1.03000000, 'pending'),
(NOW(), 'anna', 90.00, 'EUR', 'CHF', 0.97000000, 'approved');
