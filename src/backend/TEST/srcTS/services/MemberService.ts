import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { poolConnect } from "../utils/dbConnection.js";

export class MemberService{
    // Lấy thông tin của 1 member bằng ID 
    async getMember(id: string) {
        const [member] = await poolConnect.query('SELECT * FROM member WHERE UserID = ?', [id]);
        return member as RowDataPacket[];
    }

}