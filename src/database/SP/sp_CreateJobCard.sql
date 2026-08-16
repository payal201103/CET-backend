CREATE OR ALTER PROCEDURE [dbo].[sp_CreateJobCard]
    @JobCardNo VARCHAR(50),
    @CustomerId INT,
    @BrandId INT,
    @ModelId INT,
    @CarNumber VARCHAR(50),
    @CarColor VARCHAR(50),
    @Services VARCHAR(1000),
    @BookingDate DATETIME,
    @DeliveryDate DATETIME,
    @SpecialNotes VARCHAR(MAX),
    @Status VARCHAR(50),
    @CreatedBy INT,
    @BranchId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @UserBranchId INT;
        DECLARE @UserActualRole VARCHAR(50);

        SELECT @UserBranchId = branchId, @UserActualRole = role FROM dbo.users WHERE userID = @CreatedBy;

        DECLARE @EffectiveBranchId INT = @BranchId;
        IF @UserActualRole <> 'Super Admin'
        BEGIN
            SET @EffectiveBranchId = @UserBranchId;
        END

        INSERT INTO dbo.job_cards (
            jobCardNo, 
            customerId, 
            brandId, 
            modelId, 
            carNumber, 
            carColor, 
            services, 
            bookingDate, 
            deliveryDate, 
            specialNotes, 
            status, 
            createdBy, 
            branchId,
            createdAt
        )
        VALUES (
            @JobCardNo, 
            @CustomerId, 
            @BrandId, 
            @ModelId, 
            @CarNumber, 
            @CarColor, 
            @Services, 
            @BookingDate, 
            @DeliveryDate, 
            @SpecialNotes, 
            @Status, 
            @CreatedBy, 
            @EffectiveBranchId,
            SYSDATETIME()
        );

        SELECT 
            SCOPE_IDENTITY() as id, 
            @JobCardNo as jobCardNo,
            @EffectiveBranchId as branchId;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
