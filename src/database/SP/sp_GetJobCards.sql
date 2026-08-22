CREATE OR ALTER PROCEDURE [dbo].[sp_GetJobCards]
    @UserId INT,
    @UserRole VARCHAR(50),
    @BranchId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @UserBranchId INT;
        DECLARE @UserActualRole VARCHAR(50);

        SELECT @UserBranchId = branchId, @UserActualRole = role FROM dbo.users WHERE userID = @UserId;

        DECLARE @EffectiveBranchId INT;
        IF @UserActualRole = 'Super Admin'
        BEGIN
            SET @EffectiveBranchId = @BranchId;
        END
        ELSE
        BEGIN
            SET @EffectiveBranchId = @UserBranchId;
        END

        SELECT 
            j.id, 
            j.jobCardNo, 
            j.customerId, 
            c.name as customer, 
            c.mobile as phone, 
            j.brandId, 
            cb.name as carBrand, 
            j.modelId, 
            cm.name as carModel, 
            (cb.name + ' ' + cm.name) as vehicle, 
            j.carNumber, 
            j.carColor, 
            'Exotic' as company, 
            'Unassigned' as employee, 
            j.status, 
            j.services, 
            j.bookingDate, 
            j.deliveryDate, 
            j.specialNotes as notes, 
            j.createdAt, 
            j.createdBy,
            j.branchId
        FROM dbo.job_cards j 
        LEFT JOIN dbo.customers c ON j.customerId = c.id 
        LEFT JOIN dbo.car_brands cb ON j.brandId = cb.id 
        LEFT JOIN dbo.car_models cm ON j.modelId = cm.id 
        WHERE (@EffectiveBranchId IS NULL OR j.branchId = @EffectiveBranchId)
        ORDER BY j.id DESC;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO
