DROP DATABASE IF EXISTS Milk_Shop;
CREATE DATABASE Milk_Shop;
USE Milk_Shop;

CREATE TABLE BRAND (
    BrandID VARCHAR(10) NOT NULL PRIMARY KEY,
    Name NVARCHAR(30),
    Content NVARCHAR(100)
);

CREATE TABLE PRODUCT (
    ProductID VARCHAR(10) NOT NULL PRIMARY KEY,
    BrandID VARCHAR(10),
    Name NVARCHAR(30),
    Price INT NOT NULL,
    Expiration DATE,
    Quantity INT NOT NULL,
    Content TEXT,
    Status NVARCHAR(20),
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (BrandID) REFERENCES BRAND(BrandID)
);

CREATE TABLE MEMBER (
    UserID VARCHAR(10) NOT NULL PRIMARY KEY,
    Password VARCHAR(255),
    Name NVARCHAR(30),
    RewardPoints INT NOT NULL,
    Email VARCHAR(50),
    Phone VARCHAR(15) NOT NULL,
    Address NVARCHAR(100),
    Verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE STAFF (
    StaffID VARCHAR(10) NOT NULL PRIMARY KEY,
    Password VARCHAR(255),
    Name NVARCHAR(30),
    PhoneNumber VARCHAR(15) NOT NULL
);

CREATE TABLE ADMIN (
    AdminID VARCHAR(10) NOT NULL PRIMARY KEY,
    Password VARCHAR(255),
    Name NVARCHAR(30)
);

CREATE TABLE FEEDBACK (
    FeedbackID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID VARCHAR(10),
    UserID VARCHAR(10),
    Rating INT NOT NULL,
    Content NVARCHAR(100),
    FOREIGN KEY (ProductID) REFERENCES PRODUCT(ProductID),
    FOREIGN KEY (UserID) REFERENCES MEMBER(UserID)
);

CREATE TABLE VOUCHER (
    VoucherID INT AUTO_INCREMENT PRIMARY KEY,
    Discount NVARCHAR(20),
    VoucherQuantity INT NOT NULL,
    Expiration DATE,
    Content NVARCHAR(100)
);

CREATE TABLE BLOG (
    BlogID VARCHAR(10) NOT NULL PRIMARY KEY,
    StaffID VARCHAR(10),
    Name NVARCHAR(100),
    CreatedDate DATE,
    Content TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (StaffID) REFERENCES STAFF(StaffID)
);

CREATE TABLE GUEST (
    GuestID INT AUTO_INCREMENT PRIMARY KEY,
    Name NVARCHAR(30),
    Email VARCHAR(50),
    Phone VARCHAR(15) NOT NULL,
    Address NVARCHAR(100)
);

CREATE TABLE WISHLIST (
    ProductID VARCHAR(10),
    UserID VARCHAR(10),
    FOREIGN KEY (ProductID) REFERENCES PRODUCT(ProductID),
    FOREIGN KEY (UserID) REFERENCES MEMBER(UserID)
);

CREATE TABLE CART (
    ProductID VARCHAR(10),
    UserID VARCHAR(10),
    CartQuantity INT NOT NULL,
    FOREIGN KEY (ProductID) REFERENCES PRODUCT(ProductID),
    FOREIGN KEY (UserID) REFERENCES MEMBER(UserID)
);

CREATE TABLE `ORDER` (
    OrderID VARCHAR(10) NOT NULL PRIMARY KEY,
    ProductID VARCHAR(10),
    UserID VARCHAR(10),
    GuestID INT,
    VoucherID INT,
    OrderQuantity INT NOT NULL,
    Status NVARCHAR(20),
    Tracking NVARCHAR(15),
    Payment NVARCHAR(20),
    FOREIGN KEY (ProductID) REFERENCES PRODUCT(ProductID),
    FOREIGN KEY (UserID) REFERENCES MEMBER(UserID),
    FOREIGN KEY (GuestID) REFERENCES GUEST(GuestID),
    FOREIGN KEY (VoucherID) REFERENCES VOUCHER(VoucherID)
);

CREATE TABLE `temp_member` (
  `Password` varchar(255) DEFAULT NULL,
  `Name` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Phone` varchar(15) DEFAULT NULL,
  `Address` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Token` varchar(255) DEFAULT NULL,
  `TempMemberID` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`TempMemberID`)
);

INSERT INTO BRAND (BrandID, Name, Content) VALUES 
('BR001', 'MamaMilk', 'Nutritional milk for pregnant moms'),
('BR002', 'KidGrow', 'Milk formula for children growth'),
('BR003', 'BabyStrong', 'Infant formula with essential vitamins'),
('BR004', 'NutriMom', 'Organic milk for expecting mothers'),
('BR005', 'HealthyKids', 'Fortified milk for toddlers');

INSERT INTO PRODUCT (ProductID, BrandID, Name, Price, Expiration, Quantity, Content, Status) VALUES 
('P001', 'BR001', 'MamaMilk Original', 25000, '2025-06-30', 100, 'Rich in folic acid and iron', 'Available'),
('P002', 'BR001', 'MamaMilk Chocolate', 27000, '2025-08-15', 80, 'Rich in calcium and vitamin D', 'Available'),
('P003', 'BR002', 'KidGrow Stage 1', 20000, '2024-12-01', 50, 'For infants 0-6 months', 'Available'),
('P004', 'BR002', 'KidGrow Stage 2', 22000, '2025-01-20', 60, 'For infants 6-12 months', 'Available'),
('P005', 'BR003', 'BabyStrong Premium', 30000, '2024-11-30', 40, 'With DHA and ARA for brain development', 'Available'),
('P006', 'BR003', 'BabyStrong Soy', 28000, '2025-02-10', 30, 'Lactose-free soy formula', 'Available'),
('P007', 'BR004', 'NutriMom Organic', 35000, '2025-05-01', 70, 'Certified organic milk for pregnant women', 'Available'),
('P008', 'BR004', 'NutriMom Vanilla', 37000, '2025-07-18', 90, 'Vanilla flavored organic milk', 'Available'),
('P009', 'BR005', 'HealthyKids Toddler', 23000, '2024-12-25', 110, 'Fortified with vitamins and minerals for toddlers', 'Available'),
('P010', 'BR005', 'HealthyKids Junior', 24000, '2025-03-05', 95, 'For children 1-3 years', 'Available'),
('P011', 'BR002', 'KidGrow Stage 3', 26000, '2025-04-15', 50, 'For toddlers 12-24 months', 'Available'),
('P012', 'BR003', 'BabyStrong Lactose-Free', 32000, '2025-01-30', 55, 'Lactose-free infant formula', 'Available'),
('P013', 'BR004', 'NutriMom Strawberry', 38000, '2025-06-20', 65, 'Strawberry flavored organic milk', 'Available'),
('P014', 'BR001', 'MamaMilk Plus', 29000, '2025-03-12', 45, 'Enhanced with probiotics', 'Available'),
('P015', 'BR005', 'HealthyKids Advanced', 27000, '2024-12-15', 75, 'Advanced formula with omega-3', 'Available');

    INSERT INTO STAFF (StaffID, Password, Name, PhoneNumber) VALUES
('S001', 'staff123', 'Emily Johnson', '0123456789'),
('S002', 'staff456', 'Michael Brown', '0987654321'),
('S003', 'staff789', 'Sarah Davis', '0567891234');

INSERT INTO BLOG (BlogID, StaffID, Name, CreatedDate, Content)
VALUES
    ('B0001', 'S001', 'Introduction to SQL', '2023-06-01', 'This blog post will cover the basics of SQL and its importance in data management.'),
    ('B0002', 'S002', 'Advanced SQL Techniques', '2023-06-10', 'In this post, we will explore some advanced SQL techniques like window functions and analytic queries.'),
    ('B0003', 'S003', 'Database Normalization', '2023-06-15', 'Normalization is a crucial process in database design. This post will explain the different normal forms and their importance.'),
    ('B0004', 'S001', 'Indexing Strategies', '2023-06-20', 'Proper indexing can significantly improve query performance. Learn how to create and maintain indexes in this post.'),
    ('B0005', 'S002', 'SQL Security Best Practices', '2023-06-25', 'Ensuring data security is essential. This post will cover best practices for securing your SQL databases.');
