-- ===== SCHEMA (tables + triggers) =====

IF OBJECT_ID('dbo.Users','U') IS NULL
CREATE TABLE dbo.Users(
  id INT IDENTITY(1,1) PRIMARY KEY,
  nick_name  VARCHAR(120) NOT NULL,
  email      VARCHAR(120) NOT NULL UNIQUE,
  username   VARCHAR(255) NULL,
  password   VARCHAR(255) NULL,
  avatar     VARCHAR(255) NULL,
  created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

IF OBJECT_ID('dbo.Projects','U') IS NULL
CREATE TABLE dbo.Projects(
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(40) NULL UNIQUE,
  owner_id INT NULL REFERENCES dbo.Users(id),
  created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

IF OBJECT_ID('dbo.Statuses','U') IS NULL
CREATE TABLE dbo.Statuses(
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(40) NOT NULL UNIQUE
);

IF OBJECT_ID('dbo.Priorities','U') IS NULL
CREATE TABLE dbo.Priorities(
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(20) NOT NULL UNIQUE,
  weight INT NULL
);

IF OBJECT_ID('dbo.Labels','U') IS NULL
CREATE TABLE dbo.Labels(
  id INT IDENTITY(1,1) PRIMARY KEY,
  name  VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(10) NULL
);

IF OBJECT_ID('dbo.Tasks','U') IS NULL
CREATE TABLE dbo.Tasks(
  id           INT IDENTITY(1,1) PRIMARY KEY,
  project_id   INT NOT NULL REFERENCES dbo.Projects(id),
  title        VARCHAR(200) NOT NULL,
  description  VARCHAR(MAX) NULL,
  status_id    INT NOT NULL REFERENCES dbo.Statuses(id),
  priority_id  INT NULL REFERENCES dbo.Priorities(id),
  assignee_id  INT NULL REFERENCES dbo.Users(id),
  percent_done INT NULL DEFAULT 0,
  start_date   DATETIME2 NULL,
  due_date     DATETIME2 NULL,
  creator_id   INT NOT NULL REFERENCES dbo.Users(id),
  created_at   DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
  updated_at   DATETIME2 NULL
);

IF OBJECT_ID('dbo.Attachments','U') IS NULL
CREATE TABLE dbo.Attachments(
  id          INT IDENTITY(1,1) PRIMARY KEY,
  task_id     INT NOT NULL REFERENCES dbo.Tasks(id),
  file_name   VARCHAR(255) NULL,
  file_url    VARCHAR(MAX) NULL,
  uploaded_by INT NULL REFERENCES dbo.Users(id),
  uploaded_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

IF OBJECT_ID('dbo.Comments','U') IS NULL
CREATE TABLE dbo.Comments(
  id         INT IDENTITY(1,1) PRIMARY KEY,
  task_id    INT NOT NULL REFERENCES dbo.Tasks(id),
  author_id  INT NOT NULL REFERENCES dbo.Users(id),
  content    VARCHAR(MAX) NULL,
  parent_id  INT NULL REFERENCES dbo.Comments(id),
  created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

IF OBJECT_ID('dbo.TaskLabels','U') IS NULL
CREATE TABLE dbo.TaskLabels(
  task_id  INT NOT NULL REFERENCES dbo.Tasks(id),
  label_id INT NOT NULL REFERENCES dbo.Labels(id),
  CONSTRAINT PK_TaskLabels PRIMARY KEY (task_id, label_id)
);
GO

-- Trigger: updated_at
CREATE OR ALTER TRIGGER dbo.trg_Tasks_SetUpdatedAt
ON dbo.Tasks
AFTER INSERT, UPDATE
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE t SET updated_at = SYSDATETIME()
  FROM dbo.Tasks t
  INNER JOIN inserted i ON t.id = i.id;
END
GO

-- Trigger: clamp percent_done (0..100)
CREATE OR ALTER TRIGGER dbo.trg_Tasks_ClampPercent
ON dbo.Tasks
AFTER INSERT, UPDATE
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE t SET percent_done =
    CASE
      WHEN t.percent_done IS NULL THEN 0
      WHEN t.percent_done < 0 THEN 0
      WHEN t.percent_done > 100 THEN 100
      ELSE t.percent_done
    END
  FROM dbo.Tasks t
  INNER JOIN inserted i ON t.id = i.id;
END
GO
