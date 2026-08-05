-- SP_UpsertApprover
GO
CREATE OR ALTER PROCEDURE [dbo].[SP_UpsertApprover]
(
    @approverId BIGINT = NULL,
    @name VARCHAR(100),
    @districtId INT,
    @blockId INT,
    @mobileNo VARCHAR(10) = NULL,
    @designationId INT,
    @isActive INT = NULL,
    @password VARCHAR(500),
    @ipAddress VARCHAR(25)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DECLARE @newApproverId BIGINT;
        DECLARE @lastSeries INT;

        IF @approverId IS NOT NULL
        BEGIN
            UPDATE approver_master
            SET
                mobileNo = @mobileNo,
                designationId = @designationId,
                isActive = @isActive,
                updatedAt = SYSDATETIME(),
                ipAddress = @ipAddress
            WHERE approverId = @approverId;

            UPDATE user_master
            SET
                entityId = CAST(@blockId AS VARCHAR),
                isActive = @isActive,
                mobileNo = @mobileNo,
                updatedAt = SYSDATETIME(),
                ipAddress = @ipAddress
            WHERE userName = CAST(@approverId AS VARCHAR);

            SELECT @approverId AS approverId;
            RETURN;
        END

        -- Next series number within the block
        SELECT @lastSeries = MAX(CAST(RIGHT(CAST(approverId AS VARCHAR), 3) AS INT))
        FROM approver_master
        WHERE LEFT(CAST(approverId AS VARCHAR), LEN(@blockId)) = CAST(@blockId AS VARCHAR);

        IF @lastSeries IS NULL
            SET @lastSeries = 0;

        SET @lastSeries = @lastSeries + 1;

        SET @newApproverId =
            CAST(
                CAST(@blockId AS VARCHAR) +
                RIGHT('000' + CAST(@lastSeries AS VARCHAR), 3)
            AS BIGINT
            );

        INSERT INTO approver_master
        (
            approverId, name, districtId, blockId, mobileNo, designationId, isActive, createdAt, ipAddress
        )
        VALUES
        (
            @newApproverId, @name, @districtId, @blockId, @mobileNo, @designationId, 1, SYSDATETIME(), @ipAddress
        );

        IF NOT EXISTS (SELECT 1 FROM user_master WHERE userName = CAST(@newApproverId AS VARCHAR))
        BEGIN
            INSERT INTO user_master
            (
                roleId, userName, entityId, mobileNo, password, isActive, createdAt, ipAddress
            )
            VALUES
            (
                5, CAST(@newApproverId AS VARCHAR), CAST(@blockId AS VARCHAR), @mobileNo,
                @password, 1, SYSDATETIME(), @ipAddress
            );
        END

        SELECT @newApproverId AS approverId;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
