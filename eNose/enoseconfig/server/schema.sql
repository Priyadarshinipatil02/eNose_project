--DROP TABLE IF EXISTS user;
--DROP TABLE IF EXISTS logs;
--DROP TABLE IF EXISTS log_codes;
--DROP TABLE IF EXISTS fw_config;

CREATE TABLE IF NOT EXISTS FW_Config (
    deviceName VARCHAR(50) NOT NULL,
    firmwareVersion VARCHAR(50) NOT NULL DEFAULT 'V1.1.2023',
    apiKey VARCHAR(50) NOT NULL DEFAULT 'iomni',
    logRetentionDays INTEGER NOT NULL DEFAULT 7,
    modifiedDateTime TIMESTAMP NOT NULL,
    base_url VARCHAR(250) NOT NULL DEFAULT 'http://api99.iomni.ai:8074/api',
    composite_key VARCHAR(50) NOT NULL DEFAULT 'UIDFSDFUIYFUSYD76FDS678FSDF87',
    site_code VARCHAR(150) NOT NULL,
    demo_mode BOOLEAN DEFAULT False,
    file_path VARCHAR(250) NOT NULL DEFAULT '/home/iomni/Firmware/',
    raspberry_pi_timezone VARCHAR(250) NOT NULL DEFAULT 'Asia/Kolkata',
    precision INTEGER NOT NULL DEFAULT 5,
    enable_sensor_data_log INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS log_codes (
    code INTEGER PRIMARY KEY,
    type INTEGER NOT NULL DEFAULT 2,
    loggerDescription VARCHAR(150) NULL,
    message VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS logs (
  LoggerID INTEGER PRIMARY KEY AUTOINCREMENT,
  Logtime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  LogType INTEGER NOT NULL DEFAULT 3,
  Description TEXT NOT NULL,
  LoggedBy INTEGER NOT NULL,
  FOREIGN KEY (LoggedBy) REFERENCES user (id)
);

CREATE TABLE  IF NOT EXISTS user (
  userId INTEGER PRIMARY KEY AUTOINCREMENT,
  userName VARCHAR(60) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL,
  password VARCHAR(50) NOT NULL,
  userType INTEGER NOT NULL DEFAULT 2,
  lastLogin TIMESTAMP NULL,
  invoke TEXT NULL,
  passwordChanged TIMESTAMP NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy INTEGER NULL,
  status INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (updatedBy) REFERENCES user (userId)
);










