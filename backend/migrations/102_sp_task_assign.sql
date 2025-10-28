CREATE OR ALTER PROCEDURE dbo.sp_Task_Assign
  @task_id INT,
  @assignee_id INT
AS
BEGIN
  SET NOCOUNT ON;

  IF NOT EXISTS (SELECT 1 FROM dbo.Tasks WHERE id=@task_id)
    THROW 50011, 'Task not found', 1;
  IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE id=@assignee_id)
    THROW 50012, 'Assignee not found', 1;

  UPDATE dbo.Tasks SET assignee_id = @assignee_id WHERE id=@task_id;

  SELECT t.id, t.assignee_id, u.nick_name AS assignee_name, t.updated_at
  FROM dbo.Tasks t
  LEFT JOIN dbo.Users u ON u.id=t.assignee_id
  WHERE t.id=@task_id;
END
GO
