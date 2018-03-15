/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "react-select/dist/react-select.css";
import Results from "./Results";

// DatePicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

@connect(store => {
    return {
        reports: store.models.reports,
        project: store.page.project.id
    };
})
export default class Reports extends React.Component {
    render() {
        const { project, reports } = this.props;
        const row_count = Math.round(Math.ceil(reports.ids.length / 3)),
            row_indexes = Array.from(Array(row_count).keys()),
            col_indexes = Array.from(Array(3).keys());
        return (
            <div>
                {row_indexes.map(row => {
                    return (
                        <div className="row" key={row}>
                            {col_indexes.map(col => {
                                const index = row * 3 + col,
                                    id = reports.ids[index];
                                if (id === undefined) {
                                    return;
                                }
                                return (
                                    <Report
                                        project={project}
                                        report={reports.objects[id]}
                                        key={id}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}

class Report extends React.Component {
    constructor(props) {
        super(props);
        const { report } = props;
        this.state = {
            show_description: true,
            date_selection:
                report.url.indexOf("{start_date}") > -1 || report.url.indexOf("{end_date}") > -1,
            start_date: undefined,
            end_date: undefined
        };
        this.downloadReport = this.downloadReport.bind(this);
        this.toggleDescription = this.toggleDescription.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
    }

    downloadReport(format) {
        const { report: { url }, project } = this.props;
        let { start_date, end_date } = this.state;
        let download_url;
        download_url = url.replace("{format}", format).replace("{project}", project);
        if (this.state.date_selection) {
            if (end_date && start_date && start_date > end_date) {
                // Swap start and end dates if end date is before start date
                start_date = end_date;
                end_date = this.state.start_date;
            }
            download_url = start_date
                ? download_url.replace("{start_date}", start_date.toISOString())
                : download_url.replace("p_StartDate={start_date}", "");
            download_url = end_date
                ? download_url.replace("{end_date}", end_date.toISOString())
                : download_url.replace("p_EndDate={end_date}", "");
            download_url = download_url.replace(/&+/g, "&").replace(/&$/, "");
        }
        console.log("Downloading report from", download_url);
        this.toggleDescription();
        window.location.assign(download_url);
    }

    toggleDescription() {
        this.setState({ show_description: !this.state.show_description });
    }

    setStartDate(start_date) {
        this.setState({ start_date });
    }

    setEndDate(end_date) {
        this.setState({ end_date });
    }

    render() {
        const { project, report } = this.props;
        const { show_description, date_selection, start_date, end_date } = this.state;
        const formats = report.formats.map(format => {
            const { icon, name, display_name } = format;
            return (
                <ReportFormatButton
                    download={this.downloadReport}
                    icon={icon}
                    format_name={name}
                    display_name={display_name}
                    url={report.url}
                    key={format.name}
                />
            );
        });
        const date_selectors = (
            <div>
                <div>
                    <div>Start Date</div>
                    <DatePicker onChange={this.setStartDate} selected={start_date} />
                </div>
                <div>
                    <div>End Date</div>
                    <DatePicker onChange={this.setEndDate} selected={end_date} />
                </div>
            </div>
        );
        return (
            <div className="col-xs-4" onClick={this.onClick}>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">{report.title}</h3>
                    </div>
                    <div className="panel-body">
                        {show_description ? (
                            <div onClick={this.toggleDescription}>{report.description}</div>
                        ) : (
                            <div>
                                {date_selection ? date_selectors : undefined}
                                {formats}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

class ReportFormatButton extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        e.stopPropagation();
        this.props.download(this.props.format_name);
    }

    render() {
        const { icon, display_name } = this.props;
        const icon_class = `fa fa-${icon}`,
            text = `Download ${display_name}`;
        return (
            <button className="btn btn-default" onClick={this.onClick}>
                <i className={icon_class} />
                <span>&nbsp;&nbsp;</span>
                <span>{text}</span>
            </button>
        );
    }
}
