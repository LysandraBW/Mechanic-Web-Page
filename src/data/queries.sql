-- CREATE TABLE customer (
-- 	customerID INT PRIMARY KEY,
--     firstName VARCHAR(30),
--     lastName VARCHAR(30),
--     emailAddress VARCHAR(50),
--     phoneNumber VARCHAR(15),
--     contactBy VARCHAR(10),
--     VIN VARCHAR(20),
--     make TEXT,
--     modelName TEXT,
--     modelYear TEXT,
--     services TEXT,
--     appointmentDate DATE,
--     appointmentTime TIME,
--     appointmentStatus VARCHAR(10),
--     appointmentDuration VARCHAR(10),
--     appointmentCost DECIMAL(4,2)
-- )



-- DROP TABLE customer

-- USE mechanic;
SELECT * FROM customer;

-- SELECT firstName, lastName FROM customer WHERE make = "BMW"

-- SELECT * FROM customer WHERE make = "BMW"


-- ALTER TABLE customer DROP COLUMN appointmentStatus;
-- ALTER TABLE customer ADD COLUMN appointmentStatus varchar(15) DEFAULT "Unscheduled";


-- USE mechanic;

-- ALTER TABLE customer ADD dateCreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 

USE mechanic;
ALTER TABLE customer ADD COLUMN seen BOOLEAN DEFAULT false;
ALTER TABLE customer ADD COLUMN marked BOOLEAN DEFAULT false;

CREATE TABLE appointments (
	dateCreated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	ID INT PRIMARY KEY,
      firstName VARCHAR(30),
      lastName VARCHAR(30),
      emailAddress VARCHAR(50),
      phoneNumber VARCHAR(15),
      contactBy VARCHAR(10),
      VIN VARCHAR(20),
      make TEXT,
      modelName TEXT,
      modelYear TEXT,
      services TEXT,
      apStatus VARCHAR(15) DEFAULT "unscheduled",
      apDate DATE,
      apTime TIME,
      apCost DECIMAL(4,2),
      statusSeen BOOLEAN DEFAULT false,
      statusMark BOOLEAN DEFAULT false
)
