import { poolConnect } from "../utils/dbConnection.js";
import { PreorderService } from "../services/PreorderService.js";

const preorderService = new PreorderService();

export class PreorderController {

    async getPreorderHistory(req, res) {

    }

    async placePreorder(req, res) {
        if (req.user.userId !== req.body.userId) {
            return res.status(401).send({ msg: "Unauthorized" });
        }

        
    }

}