CREATE OR ALTER PROCEDURE dbo.sp_User_GetByEmail
  @email VARCHAR(120)
AS
BEGIN
  SET NOCOUNT ON;
  SELECT TOP 1 id, nick_name, email, username, password, avatar, created_at
  FROM dbo.Users
  WHERE email=@email;
END
GO
