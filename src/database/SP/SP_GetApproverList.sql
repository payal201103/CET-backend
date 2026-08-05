-- SP_GetApproverList
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetApproverList]
(
    @page INT = 0,
    @limit INT = 10,
    @search VARCHAR(100) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DECLARE @sql NVARCHAR(MAX);
        DECLARE @countSql NVARCHAR(MAX);
        DECLARE @whereClause NVARCHAR(MAX) = '';
        DECLARE @paginationClause NVARCHAR(MAX) = '';
        DECLARE @params NVARCHAR(MAX);

        SET @whereClause = ' WHERE um.roleId = 5 AND um.isActive = 1 ';

        IF @search IS NOT NULL
        BEGIN
            SET @whereClause = @whereClause + '
                AND (
                    CAST(AM.approverId AS VARCHAR) LIKE @search + ''%''
                    OR AM.name LIKE @search + ''%''
                    OR um.mobileNo LIKE @search + ''%''
                    OR DM.districtName LIKE @search + ''%''
                    OR BM.blockName LIKE @search + ''%''
                )';
        END

        IF @page IS NOT NULL AND @limit IS NOT NULL
        BEGIN
            SET @paginationClause = '
                ORDER BY DM.districtName ASC OFFSET (@page * @limit) ROWS FETCH NEXT @limit ROWS ONLY';
        END
        ELSE
        BEGIN
            SET @paginationClause = ' ORDER BY DM.districtName ASC';
        END

        SET @sql = N'
            SELECT
                CAST(um.userId AS INT) AS userId,
                AM.approverId,
                AM.name,
                um.entityId,
                um.mobileNo,
                DM.districtName,
                BM.blockName
            FROM user_master um
            INNER JOIN approver_master AM
                ON um.userName = AM.approverId
            LEFT JOIN district_master DM
                ON AM.districtId = DM.districtId
            LEFT JOIN block_master BM
                ON AM.blockId = BM.blockId'
            + @whereClause
            + @paginationClause;

        SET @countSql = N'
            SELECT COUNT(AM.approverId) AS total
            FROM user_master um
            INNER JOIN approver_master AM
                ON um.userName = AM.approverId
            LEFT JOIN district_master DM
                ON AM.districtId = DM.districtId
            LEFT JOIN block_master BM
                ON AM.blockId = BM.blockId'
            + @whereClause;

        SET @params = N'
            @page INT,
            @limit INT,
            @search VARCHAR(100)';

        EXEC sp_executesql
            @sql, @params, @page, @limit, @search;

        EXEC sp_executesql
            @countSql, @params, @page, @limit, @search;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
