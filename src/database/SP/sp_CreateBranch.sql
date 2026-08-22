CREATE OR ALTER PROCEDURE [dbo].[sp_CreateBranch]
(
    @BranchName VARCHAR(150),
    @City VARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        INSERT INTO dbo.branches (branchName, city, isActive, createdAt)
        VALUES (@BranchName, @City, 1, SYSDATETIME());

        SELECT 
            SCOPE_IDENTITY() AS branchId,
            @BranchName AS branchName,
            @City AS city,
            1 AS isActive;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
