import './Brand.css';
function Brand() {
    return (
        <div>
            <ul class="menu">
                <li class="menu-item">
                    <a href="#">Sửa bột cao cấp</a>
                </li>
                <li class="menu-item has-submenu">
                    <a href="#">Vitamin & sức khỏe</a>
                    <ul class="submenu">
                        <li class="submenu-item"><a href="#">Vitamin cho bé</a></li>
                        <li class="submenu-item"><a href="#">Men vi sinh</a></li>
                        <li class="submenu-item"><a href="#">Thực phẩm lợi sữa</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}

export default Brand;