import React from "react";
import Company from "./Company";
import IssueResolver from "./IssueResolver";
import Github from "./Github";
import ExpenceHome from "./ExpenceHome";
import { PageHeader } from "../ui/chrome";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="content-stack">
            <PageHeader
                breadcrumb="WMS · Home"
                title="Dashboard"
                sub="Companies, issues, repos & spend — clean at a glance."
                right={
                    <>
                        <Link to="/add-company" className="btn btn-sm btn-ink">
                            Manage companies
                        </Link>
                        <Link to="/add-issues" className="btn btn-sm btn-redis">
                            + New issue
                        </Link>
                    </>
                }
            />
            <div id="dashboard-companies"><Company /></div>
            <div id="dashboard-issues"><IssueResolver /></div>
            <div id="dashboard-github"><Github /></div>
            <div id="dashboard-spend"><ExpenceHome /></div>
        </div>
    );
}

export default Home;
