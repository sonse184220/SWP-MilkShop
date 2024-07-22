import DataTable from 'react-data-table-component';
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TablePagination from '@mui/material/TablePagination';

import './Report.css'
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { GetUserReport } from '../../services/report/getUserReport';

export function Report({ isMember }) {
    const MemberToken = 'Bearer ' + sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')).UserID : "Guest";

    const [reports, setReports] = React.useState([]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(1);
    const [totalCount, setTotalCount] = React.useState(0);

    const handleGetUserReport = async () => {
        try {
            let limit = 5
            let cpage = page + 1;
            let sort = "";
            let status = "";
            const response = await GetUserReport(MemberToken, userId, limit, cpage, sort, status);
            if (response.data.total > 0) {
                setReports(response.data.data)
                setTotalCount(response.data.totalPages);
            }
        } catch (error) {

        }
    }

    React.useEffect(() => {
        handleGetUserReport();
    }, [])

    React.useEffect(() => {
        handleGetUserReport();
    }, [page])


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };



    return (
        <>
            <div><Header isMember={isMember} /></div>
            <img className="image" src="/img/pinkbg.jpg" />
            <div className='report-table'
                style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}>
                <TableContainer component={Paper} className="mb-4 overflow-hidden"
                    style={{
                        border: '1px solid #ddd;'
                    }}
                >
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>ReportID</TableCell>
                                <TableCell align="center">OrderType</TableCell>
                                <TableCell align="center">OrderID</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Report Date</TableCell>
                                <TableCell align="center">Update Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reports.map((report) => (
                                <Row key={report.ReportID} row={report} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="report-pagination flex justify-between items-center bg-white  rounded-lg">
                    <TablePagination
                        component="div"
                        count={totalCount}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        // onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[]}
                    />
                </div>
            </div>
            <Footer />
        </>
    );
};


function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    }

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.ReportID}
                </TableCell>
                <TableCell align="center">{row.OrderType}</TableCell>
                <TableCell align="center">{row.OrderID}</TableCell>
                <TableCell align="center">{row.Status === 'open' ? 'Processing' : 'Done'}</TableCell>
                <TableCell align="center">{formatDate(row.created)}</TableCell>
                <TableCell align="center">{formatDate(row.updated)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div" className='text-center'>
                                Report Detail
                            </Typography>
                            <div className='row report-detail'>
                                <div className='col-6'>
                                    <div className='flex row'>
                                        <h5 className='col-2'>Title</h5>
                                        <input className='col-7 form-control'
                                            value={row.Title}
                                            readOnly
                                            style={{ width: '70%' }}
                                        />
                                    </div>
                                    <br />
                                    <div className='flex row'>
                                        <h5 className='col-2'>Content</h5>
                                        <textarea className='col-7 form-control'
                                            value={row.Content}
                                            readOnly
                                            style={{ width: '70%' }}
                                        />
                                    </div>
                                </div>
                                <div className='col-6'>
                                    <h5>Response</h5>
                                    <textarea className='form-control'
                                        value={row.Response}
                                        readOnly
                                        style={{ height: '70%' }}
                                    />
                                </div>
                            </div>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}