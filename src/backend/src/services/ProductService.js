import { poolConnect, connection } from "../utils/dbConnection.js";
import sharp from 'sharp';


export class ProductService {
    // Lấy thông tin của 1 product bằng ID
    async getProduct(id) {
        const [product] = await poolConnect.query(`SELECT p.*, b.Name AS BrandName
                                                FROM product AS p 
                                                JOIN brand AS b ON p.BrandID = b.BrandID
                                                WHERE ProductID = ?`, [id]);
        return product;
    }

    async getBlogProductList(blogId) {
        const [products] = await poolConnect.query(`SELECT b.Name AS BrandName, p.* 
                                                    FROM blog_products AS bp 
                                                    JOIN product AS p ON bp.ProductID = p.ProductID
                                                    JOIN brand AS b ON p.BrandID = b.BrandID
                                                    WHERE BlogID = ?`,
            [blogId]);
        return products;
    }
    async addProductToBlogProductList(blogId, productId) {
        const [products] = await poolConnect.execute(`INSERT INTO blog_products (BlogID, ProductID)
                                                    VALUES (?,?)`, [blogId, productId]);
        return products;
    }

    async getProductInBlogProductList(blogId, productId) {
        const [product] = await poolConnect.execute(`SELECT * FROM blog_products WHERE BlogID = ? AND ProductID = ?`, [blogId, productId]);
        return product;
    }

    async deleteBlogProductList(blogId) {
        const [result] = await poolConnect.query(`DELETE FROM blog_products WHERE BlogID = ?`, [blogId])
        return result;
    }

    // tìm product trong database bằng name
    async searchProducts(name, limit, sortBy, offset) {
        const search = `%${name}%`;

        const [products] = await poolConnect.query(`SELECT p.*, b.Name AS BrandName
                                                    FROM PRODUCT AS p
                                                    JOIN brand AS b ON p.BrandID = b.BrandID
                                                    WHERE p.Name LIKE ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [search, limit, offset]);
        return products;
    }

    // đếm số lượng product trong database bằng name
    async getTotalProductsByName(name) {
        const search = `%${name}%`;

        const [total] = await poolConnect.query('SELECT COUNT(*) as count FROM PRODUCT WHERE Name LIKE ?', [search]);
        const count = total[0].count;
        return count;
    }

    // tìm product trong database bằng brand id
    async searchProductsByBrand(id, limit, sortBy, offset) {
        const [products] = await poolConnect.query(`SELECT p.*, b.Name AS BrandName 
                                                    FROM PRODUCT AS p
                                                    JOIN brand AS b ON p.BrandID = b.BrandID
                                                    WHERE p.BrandID = ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [id, limit, offset]);
        return products;
    }

    // đếm số lượng product trong database bằng brand id
    async getTotalProductsByBrand(id) {
        const search = id;
        const [total] = await poolConnect.query(`SELECT COUNT(*) as count 
                                                                        FROM PRODUCT 
                                                                        WHERE BrandID = ?`, [search]);

        const count = total[0].count;
        return count;
    }

    // 
    getAllProducts = async (page, limit) => {
        const offset = (page - 1) * limit;
        const query = 'SELECT * FROM PRODUCT LIMIT ? OFFSET ?';

        const [results] = await poolConnect.query(query, [limit, offset]);
        return results;
    };

    getTotalProducts = async () => {
        const query = 'SELECT COUNT(*) as count FROM PRODUCT';

        const [total] = await poolConnect.query(query);
        const count = total[0].count;
        return count;
    };

    // lấy feedback bằng id của nó
    async getFeedback(id) {
        const [feedback] = await poolConnect.query("Select * FROM feedback WHERE FeedbackID = ?", [id]);
        return feedback;
    }

    // lấy feedbacks từ 1 product
    async getFeedbacksByProductID(id) {
        const [feedbacks] = await poolConnect.query(`Select f.*, u.Name
                                                    FROM feedback as f 
                                                    JOIN user as u
                                                    ON f.UserID = u.UserID
                                                    WHERE ProductID = ?`, [id]);
        return feedbacks;
    }

    async searchFeedbacks(content, filterQuery, filterValue, limit, sortBy, offset) {
        const search = `%${content}%`;

        const [feedbacks] = await poolConnect.query(`SELECT 
                                                        f.FeedbackID, f.ProductID,
                                                        p.Name AS ProductName, p.BrandID, b.Name AS BrandName,
                                                        f.UserID, u.Name, f.Rating, f.Content, f.created
                                                    FROM feedback AS f
                                                    JOIN product AS p ON p.ProductID = f.ProductID
                                                    JOIN brand AS b ON b.BrandID = p.BrandID
                                                    JOIN user AS u ON u.UserID = f.UserID
                                                    WHERE f.Content LIKE ? ${filterQuery}
                                                    ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [search, ...filterValue, limit, offset]);
        return feedbacks;
    }
    async getTotalSearchFeedbacks(content, filterQuery, filterValue) {
        const search = `%${content}%`;

        const [total] = await poolConnect.query(`SELECT COUNT(*) as count
                                                FROM feedback AS f
                                                WHERE Content LIKE ? ${filterQuery}`, [search, ...filterValue]);

        const count = total[0].count;
        return count;
    }

    // check xem người dùng đã từng mua sản phẩm này chưa? kể cả order và pre-order
    async checkHasUserPurchasedProduct(userId, productId) {
        const [result] = await poolConnect.query(`SELECT 
                                                EXISTS (
                                                    SELECT 1
                                                    FROM \`order\` AS o
                                                    JOIN order_details AS od ON o.OrderID = od.OrderID
                                                    WHERE o.UserID = ? AND o.Status = 'Done' AND od.ProductID = ?
                                                    LIMIT 1
                                                ) 
                                                OR 
                                                EXISTS (
                                                    SELECT 1
                                                    FROM pre_order
                                                    WHERE UserID = ? AND Status = 'Done'AND ProductID = ?
                                                    LIMIT 1
                                                ) AS result;`,
            [userId, productId, userId, productId]);
        return result;
    }

    // tạo feedback và lưu xuống database
    async createFeedback(productId, userId, rating, content) {
        const [feedback] = await poolConnect.query("INSERT INTO feedback (ProductID, UserID, Rating, Content) VALUES (?, ?, ?, ?)", [productId, userId, rating, content]);
        return feedback;
    }

    // xóa feedback khỏi database
    async removeFeedback(id) {
        const [result] = await poolConnect.query('DELETE FROM feedback WHERE FeedbackID = ?', [id]);
        return result;
    }
    async createProduct(productData, imageBuffer) {
        const { BrandID, Name, Price, Expiration, Quantity, Content, Status } = productData;

        try {
            const getMaxProductIdQuery = 'SELECT MAX(CAST(SUBSTR(ProductID, 2) AS UNSIGNED)) AS maxProductId FROM product WHERE ProductID LIKE "P%"';
            const [maxIdResult] = await poolConnect.query(getMaxProductIdQuery);
            const newProductId = `P${(maxIdResult[0].maxProductId ? maxIdResult[0].maxProductId + 1 : 1).toString().padStart(3, '0')}`;

            const resizedImageBuffer = await sharp(imageBuffer)
                .resize(720, 800)
                .toBuffer();

            const query = `
                INSERT INTO product (ProductID, BrandID, Name, Price, Expiration, Quantity, Content, Status, created, updated, Image)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
            `;
            await poolConnect.query(query, [newProductId, BrandID, Name, Price, Expiration, Quantity, Content, Status, resizedImageBuffer]);
            return { message: "Product created successfully" };
        } catch (error) {
            console.error("Error creating product:", error);
            throw new Error(error.message || "Error creating product");
        }
    }
    async updateProduct(productId, newProductData, imageBuffer) {
        try {
            const [currentData] = await poolConnect.query('SELECT * FROM product WHERE ProductID = ?', [productId]);
            if (currentData.length === 0) {
                return { message: "Product not found" };
            }

            const currentProduct = currentData[0];
            const fieldsToUpdate = [];
            const values = [];

            if (newProductData.BrandID && newProductData.BrandID !== currentProduct.BrandID) {
                fieldsToUpdate.push('BrandID = ?');
                values.push(newProductData.BrandID);
            }
            if (newProductData.Name && newProductData.Name.trim() !== currentProduct.Name) {
                fieldsToUpdate.push('Name = ?');
                values.push(newProductData.Name.trim());
            }
            if (newProductData.Price && newProductData.Price !== currentProduct.Price) {
                fieldsToUpdate.push('Price = ?');
                values.push(newProductData.Price);
            }
            if (newProductData.Expiration && newProductData.Expiration !== currentProduct.Expiration) {
                fieldsToUpdate.push('Expiration = ?');
                values.push(newProductData.Expiration);
            }
            if (newProductData.Quantity && newProductData.Quantity !== currentProduct.Quantity) {
                fieldsToUpdate.push('Quantity = ?');
                values.push(newProductData.Quantity);
            }
            if (newProductData.Content && newProductData.Content.trim() !== currentProduct.Content) {
                fieldsToUpdate.push('Content = ?');
                values.push(newProductData.Content.trim());
            }
            if (newProductData.Status && newProductData.Status !== currentProduct.Status) {
                fieldsToUpdate.push('Status = ?');
                values.push(newProductData.Status);
            }
            if (imageBuffer) {
                try {
                    const resizedImageBuffer = await sharp(imageBuffer)
                        .resize(720, 800)
                        .toBuffer();
                    fieldsToUpdate.push('Image = ?');
                    values.push(resizedImageBuffer);
                } catch (err) {
                    return { message: 'Failed to process image', error: err.message };
                }
            }

            if (fieldsToUpdate.length > 0) {
                const query = `UPDATE product SET ${fieldsToUpdate.join(', ')}, updated = NOW() WHERE ProductID = ?`;
                values.push(productId);

                await poolConnect.query(query, values);
            }

            return { message: 'Product updated successfully' };
        } catch (error) {
            console.error("Error updating product:", error);
            throw new Error(error.message || "Error updating product");
        }
    }
}
