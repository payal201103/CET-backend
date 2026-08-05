-- SP_GetApproverByDistrict
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_GetApproverByDistrict]
(
    @districtId INT,
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

        SET @whereClause = ' WHERE 1=1 ';

        SET @whereClause = @whereClause + '
            AND A.districtId = @districtId';

        IF @search IS NOT NULL
        BEGIN
            SET @whereClause = @whereClause + '
                AND (
                    CAST(A.approverId AS VARCHAR) LIKE @search + ''%''
                    OR A.name LIKE @search + ''%''
                    OR A.mobileNo LIKE @search + ''%''
                    OR DM.designationName LIKE @search + ''%''
                    OR B.blockName LIKE @search + ''%''
                )';
        END

        IF @page IS NOT NULL AND @limit IS NOT NULL
        BEGIN
            SET @paginationClause = '
                ORDER BY A.createdAt DESC
                OFFSET (@page * @limit) ROWS
                FETCH NEXT @limit ROWS ONLY';
        END
        ELSE
        BEGIN
            SET @paginationClause = ' ORDER BY A.createdAt DESC';
        END

        SET @sql = N'
            SELECT
                A.approverId,
                A.name,
                A.districtId,
                A.blockId,
                B.blockName,
                A.mobileNo,
                A.designationId,
                DM.designationName,
                U.isActive
            FROM approver_master A
            INNER JOIN user_master U
                ON U.userName = CAST(A.approverId AS VARCHAR)
            INNER JOIN designation_master DM ON A.designationId = DM.id
            LEFT JOIN block_master B ON A.blockId = B.blockId'
            + @whereClause
            + @paginationClause;

        SET @countSql = N'
            SELECT COUNT(A.approverId) AS total
            FROM approver_master A
            INNER JOIN user_master U
                ON U.userName = CAST(A.approverId AS VARCHAR)
            INNER JOIN designation_master DM ON A.designationId = DM.id
            LEFT JOIN block_master B ON A.blockId = B.blockId'
            + @whereClause;

        SET @params = N'
            @districtId INT,
            @page INT,
            @limit INT,
            @search VARCHAR(50)';

        EXEC sp_executesql
            @sql, @params, @districtId, @page, @limit, @search;

        EXEC sp_executesql
            @countSql, @params, @districtId, @page, @limit, @search;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
