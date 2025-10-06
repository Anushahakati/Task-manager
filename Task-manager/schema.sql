CREATE DATABASE TaskManagementDB;
GO

USE TaskManagementDB;
GO

-- Create the table for Users
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,          
    Email NVARCHAR(255) NOT NULL UNIQUE,   
    PasswordHash NVARCHAR(MAX) NOT NULL,   
    CreatedAt DATETIME2 DEFAULT GETDATE() 
);
GO

USE TaskManagementDB;
GO


-- Create the table for Task
CREATE TABLE Tasks (
    TaskId INT IDENTITY(1,1) PRIMARY KEY,                
    UserId INT NOT NULL,                                  
    Title NVARCHAR(200) NOT NULL,                          
    Description NVARCHAR(MAX),                             
    DueDate DATE,                                          
    Priority NVARCHAR(10) CHECK (Priority IN ('Low', 'Medium', 'High')),  
    Status NVARCHAR(20) CHECK (Status IN ('Pending', 'In Progress', 'Completed')), 
    CreatedAt DATETIME2 DEFAULT GETDATE()                 
);
GO

USE TaskManagementDB;
GO

-- Add the foreign key relationship
ALTER TABLE Tasks
ADD CONSTRAINT FK_Tasks_Users FOREIGN KEY (UserId) REFERENCES Users(UserId);
GO

-- Create a stored procedure to get tasks due today
CREATE PROCEDURE GetTasksDueToday
    @UserId INT
AS
BEGIN
    SELECT TaskId, Title, Description, DueDate, Priority, Status
    FROM Tasks
    WHERE UserId = @UserId AND DueDate = CONVERT(DATE, GETDATE());
END;
GO

