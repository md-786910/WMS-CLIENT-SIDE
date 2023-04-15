import React from "react";
import { backDark } from "../utils/color";

function Footer() {
    return (
        <div class="container-fluid  footer" style={{ backgroundColor: backDark }}>
            <footer class="py-3 my-4 border-top">
                <p class="col-md-4 mb-0 text-body-secondary">Working Management System</p>
            </footer>
        </div>
    );
}

export default Footer;
