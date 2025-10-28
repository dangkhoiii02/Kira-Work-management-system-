CREATE OR ALTER PROCEDURE dbo.sp_User_Register
  @nick_name  VARCHAR(120),
  @email      VARCHAR(120),
  @username   VARCHAR(255) = NULL,
  @password   VARCHAR(255),       -- bcrypt hash từ app
  @avatar     VARCHAR(255) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  IF EXISTS (SELECT 1 FROM dbo.Users WHERE email = @email)
  BEGIN
    THROW 50101, 'Email already used', 1;
  END

  DECLARE
      @uid  INT,
      @pid  INT,
      @base NVARCHAR(40),
      @code NVARCHAR(40);

  BEGIN TRY
    BEGIN TRAN;

    INSERT INTO dbo.Users(nick_name, email, username, password, avatar)
    VALUES (@nick_name, @email, @username, @password, @avatar);

    SET @uid = SCOPE_IDENTITY();

    -- Tạo mã project duy nhất: <NICKNAME_NO_SPACE>_<uid>
    SET @base = UPPER(REPLACE(LTRIM(RTRIM(@nick_name)), ' ', ''));
    IF (@base IS NULL OR @base = N'') SET @base = N'PRJ';
    SET @code = LEFT(@base, 20) + N'_' + CONVERT(NVARCHAR(10), @uid);

    INSERT INTO dbo.Projects(name, code, owner_id)
    VALUES (@nick_name, @code, @uid);

    SET @pid = SCOPE_IDENTITY();

    -- recordset #1: user
    SELECT id, nick_name, email, username, avatar, created_at
    FROM dbo.Users
    WHERE id = @uid;

    -- recordset #2: project
    SELECT id, name, code, owner_id, created_at
    FROM dbo.Projects
    WHERE id = @pid;

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRAN;

    DECLARE @errMsg NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR(@errMsg, 16, 1);
    RETURN;
  END CATCH
END
GO
