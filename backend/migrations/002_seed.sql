IF NOT EXISTS (SELECT 1 FROM dbo.Statuses)
INSERT INTO dbo.Statuses(name) VALUES (N'OPEN'),(N'IN_PROGRESS'),(N'DONE');

IF NOT EXISTS (SELECT 1 FROM dbo.Priorities)
INSERT INTO dbo.Priorities(name, weight)
VALUES (N'LOW',1),(N'MEDIUM',5),(N'HIGH',8),(N'URGENT',10);
