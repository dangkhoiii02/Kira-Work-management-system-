CREATE OR ALTER PROCEDURE dbo.sp_Task_ListByProject
  @project_id INT,
  @q VARCHAR(200) = '',
  @status_id INT = NULL,
  @priority_id INT = NULL,
  @assignee_id INT = NULL,
  @page INT = 1,
  @page_size INT = 20
AS
BEGIN
  SET NOCOUNT ON;

  IF @page < 1 SET @page = 1;
  IF @page_size < 1 SET @page_size = 20;

  DECLARE @offset INT = (@page - 1) * @page_size;

  ;WITH base AS (
    SELECT t.id, t.title, t.percent_done, t.due_date, t.updated_at,
           s.name AS status_name, p.name AS priority_name, u.nick_name AS assignee_name
    FROM dbo.Tasks t
    JOIN dbo.Statuses s  ON s.id=t.status_id
    LEFT JOIN dbo.Priorities p ON p.id=t.priority_id
    LEFT JOIN dbo.Users u ON u.id=t.assignee_id
    WHERE t.project_id=@project_id
      AND (@q='' OR t.title LIKE '%'+@q+'%' OR t.description LIKE '%'+@q+'%')
      AND (@status_id  IS NULL OR t.status_id=@status_id)
      AND (@priority_id IS NULL OR t.priority_id=@priority_id)
      AND (@assignee_id IS NULL OR t.assignee_id=@assignee_id)
  )
  SELECT * FROM base
  ORDER BY updated_at DESC, id DESC
  OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;

  SELECT COUNT(*) AS total
  FROM dbo.Tasks t
  WHERE t.project_id=@project_id
    AND (@q='' OR t.title LIKE '%'+@q+'%' OR t.description LIKE '%'+@q+'%')
    AND (@status_id  IS NULL OR t.status_id=@status_id)
    AND (@priority_id IS NULL OR t.priority_id=@priority_id)
    AND (@assignee_id IS NULL OR t.assignee_id=@assignee_id);
END
GO
