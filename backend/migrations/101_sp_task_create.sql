CREATE OR ALTER PROCEDURE dbo.sp_Task_Create
  @project_id   INT,
  @title        VARCHAR(200),
  @description  VARCHAR(MAX) = NULL,
  @status_id    INT,
  @priority_id  INT = NULL,
  @assignee_id  INT = NULL,
  @start_date   DATETIME2 = NULL,
  @due_date     DATETIME2 = NULL,
  @creator_id   INT,
  @labels_csv   VARCHAR(MAX) = NULL
AS
BEGIN
  SET NOCOUNT ON;
  BEGIN TRY
    BEGIN TRAN;

    IF NOT EXISTS (SELECT 1 FROM dbo.Projects WHERE id=@project_id)
      THROW 50001, 'Project not found', 1;
    IF NOT EXISTS (SELECT 1 FROM dbo.Statuses WHERE id=@status_id)
      THROW 50002, 'Status not found', 1;

    DECLARE @new_id INT;
    INSERT INTO dbo.Tasks(project_id,title,description,status_id,priority_id,assignee_id,
                          percent_done,start_date,due_date,creator_id)
    VALUES(@project_id,@title,@description,@status_id,@priority_id,@assignee_id,
           0,@start_date,@due_date,@creator_id);
    SET @new_id = SCOPE_IDENTITY();

    IF (@labels_csv IS NOT NULL AND LEN(@labels_csv)>0)
    BEGIN
      ;WITH cte AS (SELECT TRY_CAST(value AS INT) AS label_id FROM STRING_SPLIT(@labels_csv, ','))
      INSERT INTO dbo.TaskLabels(task_id,label_id)
      SELECT @new_id, c.label_id
      FROM cte c
      WHERE c.label_id IS NOT NULL
        AND EXISTS (SELECT 1 FROM dbo.Labels l WHERE l.id=c.label_id);
    END

    COMMIT TRAN;

    SELECT t.*, s.name AS status_name, p.name AS priority_name,
           u.nick_name AS assignee_name
    FROM dbo.Tasks t
    LEFT JOIN dbo.Statuses s   ON s.id=t.status_id
    LEFT JOIN dbo.Priorities p ON p.id=t.priority_id
    LEFT JOIN dbo.Users u      ON u.id=t.assignee_id
    WHERE t.id=@new_id;
  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRAN;
    THROW;
  END CATCH
END
GO
