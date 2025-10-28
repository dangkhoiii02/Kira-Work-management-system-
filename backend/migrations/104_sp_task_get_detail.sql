CREATE OR ALTER PROCEDURE dbo.sp_Task_GetDetail
  @task_id INT
AS
BEGIN
  SET NOCOUNT ON;

  -- recordset #1: task
  SELECT t.*, s.name AS status_name, p.name AS priority_name,
         au.nick_name AS assignee_name, cu.nick_name AS creator_name,
         pr.name AS project_name, pr.code AS project_code
  FROM dbo.Tasks t
  JOIN dbo.Projects pr ON pr.id=t.project_id
  JOIN dbo.Statuses s  ON s.id=t.status_id
  LEFT JOIN dbo.Priorities p ON p.id=t.priority_id
  LEFT JOIN dbo.Users au ON au.id=t.assignee_id
  JOIN dbo.Users cu ON cu.id=t.creator_id
  WHERE t.id=@task_id;

  -- recordset #2: labels
  SELECT l.*
  FROM dbo.TaskLabels tl
  JOIN dbo.Labels l ON l.id=tl.label_id
  WHERE tl.task_id=@task_id;

  -- recordset #3: attachments
  SELECT * FROM dbo.Attachments WHERE task_id=@task_id ORDER BY uploaded_at DESC;

  -- recordset #4: comments
  SELECT c.*, u.nick_name AS author_name
  FROM dbo.Comments c
  JOIN dbo.Users u ON u.id=c.author_id
  WHERE c.task_id=@task_id
  ORDER BY c.created_at ASC;
END
GO
