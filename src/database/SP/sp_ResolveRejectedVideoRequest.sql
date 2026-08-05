CREATE OR ALTER PROCEDURE [dbo].[sp_ResolveRejectedVideoRequest]
(
    @RejectedRequestId INT,
    @VideoType VARCHAR(50),
    @AssignedBy VARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @jobCardNo VARCHAR(50);
        DECLARE @customerName VARCHAR(150);
        DECLARE @isResolved BIT;

        SELECT 
            @jobCardNo = jobCardNo,
            @customerName = customerName,
            @isResolved = isResolved
        FROM dbo.rejected_video_requests
        WHERE id = @RejectedRequestId;

        IF @jobCardNo IS NULL
        BEGIN
            RAISERROR('Rejected video request not found.', 16, 1);
            RETURN;
        END

        IF @isResolved = 1
        BEGIN
            RAISERROR('Rejected video request is already resolved.', 16, 1);
            RETURN;
        END

        -- Mark as resolved
        UPDATE dbo.rejected_video_requests
        SET isResolved = 1,
            updatedAt = SYSDATETIME()
        WHERE id = @RejectedRequestId;

        -- Create pending video request
        INSERT INTO dbo.video_requests_pending (
            jobCardNo,
            customerName,
            videoType,
            status,
            assignedBy,
            date,
            isActive,
            createdAt
        )
        VALUES (
            @jobCardNo,
            @customerName,
            @VideoType,
            'Pending',
            @AssignedBy,
            SYSDATETIME(),
            1,
            SYSDATETIME()
        );

        -- Return the newly created pending request
        SELECT 
            SCOPE_IDENTITY() AS id,
            @jobCardNo AS jobCardNo,
            @customerName AS customerName,
            @VideoType AS videoType,
            'Pending' AS status,
            @AssignedBy AS assignedBy,
            FORMAT(SYSDATETIME(), 'yyyy-MM-dd') AS date,
            1 AS isActive;

    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
