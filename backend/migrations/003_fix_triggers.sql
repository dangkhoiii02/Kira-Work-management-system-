-- Bỏ 2 trigger cũ (nếu tồn tại)
IF OBJECT_ID('dbo.trg_Tasks_SetUpdatedAt','TR') IS NOT NULL
  DROP TRIGGER dbo.trg_Tasks_SetUpdatedAt;
IF OBJECT_ID('dbo.trg_Tasks_ClampPercent','TR') IS NOT NULL
  DROP TRIGGER dbo.trg_Tasks_ClampPercent;
GO

-- Trigger mới: normalize percent_done + set updated_at chỉ 1 lần
CREATE OR ALTER TRIGGER dbo.trg_Tasks_Normalize
ON dbo.Tasks
AFTER INSERT, UPDATE
AS
BEGIN
  SET NOCOUNT ON;

  -- Ngăn lặp (lần kích hoạt thứ 2 trở đi sẽ thoát)
  IF (TRIGGER_NESTLEVEL() > 1) RETURN;

  UPDATE t
  SET
    percent_done = CASE
      WHEN t.percent_done IS NULL THEN 0
      WHEN t.percent_done < 0 THEN 0
      WHEN t.percent_done > 100 THEN 100
      ELSE t.percent_done
    END,
    updated_at = SYSDATETIME()
  FROM dbo.Tasks t
  INNER JOIN inserted i ON t.id = i.id;
END
GO
