-- Create a new table called 'collages' in schema 'dbo'
-- Drop the table if it already exists

IF OBJECT_ID('dbo.search', 'U') IS NOT NULL
DROP TABLE dbo.search
GO
-- Create the table in the specified schema


-- CREATE TABLE dbo.collages
-- (
--     collagesId INT NOT NULL PRIMARY KEY, -- primary key column
--     promptKey int NOT NULL,
--     CONSTRAINT FK_prompt FOREIGN KEY (promptKey) 
--         REFERENCES dbo.prompts (promptsId)
--         ON DELETE CASCADE
--         ON UPDATE CASCADE,
--     creator [NVARCHAR](50) NOT NULL,
--     stars [NVARCHAR](50) NULL,
--     imageKey int NOT NULL,
--     CONSTRAINT FK_image FOREIGN KEY (imageKey) 
--         REFERENCES dbo.images (imagesId)
--         ON DELETE CASCADE
--         ON UPDATE CASCADE,
-- );

-- CREATE TABLE dbo.prompts
-- (
--     promptsId INT NOT NULL PRIMARY KEY, -- primary key column
--     promptText [NVARCHAR](50) NOT NULL,
--     count INT NOT NULL,
-- );

-- CREATE TABLE dbo.images
-- (
--     imagesId INT NOT NULL PRIMARY KEY, -- primary key column
--     imagesrc varbinary(max),
-- );


-- CREATE TABLE dbo.keywords
-- (
--     keywordsId INT NOT NULL PRIMARY KEY, -- primary key column
--     votes INT NOT NULL,
--     collage int NOT NULL,
--     CONSTRAINT FK_collage FOREIGN KEY (collage) 
--         REFERENCES dbo.collages (collagesId)
--         ON DELETE CASCADE
--         ON UPDATE CASCADE,
--     keywordText [NVARCHAR](50) NOT NULL,
-- );

-- CREATE TABLE dbo.search
-- (
--     searchId INT NOT NULL PRIMARY KEY, -- primary key column
--     collage int NOT NULL,
--     CONSTRAINT FK_collageSearch FOREIGN KEY (collage) 
--         REFERENCES dbo.collages (collagesId)
--         ON DELETE CASCADE
--         ON UPDATE CASCADE,
--     searchTerm [NVARCHAR](50) NOT NULL,
-- );


-- GO

-- id, promptkey, creator, stars, keyword keys,imagekey
--keyword, votes, keyinmain table
--keyword, id
--id, prompt, count
--id, image
--id, searchterm