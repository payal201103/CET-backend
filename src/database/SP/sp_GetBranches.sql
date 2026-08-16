CREATE OR ALTER PROCEDURE [dbo].[sp_GetBranches]
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            branchId,
            branchName,
            city,
            isActive
        FROM dbo.branches
        ORDER BY branchName ASC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
