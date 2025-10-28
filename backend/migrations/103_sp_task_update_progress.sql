CREATE OR ALTER PROCEDURE dbo.sp_Task_UpdateProgress
  @task_id INT,
  @percent_done INT
AS
BEGIN
  SET NOCOUNT ON;

  IF NOT EXISTS (SELECT 1 FROM dbo.Tasks WHERE id=@task_id)
    THROW 50021, 'Task not found', 1;

  IF @percent_done < 0 SET @percent_done = 0;
  IF @percent_done > 100 SET @percent_done = 100;

  UPDATE dbo.Tasks
  SET percent_done = @percent_done
  WHERE id=@task_id;

  SELECT id, percent_done, updated_at
  FROM dbo.Tasks
  WHERE id=@task_id;
END
GO
